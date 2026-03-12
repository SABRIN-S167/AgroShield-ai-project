import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD3CT1oWjUl-Sfzk6ZElsltkzFJRla38zc";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(message: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are AgroShield AI, an agriculture advisor for Indian farmers.

Give simple practical farming advice.

User question:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    return "⚠ AI service unavailable. Please try again.";
  }
}
