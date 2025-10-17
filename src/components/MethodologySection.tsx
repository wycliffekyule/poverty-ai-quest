import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Network, LineChart, Zap } from "lucide-react";

const MethodologySection = () => {
  const methods = [
    {
      icon: Brain,
      title: "Neural Networks",
      description: "Deep learning models trained on global poverty datasets to identify complex patterns and risk factors",
      techniques: ["Multi-layer perceptrons", "Feature extraction", "Pattern recognition"]
    },
    {
      icon: Network,
      title: "Supervised Learning",
      description: "Classification algorithms trained on labeled poverty data to predict risk categories and outcomes",
      techniques: ["Random forests", "Gradient boosting", "SVM classifiers"]
    },
    {
      icon: LineChart,
      title: "Regression Analysis",
      description: "Predictive models analyzing socioeconomic variables to forecast poverty indicators and trends",
      techniques: ["Multiple regression", "Time series", "Causal inference"]
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "AI-powered edge computing for instant analysis and intervention recommendations at scale",
      techniques: ["Stream processing", "Low-latency inference", "Automated alerts"]
    }
  ];

  return (
    <section id="methodology" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">ML Methodology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="text-primary">AI</span> Tackles Poverty
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our machine learning approach combines multiple AI techniques to create comprehensive poverty risk assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {methods.map((method, idx) => (
            <Card 
              key={idx}
              className="shadow-card hover:shadow-primary transition-all duration-300 group cursor-pointer"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">{method.title}</CardTitle>
                <CardDescription className="text-base">
                  {method.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">Key Techniques:</div>
                  <ul className="space-y-1">
                    {method.techniques.map((tech, techIdx) => (
                      <li key={techIdx} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SDG Integration */}
        <Card className="shadow-primary max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Integration with SDG 1: No Poverty</CardTitle>
            <CardDescription className="text-base">
              Our AI solution directly addresses UN Sustainable Development Goal 1 targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">1.1</div>
                <div>
                  <div className="font-semibold mb-1">Extreme Poverty Eradication</div>
                  <div className="text-sm text-muted-foreground">
                    Our model identifies individuals at highest risk of extreme poverty, enabling targeted interventions
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">1.2</div>
                <div>
                  <div className="font-semibold mb-1">Reduce Poverty by Half</div>
                  <div className="text-sm text-muted-foreground">
                    AI-driven resource optimization helps governments allocate support more effectively
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">1.4</div>
                <div>
                  <div className="font-semibold mb-1">Equal Access to Resources</div>
                  <div className="text-sm text-muted-foreground">
                    Machine learning identifies gaps in access to economic resources and basic services
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">1.5</div>
                <div>
                  <div className="font-semibold mb-1">Build Resilience</div>
                  <div className="text-sm text-muted-foreground">
                    Predictive models help vulnerable populations prepare for and recover from economic shocks
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MethodologySection;