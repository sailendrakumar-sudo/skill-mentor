import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let aiClient = null;
if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.warn('⚠️ GoogleGenAI initialization error:', err.message);
  }
}

export const getGeminiClient = () => aiClient;
export const getGeminiApiKey = () => GEMINI_API_KEY;
