import { GoogleGenAI, Type } from "@google/genai";
import { GenerationParams, ContentOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSocialContent(params: GenerationParams): Promise<ContentOption[]> {
  const { topic, style, type } = params;

  const prompt = `Genera 3 opciones diferentes de contenido para redes sociales sobre el tema: "${topic}".
Estilo: ${style}
Tipo de contenido: ${type}

Estructura obligatoria para cada opción:
1. Título llamativo.
2. Desarrollo (el cuerpo del mensaje).
3. Llamado a la acción (CTA).

Reglas específicas por tipo:
- Si es "post corto": El texto debe ser breve y directo.
- Si es "idea de video": Incluye una sección extra llamada "idea de grabación" con una sugerencia clara de cómo grabarlo.
- Si es "caption": Incluye emojis y una lista de hashtags relevantes.

El tono debe ser persuasivo, atractivo y coherente con el estilo "${style}". Evita mensajes genéricos.
Responde estrictamente en formato JSON según el esquema proporcionado.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        development: { type: Type.STRING },
        cta: { type: Type.STRING },
        recordingIdea: { type: Type.STRING, description: "Solo si es idea de video" },
        hashtags: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Solo si es caption"
        },
        emojis: { type: Type.STRING, description: "Solo si es caption" }
      },
      required: ["id", "title", "development", "cta"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export async function improveContent(content: ContentOption, params: GenerationParams): Promise<ContentOption> {
  const prompt = `Mejora el siguiente contenido para redes sociales para que sea más llamativo, claro y optimizado.
Original:
Título: ${content.title}
Desarrollo: ${content.development}
CTA: ${content.cta}

Contexto:
Tema: ${params.topic}
Estilo: ${params.style}
Tipo: ${params.type}

Mantén la estructura y devuélvelo en el mismo formato JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      development: { type: Type.STRING },
      cta: { type: Type.STRING },
      recordingIdea: { type: Type.STRING },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
      emojis: { type: Type.STRING }
    },
    required: ["id", "title", "development", "cta"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error improving content:", error);
    throw error;
  }
}
