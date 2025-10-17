import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import PredictorSection from "@/components/PredictorSection";
import DataVisualization from "@/components/DataVisualization";
import MethodologySection from "@/components/MethodologySection";

const Index = () => {
  const predictorRef = useRef<HTMLDivElement>(null);

  const scrollToPredictor = () => {
    predictorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={scrollToPredictor} />
      <div ref={predictorRef}>
        <PredictorSection />
      </div>
      <DataVisualization />
      <MethodologySection />
      
      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI for SDG 1
            </div>
            <p className="text-muted-foreground">
              Leveraging machine learning to accelerate progress toward No Poverty
            </p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#methodology" className="hover:text-primary transition-colors">Methodology</a>
              <a href="#predictor" className="hover:text-primary transition-colors">Try Demo</a>
              <a href="https://sdgs.un.org/goals/goal1" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                UN SDG 1
              </a>
            </div>
            <div className="text-xs text-muted-foreground pt-4">
              © 2025 AI for SDG 1. Built with Lovable AI & Lovable Cloud.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;