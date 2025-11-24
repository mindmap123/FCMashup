import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Limite à 10MB pour éviter 413
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "REPLICATE_API_TOKEN not configured" });
    }

    // Récupérer l'image en base64 depuis le body
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Convertir base64 en Buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Vérifier la taille (max 10 MB après conversion)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ message: "Image too large (max 10MB)" });
    }

    // Créer FormData pour Replicate
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("content", buffer, {
      filename: filename || "upload.jpg",
      contentType: "image/jpeg",
    });

    // Upload vers Replicate (server-to-server, pas de CORS)
    const uploadResponse = await fetch("https://api.replicate.com/v1/uploads", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData as any,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("Replicate upload error:", error);
      return res.status(uploadResponse.status).json({
        message: "Failed to upload to Replicate",
        error,
      });
    }

    const data = await uploadResponse.json();

    return res.status(200).json({
      uploaded: true,
      url: data.urls?.get || data.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
