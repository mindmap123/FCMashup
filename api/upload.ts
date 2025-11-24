import type { VercelRequest, VercelResponse } from "@vercel/node";

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

    // Parser le body JSON avec base64
    const { image, filename } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Vérifier que c'est bien du base64 data URL
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    console.log("📤 Upload vers backend...");

    // Extraire le type MIME et les données base64
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: "Invalid base64 format" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Créer FormData pour Replicate
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("content", buffer, {
      filename: filename || "upload.jpg",
      contentType: mimeType,
    });

    console.log("📤 Upload vers Replicate...");

    // Upload vers Replicate (server-to-server)
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
      console.error("❌ Replicate upload error:", error);
      return res.status(uploadResponse.status).json({
        message: "Failed to upload to Replicate",
        error,
      });
    }

    const data = await uploadResponse.json();
    console.log("✅ Upload vers Replicate OK");

    return res.status(200).json({
      uploaded: true,
      url: data.urls?.get || data.url,
      id: data.id,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
