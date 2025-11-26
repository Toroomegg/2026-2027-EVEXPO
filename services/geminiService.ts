import { GoogleGenAI, Type } from "@google/genai";
import { Exhibition, SummaryType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateExecutiveSummary = async (exhibitions: Exhibition[]): Promise<SummaryType> => {
  if (!apiKey) {
    return {
      overview: "API Key missing. Please configure the environment to use AI generation.",
      strategicRecommendations: ["Ensure API key is set.", "Manually review data."],
      budgetRisk: "Unknown"
    };
  }

  const dataContext = JSON.stringify(exhibitions.map(e => ({
    event: e.name,
    costTWD: e.totalCostTWD,
    competitors: e.competitors,
    recommendation: e.recommendation,
    region: e.region
  })));

  const prompt = `
    You are a Senior Marketing Director for a Tier 1 Automotive Supplier.
    Analyze the following 2026-2027 exhibition schedule data:
    ${dataContext}

    Context:
    - Costs are in TWD (New Taiwan Dollar).
    - "Competitors" indicates the number of key rivals present.
    - We want to maximize ROI. High competitor density means a necessary battlefield.
    - Focus on "Precision Strikes" (精準打擊) and "Budget Efficiency" (預算效益).

    Provide an executive summary in TRADITIONAL CHINESE (繁體中文):
    1. Overview: A concise paragraph on the global footprint and where the fiercest competition lies.
    2. Strategic Recommendations: 3 specific, actionable bullet points. Mention specific events (e.g., IZB, CES).
    3. Budget Risk: Analyze if we are overspending in low-priority areas or missing key battlegrounds.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            strategicRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            budgetRisk: { type: Type.STRING }
          },
          required: ["overview", "strategicRecommendations", "budgetRisk"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SummaryType;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      overview: "Failed to generate AI summary. Please try again.",
      strategicRecommendations: ["Check network connection.", "Review input data complexity."],
      budgetRisk: "Analysis unavailable."
    };
  }
};