import type { VercelRequest, VercelResponse } from "@vercel/node";
import FormData from "form-data";
import { Readable } from "stream";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers - MUST be set before any response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      console.error("❌ REPLICATE_API_TOKEN not configured");
      return res
        .status(500)
        .json({ message: "REPLICATE_API_TOKEN not configured" });
    }

    // Parser le body JSON avec base64
    const { image, filename } = req.body;

    if (!image || typeof image !== "string") {
      console.error("❌ No image data provided");
      return res.status(400).json({ message: "No image data provided" });
    }

    // Vérifier que c'est bien du base64 data URL
    if (!image.startsWith("data:image/")) {
      console.error("❌ Invalid image format");
      return res.status(400).json({ message: "Invalid image format" });
    }

    console.log("📤 Upload vers backend - Starting...");

    // Extraire le type MIME et les données base64
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error("❌ Invalid base64 format");
      return res.status(400).json({ message: "Invalid base64 format" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    console.log(
      `📦 Image size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`📦 MIME type: ${mimeType}`);

    // Vérifier la taille (max 15MB)
    if (buffer.length > 15 * 1024 * 1024) {
      console.error("❌ Image too large");
      return res.status(413).json({ message: "Image too large (max 15MB)" });
    }

    // Créer FormData pour Replicate avec form-data (Node.js)
    const formData = new FormData();

    // Convertir le buffer en stream pour form-data
    const stream = Readable.from(buffer);

    formData.append("content", stream, {
      filename: filename || "upload.jpg",
      contentType: mimeType,
      knownLength: buffer.length,
    });

    console.log("📤 Upload vers Replicate API...");

    // Upload vers Replicate (server-to-server) avec node-fetch compatible
    const uploadResponse = await new Promise<Response>((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          ...formData.getHeaders(),
        },
      };

      // Utiliser fetch avec le stream de form-data
      fetch("https://api.replicate.com/v1/uploads", {
        ...options,
        body: formData as any,
      })
        .then(resolve)
        .catch(reject);
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("❌ Replicate upload error:", uploadResponse.status, error);
      return res.status(uploadResponse.status).json({
        message: "Failed to upload to Replicate",
        error,
        status: uploadResponse.status,
      });
    }

    const data = await uploadResponse.json();
    console.log("✅ Upload vers Replicate OK");
    console.log("📍 URL:", data.urls?.get || data.url);

    return res.status(200).json({
      uploaded: true,
      url: data.urls?.get || data.url,
      id: data.id,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error.stack : String(error),
    });
  }
}
