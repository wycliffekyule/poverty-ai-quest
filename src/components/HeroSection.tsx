import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20" />
      </div>

      {/* Animated Glow Effect */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-card">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Poverty Analysis</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Machine Learning
            </span>
            <br />
            <span className="text-foreground">
              Meets SDG 1
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Leveraging advanced AI and neural networks to predict poverty risk, 
            optimize resource allocation, and accelerate progress toward 
            <span className="text-primary font-semibold"> No Poverty</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">700M+</div>
              <div className="text-sm text-muted-foreground">People in extreme poverty</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">AI</div>
              <div className="text-sm text-muted-foreground">Powered predictions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary">SDG 1</div>
              <div className="text-sm text-muted-foreground">No Poverty</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={onGetStarted}
            >
              Try AI Predictor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-card/50 backdrop-blur-sm"
              onClick={() => {
                document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;