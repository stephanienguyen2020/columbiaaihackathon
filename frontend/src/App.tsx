import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Platforms from './sections/Platforms';
import HowItWorks from './sections/HowItWorks';
import Pricing from './sections/Pricing';
import CTASection from './sections/CTASection';
import FooterV0 from './sections/FooterV0';

function App() {
  return (
    <div className="min-h-screen bg-neo-cream">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Platforms />
        <HowItWorks />
        <Pricing />
        <CTASection />
      </main>
      <FooterV0 />
    </div>
  );
}

export default App;
