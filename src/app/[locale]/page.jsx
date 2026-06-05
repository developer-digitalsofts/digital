import Hero from "@/components/sections/Hero.jsx";
import TrustedBy from "@/components/sections/TrustedBy.jsx";
import StatsStrip from "@/components/sections/StatsStrip.jsx";
import AboutUs from "@/components/sections/AboutUs.jsx";
import Features from "@/components/sections/Features.jsx";
import ModulesSection from "@/components/sections/ModulesSection.jsx";
import MidCta from "@/components/sections/MidCta.jsx";
import IndustriesSection from "@/components/sections/IndustriesSection.jsx";
import FAQSection from "@/components/sections/FAQSection.jsx";
import FinalCta from "@/components/sections/FinalCta.jsx";

export default function LocaleHomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <StatsStrip />
      <AboutUs />
      <Features />
      <ModulesSection />
      <MidCta />
      <IndustriesSection />
      <FAQSection />
      <FinalCta />
    </>
  );
}
