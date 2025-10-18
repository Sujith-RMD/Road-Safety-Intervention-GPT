import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, InterventionResult, Intervention } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const interventionSchema = {
  type: Type.OBJECT,
  properties: {
    suggestion: { type: Type.STRING, description: "A specific, actionable intervention." },
    impactScore: { type: Type.NUMBER, description: "A score from 1 (low) to 10 (high) indicating the potential effectiveness." },
    costEstimate: { type: Type.STRING, description: "A brief cost estimate (e.g., 'Low', 'Medium', 'High')." },
    rationale: { type: Type.STRING, description: "A brief rationale explaining why this is an innovative or particularly effective solution." },
  },
  required: ["suggestion", "impactScore", "costEstimate", "rationale"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
        type: Type.OBJECT,
        description: "The top two recommended interventions based on cost and impact.",
        properties: {
            bestLowCost: { ...interventionSchema, description: "The single best intervention that has a 'Low' cost and high impact." },
            bestHighImpact: { ...interventionSchema, description: "The single intervention with the absolute highest impact score, regardless of cost." },
        },
    },
    shortTerm: {
      type: Type.ARRAY,
      description: "A list of immediate, low-cost, or easily implementable interventions.",
      items: interventionSchema,
    },
    longTerm: {
      type: Type.ARRAY,
      description: "A list of more comprehensive, higher-cost, or infrastructure-related interventions.",
      items: interventionSchema,
    },
  },
  required: ["shortTerm", "longTerm", "recommendations"],
};

const createPromptText = (scenario: Scenario): string => {
  const isImageOnly = scenario.image && !scenario.accidentType && !scenario.locationType;

  const instructions = `
    You are a world-class road safety innovator and urban planner. Your goal is to provide **creative, unique, and highly effective** interventions.
    Go beyond standard textbook answers. Think about smart technology (IoT, V2X), behavioral nudges, tactical urbanism, and innovative community programs.
    
    For each intervention, you MUST include:
    1.  \`suggestion\`: A clear, concise description of the action.
    2.  \`impactScore\`: A numerical rating from 1 to 10 on its potential to improve safety.
    3.  \`costEstimate\`: A simple categorical cost (Low, Medium, High).
    4.  \`rationale\`: A brief explanation for *why* this is a creative, forward-thinking, or uniquely effective solution compared to traditional methods.

    Crucially, you MUST also populate the \`recommendations\` object:
    - \`bestLowCost\`: Identify the single best intervention that combines a 'Low' cost with the highest possible impact score. This should be a clever, high-leverage idea.
    - \`bestHighImpact\`: Identify the single intervention from ANY category that has the absolute highest impact score, representing the most effective solution overall, even if ambitious.
  `;
  
  if (isImageOnly) {
    return `
      You are an expert road safety innovator. The user has provided only an image.
      Your task is to:
      1.  Thoroughly analyze the provided image to identify potential road safety hazards and environmental context.
      2.  Based ONLY on the visual information, infer the situation and generate a JSON object with "shortTerm," "longTerm," and "recommendations".
      ${instructions}
    `;
  }

  return `
    Analyze the following road safety scenario to generate a list of creative, visionary, and actionable interventions.
    ${scenario.image ? "Use visual cues from the provided image to enhance your analysis." : ""}

    **Scenario Details:**
    - **Accident Type:** ${scenario.accidentType}
    - **Location Type:** ${scenario.locationType}
    - **Description:** ${scenario.description}

    Provide a JSON object with three top-level keys: "recommendations", "shortTerm", and "longTerm".
    ${instructions}
  `;
};

const calculateFallbackRecommendations = (result: InterventionResult) => {
    if (result.recommendations?.bestLowCost && result.recommendations?.bestHighImpact) {
        return result.recommendations;
    }

    const allInterventions = [...result.shortTerm, ...result.longTerm];
    if (allInterventions.length === 0) {
        return { bestLowCost: null, bestHighImpact: null };
    }

    let bestLowCost: Intervention | null = result.shortTerm
        .filter(i => i.costEstimate.toLowerCase() === 'low')
        .sort((a, b) => b.impactScore - a.impactScore)[0] || null;

    let bestHighImpact: Intervention | null = [...allInterventions]
        .sort((a, b) => b.impactScore - a.impactScore)[0] || null;

    return { bestLowCost, bestHighImpact };
}


export const generateInterventions = async (scenario: Scenario): Promise<InterventionResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }

  const textPart = { text: createPromptText(scenario) };
  const requestParts: any[] = [];

  if (scenario.image && scenario.imageMimeType) {
    const imagePart = {
      inlineData: {
        mimeType: scenario.imageMimeType,
        data: scenario.image,
      },
    };
    requestParts.push(imagePart);
  }
  requestParts.push(textPart);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: requestParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Increased temperature slightly for more creative responses
      },
    });

    const jsonText = response.text.trim();
    let parsedResult = JSON.parse(jsonText) as InterventionResult;

    // Basic validation
    if (!parsedResult.shortTerm || !parsedResult.longTerm) {
      throw new Error("Invalid response structure from API.");
    }
    
    // Calculate fallback recommendations if the model fails to provide them
    parsedResult.recommendations = calculateFallbackRecommendations(parsedResult);

    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};