
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeReceipt = async (base64Image: string): Promise<Partial<Expense> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            },
            {
              text: "Extract expense details from this receipt (values should be in Indian Rupees). Return ONLY JSON with amount (number), category (one of: Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Other), description (string), and date (YYYY-MM-DD)."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            date: { type: Type.STRING }
          },
          required: ["amount", "category", "description", "date"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Receipt analysis failed:", error);
    return null;
  }
};

export const getFinancialAdvice = async (expenses: Expense[], budget: number) => {
  const expenseSummary = expenses.map(e => `${e.date}: ${e.description} - ₹${e.amount} (${e.category})`).join("\n");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a monthly budget of ₹${budget}. Here are my recent expenses in Indian Rupees:\n${expenseSummary}\nAnalyze this spending behavior. Provide a summary, 3 actionable pieces of advice, and 2 saving tips focused on Indian context if applicable. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            savingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Financial advice failed:", error);
    return null;
  }
};
