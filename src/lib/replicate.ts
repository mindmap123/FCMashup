import { GenerationRequest, GenerationResponse } from "@/types";
import { directUploadToReplicate } from "./uploadToReplicate";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api/generate";

// Cache du token pour éviter de le récupérer à chaque fois
let cachedToken: string | null = null;

async function getReplicateToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  const response = await fetch("/api/token");
  if (!response.ok) {
    throw new Error("Failed to get Replicate token");
  }

  const data = await response.json();
  const token = data.token;

  if (!token) {
    throw new Error("No token received from API");
  }

  cachedToken = token;
  return token;
}

export async function generateCanapeWithReplicate(
  request: GenerationRequest
): Promise<GenerationResponse> {
  try {
    let sofaUrl = request.imageSofaUrl;
    let fabricUrl = request.imageFabricUrl;

    // Si les URLs sont des data URLs (base64), les uploader DIRECTEMENT vers Replicate
    if (sofaUrl.startsWith("data:")) {
      console.log("📤 Upload direct du canapé vers Replicate...");
      const token = await getReplicateToken();
      const blob = await fetch(sofaUrl).then((r) => r.blob());
      const file = new File([blob], "sofa.jpg", { type: "image/jpeg" });
      sofaUrl = await directUploadToReplicate(file, token);
      console.log("✅ Canapé uploadé:", sofaUrl);
    }

    if (fabricUrl.startsWith("data:")) {
      console.log("📤 Upload direct du tissu vers Replicate...");
      const token = await getReplicateToken();
      const blob = await fetch(fabricUrl).then((r) => r.blob());
      const file = new File([blob], "fabric.jpg", { type: "image/jpeg" });
      fabricUrl = await directUploadToReplicate(file, token);
      console.log("✅ Tissu uploadé:", fabricUrl);
    }

    // Appeler l'API de génération avec les URLs Replicate
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sofa_url: sofaUrl,
        fabric_url: fabricUrl,
        description: request.fabricDescription,
        model: request.model,
      }),
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
