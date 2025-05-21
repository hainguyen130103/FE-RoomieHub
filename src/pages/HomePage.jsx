import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import JobSection from "../components/home/JobSection";
import RealEstateSection from "../components/home/RealEstateSection";
import TrainingSection from "../components/home/TrainingSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import NewsSection from "../components/home/NewsSection";

const HomePage = () => {
  return (
    <div className="font-sans">
      <HeroSection />
      <FeatureSection
        title="ROOMIEHUB sẽ giúp bạn tìm việc thế nào?"
        type="job"
      />
      <JobSection />
      <FeatureSection
        title="ROOMIEHUB sẽ giúp bạn tìm nhà thế nào?"
        type="realestate"
      />
      <RealEstateSection />
      <TrainingSection />
      <NewsSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
