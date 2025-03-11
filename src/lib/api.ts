
import { toast } from "sonner";

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "deepseek-r1-distill-llama-70b";

export interface PlaceholderPosition {
  page: number;
  x: number;
  y: number;
}

export interface FontDetection {
  font_name: string;
  font_size: number;
}

export interface AIResponse {
  auto_filled_data: Record<string, string>;
  placeholder_positions: Record<string, PlaceholderPosition>;
  font_detection: FontDetection;
}

export const fetchAICompletion = async (
  placeholders: string[],
  templateContext: string,
  userData?: Record<string, string>
): Promise<AIResponse> => {
  try {
    // Prepare the system message and user prompts
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant that helps fill in PDF form templates.
        - Analyze the template context and placeholder names to understand what information is needed
        - Use the user-provided data if available to fill in placeholders
        - For missing data, generate reasonable values that match the context of the document
        - Maintain proper formatting for dates, currency, names, etc. based on the context
        - Return responses in JSON format matching the expected structure
        - Always return a valid JSON response with auto_filled_data, placeholder_positions, and font_detection`,
    };
    
    const userMessage = {
      role: "user",
      content: `I need to fill in a PDF template with the following placeholders: ${placeholders.join(', ')}.
        
        The document context is: ${templateContext}
        
        ${
          userData && Object.keys(userData).length > 0
            ? `I have provided the following information: ${JSON.stringify(userData)}`
            : "I haven't provided any specific information, please suggest appropriate values."
        }
        
        Please analyze the context and provide values for each placeholder. Return the response in this JSON format:
        {
          "auto_filled_data": {
            // key-value pairs for each placeholder
          },
          "placeholder_positions": {
            // detected positions for each placeholder
          },
          "font_detection": {
            "font_name": "detected font name",
            "font_size": detected font size
          }
        }`,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [systemMessage, userMessage],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get AI completion");
    }

    const data = await response.json();
    
    // Extract and parse the JSON content from the response
    const content = data.choices[0].message.content;
    const parsedContent: AIResponse = JSON.parse(content);
    
    return parsedContent;
  } catch (error) {
    console.error("AI completion error:", error);
    toast.error("Failed to get AI suggestions. Please try again.");
    throw error;
  }
};

export const detectPlaceholders = (pdfText: string): string[] => {
  // This is a simple regex to detect placeholders (underscores)
  // In a real implementation, this would be more sophisticated with PDF parsing
  const placeholderRegex = /_{3,}/g;
  const matches = pdfText.match(placeholderRegex) || [];
  
  // Return unique placeholder names based on their positions
  // This is simplified - in reality, we'd need more context from the PDF
  return Array.from(new Set(matches)).map((_, index) => `placeholder_${index + 1}`);
};
