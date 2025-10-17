import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Loader2, AlertCircle, TrendingUp, Target, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  riskScore: number;
  riskCategory: string;
  keyFactors: string[];
  recommendations: string[];
  sdgTargets: string[];
}

const PredictorSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const [formData, setFormData] = useState({
    income: "",
    education: "",
    employment: "",
    householdSize: "",
    location: "",
    healthAccess: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('poverty-predictor', {
        body: {
          income: parseFloat(formData.income),
          education: formData.education,
          employment: formData.employment,
          householdSize: parseInt(formData.householdSize),
          location: formData.location,
          healthAccess: formData.healthAccess
        }
      });

      if (error) throw error;

      if (data.success) {
        setResult(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "AI model has generated poverty risk assessment",
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to complete analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section id="predictor" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Poverty Risk <span className="text-primary">Predictor</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our machine learning model analyzes multiple socioeconomic factors to predict poverty risk and provide targeted interventions
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>
                Enter individual or household data for ML analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (USD)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="500"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select 
                    value={formData.education}
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No formal education">No formal education</SelectItem>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary</SelectItem>
                      <SelectItem value="Higher education">Higher education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment">Employment Status</Label>
                  <Select 
                    value={formData.employment}
                    onValueChange={(value) => setFormData({ ...formData, employment: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="householdSize">Household Size</Label>
                  <Input
                    id="householdSize"
                    type="number"
                    placeholder="4"
                    value={formData.householdSize}
                    onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Type</Label>
                  <Select 
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rural">Rural</SelectItem>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Peri-urban">Peri-urban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthAccess">Healthcare Access</Label>
                  <Select 
                    value={formData.healthAccess}
                    onValueChange={(value) => setFormData({ ...formData, healthAccess: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hero"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 w-4 h-4" />
                      Run AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                ML-generated poverty risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                  <Brain className="w-16 h-16 mb-4 opacity-20" />
                  <p>Enter data and run analysis to see results</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">AI model processing...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  {/* Risk Score */}
                  <div className="text-center p-6 bg-gradient-card rounded-lg border">
                    <div className="text-6xl font-bold mb-2">
                      <span className={getRiskColor(result.riskCategory)}>
                        {result.riskScore}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Risk Score</div>
                    <div className={`text-lg font-semibold ${getRiskColor(result.riskCategory)}`}>
                      {result.riskCategory} Risk
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Key Risk Factors</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.keyFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold">Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-accent mt-1">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SDG Targets */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold">Relevant SDG 1 Targets</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.sdgTargets.map((target, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-secondary mt-1">✓</span>
                          <span>{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PredictorSection;