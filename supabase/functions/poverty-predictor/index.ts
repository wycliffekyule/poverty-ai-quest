import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      income,
      education,
      employment,
      householdSize,
      location,
      healthAccess
    } = await req.json();

    console.log('Poverty prediction request:', { income, education, employment, householdSize, location, healthAccess });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create a comprehensive prompt for the ML model
    const systemPrompt = `You are an advanced AI model specialized in poverty risk assessment and socioeconomic analysis. 
Your task is to analyze individual and household factors to predict poverty risk levels and provide actionable recommendations.

You should consider multiple dimensions:
- Economic factors (income, employment stability)
- Human capital (education level)
- Social factors (household composition, location)
- Access to services (healthcare, infrastructure)

Provide a comprehensive analysis with:
1. A poverty risk score (0-100, where 100 is highest risk)
2. A risk category (Low, Medium, High, Critical)
3. Key risk factors identified
4. Specific, actionable recommendations for poverty reduction
5. Relevant SDG 1 targets that apply to this case`;

    const userPrompt = `Analyze the following case for poverty risk:

Income: $${income} per month
Education Level: ${education}
Employment Status: ${employment}
Household Size: ${householdSize} people
Location Type: ${location}
Healthcare Access: ${healthAccess}

Provide a detailed poverty risk assessment with specific recommendations.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_poverty_risk",
              description: "Analyze poverty risk factors and provide structured assessment",
              parameters: {
                type: "object",
                properties: {
                  riskScore: {
                    type: "number",
                    description: "Poverty risk score from 0-100"
                  },
                  riskCategory: {
                    type: "string",
                    enum: ["Low", "Medium", "High", "Critical"],
                    description: "Overall risk category"
                  },
                  keyFactors: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key risk factors identified"
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Actionable recommendations"
                  },
                  sdgTargets: {
                    type: "array",
                    items: { type: "string" },
                    description: "Relevant SDG 1 targets"
                  }
                },
                required: ["riskScore", "riskCategory", "keyFactors", "recommendations", "sdgTargets"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_poverty_risk" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ 
      success: true,
      analysis 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in poverty-predictor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});