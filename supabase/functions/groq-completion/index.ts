
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ API key not configured");
    }

    const { model, messages, temperature, max_tokens, response_format } = await req.json();
    
    // Validate required parameters
    if (!model) {
      throw new Error("Missing required parameter: model");
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Missing or invalid parameter: messages");
    }

    console.log(`Making GROQ API request with model: ${model}`);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature || 0.3,
        max_tokens: max_tokens || 2000,
        response_format: response_format || { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROQ API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get AI completion");
    }

    const data = await response.json();
    console.log("GROQ API response received successfully");
    
    // Extract and parse the JSON content from the response
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    return new Response(JSON.stringify({ result: parsedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in groq-completion function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
