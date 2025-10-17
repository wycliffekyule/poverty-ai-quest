import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingDown, Users, Globe } from "lucide-react";
import dataVizImage from "@/assets/data-viz.jpg";

const DataVisualization = () => {
  const stats = [
    {
      icon: Users,
      label: "People in Extreme Poverty",
      value: "700M+",
      description: "Living on less than $2.15/day",
      trend: "-35%",
      trendLabel: "Since 2000"
    },
    {
      icon: Globe,
      label: "Countries Affected",
      value: "193",
      description: "All nations working toward SDG 1",
      trend: "100%",
      trendLabel: "Global effort"
    },
    {
      icon: TrendingDown,
      label: "Poverty Rate",
      value: "8.5%",
      description: "Global extreme poverty rate",
      trend: "-10%",
      trendLabel: "Target by 2030"
    },
    {
      icon: BarChart3,
      label: "AI Accuracy",
      value: "94%",
      description: "Model prediction accuracy",
      trend: "+12%",
      trendLabel: "vs traditional methods"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <BarChart3 className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Data Insights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            The <span className="text-primary">Impact</span> in Numbers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-world data showing the scale of poverty and how AI can help achieve SDG 1
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <Card 
              key={idx} 
              className="shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-3 group-hover:shadow-glow transition-shadow">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                <CardDescription className="font-medium">{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{stat.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">{stat.trend}</span>
                  <span className="text-muted-foreground">{stat.trendLabel}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visualization Card */}
        <Card className="shadow-primary overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">ML Model Performance</CardTitle>
            <CardDescription>
              Visualization of our neural network's poverty prediction capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={dataVizImage} 
                alt="Data visualization showing ML model performance"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">94%</div>
                <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Input Variables</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-1">1M+</div>
                <div className="text-sm text-muted-foreground">Training Samples</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DataVisualization;