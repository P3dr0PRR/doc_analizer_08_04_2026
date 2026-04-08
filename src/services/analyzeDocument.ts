export interface DocumentResult {
  nome: string;
  validade: string;
  categoria: string;
}

export async function analyzeDocument(
  file: File,
  apiKey: string,
): Promise<DocumentResult> {
  // 1. Converte o PDF pra base64
  const base64 = await toBase64(file);

  // 2. Chama a API do Claude
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            {
              type: "text",
              text: `Analise este documento e extraia exatamente estes campos:
Nome:
Data de Validade:
Categoria:

Retorne APENAS esses 3 campos nesse formato, sem texto adicional.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message ?? "Erro na API");
  }

  const data = await response.json();
  const text: string = data.content[0].text;

  // 3. Parseia o texto retornado
  return parseResult(text);
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
