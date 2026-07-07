import { GoogleGenAI } from "@google/genai";
import { AiConfigurationError } from "./errors";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export interface IAiProvider {
  generateObject(prompt: string, schema: Record<string, unknown>, temperature?: number): Promise<Record<string, unknown>>;
  getModelName(): string;
}

export class GeminiProvider implements IAiProvider {
  private ai: GoogleGenAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "replace-with-gemini-api-key" || apiKey.startsWith("replace-with-")) {
      throw new AiConfigurationError();
    }
    
    this.ai = new GoogleGenAI({ apiKey });
    this.modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  }

  getModelName() {
    return this.modelName;
  }

  async generateObject(prompt: string, schema: Record<string, unknown>, temperature: number = 0.2): Promise<Record<string, unknown>> {
    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: schema,
        temperature,
      },
    });

    return JSON.parse(response.text ?? "{}");
  }
}
