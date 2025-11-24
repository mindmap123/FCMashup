import { GenerationRequest, GenerationResponse } from "@/types";
import { uploadImageToReplicate } from "./uploadToReplicate";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api/generate";

export async function generateCanapeWithReplicate(
  request: GenerationRequest
): Promise<GenerationResponse> {
  try {
    let sofaUrl = request.imageSofaUrl;
    let fabricUrl = request.imageFabricUrl;

    // Si les URLs sont des data URLs (base64), les uploader via notre backend
    if (sofaUrl.startsWith("data:")) {
      console.log("📤 Upload du canapé via backend...");
      const blob = await fetch(sofaUrl).then((r) => r.blob());
      const file = new File([blob], "sofa.jpg", { type: "image/jpeg" });
      sofaUrl = await uploadImageToReplicate(file);
      console.log("✅ Canapé uploadé:", sofaUrl);
    }

    if (fabricUrl.startsWith("data:")) {
      console.log("📤 Upload du tissu via backend...");
      const blob = await fetch(fabricUrl).then((r) => r.blob());
      const file = new File([blob], "fabric.jpg", { type: "image/jpeg" });
      fabricUrl = await uploadImageToReplicate(file);
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
