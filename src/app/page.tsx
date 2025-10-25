import DivineSection from "@/components/pages/Homepage/DivineSection/DivineSection";
import FeaturedSection from "@/components/pages/Homepage/FeaturedSection/FeaturedSection";
import HeroSection from "@/components/pages/Homepage/HeroSection/HeroSection";
import IslamicLearningSection from "@/components/pages/Homepage/IslamicLearningSection/IslamicLearningSection";
import JourneySection from "@/components/pages/Homepage/JourneySection/JourneySection";
import NewsletterSection from "@/components/pages/Homepage/NewsletterSection/NewsletterSection";
import SurahDisplay from "@/components/pages/Homepage/SurahDisplay/SurahDisplay";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <DivineSection />
      <SurahDisplay />
      <JourneySection />
      <IslamicLearningSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
