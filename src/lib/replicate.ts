import { GenerationRequest, GenerationResponse } from "@/types";

// En production (Vercel), utilise /api/generate
// En développement, utilise l'URL du backend local si définie
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api/generate";

export async function generateCanapeWithReplicate(
  request: GenerationRequest
): Promise<GenerationResponse> {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erreur inconnue" }));
      throw new Error(error.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur lors de la génération");
  }
}
