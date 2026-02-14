import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description:
      "Try SGStudio and see the magic. No credit card required.",
    features: [
      "2 video generations",
      "1-minute video format",
      "Basic visual templates",
      "Standard voiceover",
    ],
    cta: "Get Started",
    popular: false,
    bg: "bg-card",
    accent: "bg-primary/15",
  },
  {
    name: "Monthly",
    price: "$19.99",
    period: "/month",
    description:
      "Full access for active creators and marketers.",
    features: [
      "Unlimited video generation",
      "All platform formats",
      "Voice memo input",
      "AI script refinement",
      "Custom brand visuals",
      "Priority rendering",
    ],
    cta: "Start Monthly",
    popular: true,
    bg: "bg-primary",
    accent: "bg-card",
  },
  {
    name: "Yearly",
    price: "$149.99",
    period: "/year",
    description:
      "Best value. Save over 35% compared to monthly billing.",
    features: [
      "Everything in Monthly",
      "7-day free trial",
      "Save 37% annually",
      "Early access to new features",
      "Bulk video generation",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: false,
    bg: "bg-card",
    accent: "bg-primary/15",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative px-6 py-24 md:py-32 bg-primary/[0.1]"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-xl border-[3px] border-foreground bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground neo-shadow-sm">
            Pricing
          </span>
          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-6xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg font-medium leading-relaxed text-muted-foreground">
            A fraction of agency costs. Choose the plan that fits your video
            production needs.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-[3px] border-foreground ${plan.bg} p-8 neo-shadow-lg ${
                plan.popular ? "lg:-mt-4 lg:pb-12" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-xl border-[3px] border-foreground bg-accent px-5 py-1.5 text-sm font-bold text-accent-foreground neo-shadow-sm">
                  Most Popular
                </div>
              )}

              <h3
                className={`text-xl font-bold ${
                  plan.popular
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={`text-5xl font-bold ${
                    plan.popular
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-base font-semibold ${
                    plan.popular
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className={`mt-3 text-sm font-medium leading-relaxed ${
                  plan.popular
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {plan.description}
              </p>

              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 block w-full rounded-xl border-[3px] border-foreground px-6 py-3 text-center text-base font-bold transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow-sm ${
                  plan.popular
                    ? "bg-card text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {plan.cta}
              </a>

              <ul
                className={`mt-6 space-y-3 border-t-[3px] pt-6 ${
                  plan.popular
                    ? "border-primary-foreground/30"
                    : "border-foreground/20"
                }`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-foreground ${
                        plan.popular ? "bg-card" : "bg-primary/30"
                      }`}
                    >
                      <Check className="h-3 w-3 text-foreground" />
                    </div>
                    <span
                      className={`font-medium ${
                        plan.popular
                          ? "text-primary-foreground/90"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
