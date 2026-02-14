"""
White Circle AI compliance service.

Integrates with White Circle's Session Check API for:
- PRE-generation: validate the marketing script before spending on image/video gen
- POST-generation: check the final video narration/content for compliance

API: POST https://{region}.whitecircle.ai/api/session/check
Docs: https://docs.whitecircle.ai

White Circle evaluates the LAST message in the messages array against all
policies in the deployment. Previous messages serve as context.
"""

import httpx
from typing import Optional

from config import settings
from schemas import ComplianceResult, MarketingScript


# ── White Circle API Client ──────────────────────────────────────────────────

class WhiteCircleClient:
    """Async client for White Circle's Session Check API."""

    def __init__(self):
        self.base_url = settings.whitecircle_base_url.rstrip("/")
        self.api_key = settings.whitecircle_api_key
        self.deployment_id = settings.whitecircle_deployment_id
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "whitecircle-version": "2025-12-01",
        }

    async def check_session(
        self,
        messages: list[dict],
        external_session_id: Optional[str] = None,
        include_context: bool = False,
        metadata: Optional[dict] = None,
    ) -> dict:
        """
        Post a session check request to White Circle.

        White Circle evaluates ONLY the last message against deployment policies.
        Previous messages provide context.

        Args:
            messages: List of message dicts with "role" and "content" keys.
                      Roles: "user", "assistant", "system", "developer", "tool"
            external_session_id: Your session ID for context merging across calls
            include_context: If True, WC auto-prepends previous messages from this session
            metadata: Optional dict with session/environment/user info

        Returns:
            {
                "flagged": bool,
                "internal_session_id": "...",
                "policies": {
                    "<policy_id>": {
                        "flagged": bool,
                        "flagged_source": ["text", "image"],
                        "name": "Policy Name"
                    }
                }
            }
        """
        payload: dict = {
            "deployment_id": self.deployment_id,
            "messages": messages,
        }

        if external_session_id:
            payload["external_session_id"] = external_session_id
        if include_context:
            payload["include_context"] = include_context
        if metadata:
            payload["metadata"] = metadata

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/api/session/check",
                headers=self.headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()


# ── Singleton ────────────────────────────────────────────────────────────────

_wc_client: Optional[WhiteCircleClient] = None


def get_wc_client() -> WhiteCircleClient:
    global _wc_client
    if _wc_client is None:
        _wc_client = WhiteCircleClient()
    return _wc_client


# ── Helper: parse WC response into our ComplianceResult ─────────────────────

def _parse_wc_response(result: dict) -> ComplianceResult:
    """Convert White Circle API response to our ComplianceResult schema."""
    flagged = result.get("flagged", False)
    policies = result.get("policies", {})

    flagged_issues = []
    for policy_id, policy_data in policies.items():
        if policy_data.get("flagged", False):
            name = policy_data.get("name", policy_id)
            sources = policy_data.get("flagged_source", [])
            flagged_issues.append(f"{name} (source: {', '.join(sources)})")

    return ComplianceResult(
        passed=not flagged,
        decision="flagged" if flagged else "clean",
        actions=[],
        flagged_issues=flagged_issues,
        raw_response=result,
    )


# ── PRE-generation check ────────────────────────────────────────────────────

async def check_script_compliance(
    script: MarketingScript,
    session_id: Optional[str] = None,
) -> ComplianceResult:
    """
    PRE-GENERATION CHECK: Validate the marketing script before
    spending resources on image/video generation.

    Sends the full script as an "assistant" message so White Circle
    evaluates it against all policies in the deployment.
    The system message provides context about what this content is.
    """
    client = get_wc_client()

    # Build the full script text
    script_text = f"Marketing Video Script: {script.title}\n"
    script_text += f"Target Audience: {script.target_audience}\n"
    script_text += f"Tone: {script.tone}\n"
    script_text += f"Call to Action: {script.cta}\n\n"

    for scene in script.scenes:
        script_text += (
            f"Scene {scene.scene_number} ({scene.duration_seconds}s):\n"
            f"  Narration: {scene.narration}\n"
            f"  Visuals: {scene.visual_description}\n\n"
        )

    # WC evaluates the LAST message — so we put the script last
    messages = [
        {
            "role": "system",
            "content": (
                "This is a marketing video script generated by an AI pipeline. "
                "Check it for compliance: no misleading claims, no prohibited content, "
                "no trademark violations, no inappropriate imagery descriptions, "
                "and brand safety."
            ),
        },
        {
            "role": "assistant",
            "content": script_text,
        },
    ]

    metadata = {
        "session": {
            "pipeline_stage": "pre_generation",
            "content_type": "marketing_video_script",
        },
    }

    try:
        result = await client.check_session(
            messages=messages,
            external_session_id=session_id,
            metadata=metadata,
        )
        return _parse_wc_response(result)

    except httpx.HTTPStatusError as e:
        return ComplianceResult(
            passed=False,
            decision="error",
            flagged_issues=[
                f"White Circle API error: {e.response.status_code} - {e.response.text}"
            ],
            raw_response={"error": str(e)},
        )
    except Exception as e:
        # Fail-open for hackathon; set passed=False for production
        return ComplianceResult(
            passed=True,
            decision="service_unavailable",
            flagged_issues=[f"Compliance check unavailable: {str(e)}"],
            raw_response={"error": str(e)},
        )


# ── POST-generation check ───────────────────────────────────────────────────

async def check_video_compliance(
    script: MarketingScript,
    video_path: str,
    session_id: Optional[str] = None,
) -> ComplianceResult:
    """
    POST-GENERATION CHECK: Verify the final assembled content
    against compliance policies before delivery.

    Uses include_context=True if the same session_id was used in
    pre-check, so WC has the full conversation history.
    """
    client = get_wc_client()

    # Combine all narration as the final output to check
    full_narration = " ".join(scene.narration for scene in script.scenes)

    final_content = (
        f"FINAL MARKETING VIDEO OUTPUT\n"
        f"Title: {script.title}\n"
        f"Target Audience: {script.target_audience}\n"
        f"Full narration: {full_narration}\n"
        f"Call to Action: {script.cta}"
    )

    messages = [
        {
            "role": "assistant",
            "content": final_content,
            "metadata": {
                "assistant": {
                    "model_name": "vidpipe-pipeline",
                },
            },
        },
    ]

    metadata = {
        "session": {
            "pipeline_stage": "post_generation",
            "content_type": "marketing_video_final",
            "video_file": video_path,
        },
    }

    try:
        result = await client.check_session(
            messages=messages,
            external_session_id=session_id,
            include_context=bool(session_id),
            metadata=metadata,
        )
        return _parse_wc_response(result)

    except Exception as e:
        return ComplianceResult(
            passed=True,
            decision="service_unavailable",
            flagged_issues=[f"Post-gen compliance check unavailable: {str(e)}"],
            raw_response={"error": str(e)},
        )
