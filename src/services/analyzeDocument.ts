import { GoogleGenAI } from "@google/genai";

export interface DocumentResult {
  nome: string;
  validade: string;
  categoria: string;
}

export async function analyzeDocument(
  file: File,
  apiKey: string,
): Promise<DocumentResult> {
  const base64 = await toBase64(file);

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64,
              },
            },
            {
              text: `Analise este documento e extraia exatamente estes campos:
Nome:
Data de Validade:
Categoria:

Retorne APENAS esses 3 campos nesse formato, sem texto adicional.`,
            },
          ],
        },
      ],
    });

    const text = response.text ?? "";
    return parseResult(text);
  } catch {
    throw new Error(
      "Não foi possível analisar o documento. Verifique sua chave e tente novamente.",
    );
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseResult(text: string): DocumentResult {
  const get = (label: string) => {
    const match = text.match(new RegExp(`${label}:\\s*(.+)`));
    return match?.[1]?.trim() ?? "Não encontrado";
  };

  return {
    nome: get("Nome"),
    validade: get("Data de Validade"),
    categoria: get("Categoria"),
  };
}