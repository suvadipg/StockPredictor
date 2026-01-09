
import { GoogleGenAI, Type } from "@google/genai";
import { StockDataPoint, PredictionResult } from "../types";

const API_KEY = process.env.API_KEY;

export const analyzeStock = async (
  symbol: string, 
  historicalData: StockDataPoint[]
): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY! });
  
  // Prepare data summary for the prompt
  const dataSummary = historicalData.slice(-10).map(d => 
    `${d.date}: $${d.price} (Vol: ${d.volume})`
  ).join('\n');

  const prompt = `
    Act as a professional quantitative stock analyst. 
    Analyze the current market situation and future outlook for the stock symbol: ${symbol}.
    
    Recent historical data provided:
    ${dataSummary}
    
    Task:
    1. Use Google Search to find the latest news, earnings reports, and macroeconomic factors affecting ${symbol}.
    2. Perform technical analysis based on the provided price trends.
    3. Evaluate market sentiment.
    4. Provide a 30-day price prediction.
    
    IMPORTANT: Be objective. This is for analysis purposes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            prediction: { type: Type.STRING, enum: ['BULLISH', 'BEARISH', 'NEUTRAL'] },
            confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
            targetPrice: { type: Type.NUMBER },
            timeframe: { type: Type.STRING },
            keyFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalAnalysis: { type: Type.STRING }
          },
          required: ['summary', 'prediction', 'confidence', 'targetPrice', 'keyFactors', 'technicalAnalysis']
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Extract sources from grounding metadata if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Market Source',
      url: chunk.web?.uri || '#'
    })) || [];

    return {
      ...result,
      sources: sources.slice(0, 5) // Return top 5 sources
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate AI analysis. Please try again.");
  }
};
