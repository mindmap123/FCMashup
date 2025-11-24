// Fonction réutilisable pour générer une image avec Replicate
// Peut être importée par un serveur ou utilisée comme Edge Function

export interface GenerateRequest {
  imageSofaUrl: string;
  imageFabricUrl: string;
  fabricDescription?: string;
  model: "banana" | "seedream";
}

export interface GenerateResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function generateCanapeWithReplicate(
  request: GenerateRequest
): Promise<GenerateResponse> {
  try {
    const {
      imageSofaUrl,
      imageFabricUrl,
      fabricDescription = "",
      model,
    } = request;

    console.log("🔍 Génération avec:", {
      imageSofaUrl,
      imageFabricUrl,
      fabricDescription,
      model,
    });

    if (!imageSofaUrl || !imageFabricUrl) {
      return { success: false, error: "Missing image URLs" };
    }

    const apiKey = Deno.env.get("REPLICATE_API_TOKEN");
    if (!apiKey) {
      return { success: false, error: "REPLICATE_API_TOKEN manquant" };
    }

    const basePrompt = `Use the first image strictly as the base photo. Do not modify the sofa's shape, proportions, stitching, cushions, seams, legs, lighting, shadows, background, or perspective. The sofa geometry must remain IDENTICAL to the first image.

Use the second image ONLY as a fabric reference (texture, color, grain, weave, reflectance). Accurately transfer this fabric onto the sofa upholstery (seat, backrest, armrests) without altering the sofa structure. Do NOT redesign the sofa. Do NOT invent new shapes or modify volumes. Apply the fabric as a realistic material replacement, following the same folds, tension, curves and contact shadows from the original sofa.

The fabric appearance must match the sample exactly: same color tone, same weave density, same thread pattern, same texture scale. Keep everything photorealistic and consistent with the original lighting.`;

    const prompt = fabricDescription
      ? `${basePrompt}\n\nExtra fabric details: ${fabricDescription}`
      : basePrompt;

    let modelPath: string;
    let inputPayload: Record<string, unknown>;

    if (model === "banana") {
      modelPath = "google/nano-banana-pro";
      inputPayload = {
        prompt,
        resolution: "2K",
        image_input: [imageSofaUrl, imageFabricUrl],
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_filter_level: "block_only_high",
      };
    } else {
      modelPath = "bytedance/seedream-4";
      inputPayload = {
        prompt,
        image_input: [imageSofaUrl, imageFabricUrl],
        size: "2K",
        aspect_ratio: "match_input_image",
        max_images: 1,
      };
    }

    console.log("🤖 Modèle sélectionné:", modelPath);

    console.log("🚀 Appel Replicate API...");
    const replicateRes = await fetch(
      `https://api.replicate.com/v1/models/${modelPath}/predictions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({ input: inputPayload }),
      }
    );
    console.log("📡 Réponse Replicate status:", replicateRes.status);

    const raw = await replicateRes.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      return { success: false, error: "Réponse Replicate invalide" };
    }

    if (!replicateRes.ok) {
      return {
        success: false,
        error: data?.detail || `Erreur Replicate: ${replicateRes.status}`,
      };
    }

    // Extraire l'URL de l'image générée
    let imageUrl: string | null = null;
    if (typeof data === "string") {
      imageUrl = data;
    } else if (Array.isArray(data)) {
      imageUrl = data[0];
    } else if (data?.output) {
      if (typeof data.output === "string") {
        imageUrl = data.output;
      } else if (Array.isArray(data.output)) {
        imageUrl = data.output[0];
      }
    }

    if (!imageUrl) {
      return { success: false, error: "Aucune URL d'image générée" };
    }

    console.log("✅ Image générée:", imageUrl);
    return { success: true, imageUrl };
  } catch (error) {
    console.error("❌ Erreur:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
