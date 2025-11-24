import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";
import fs from "fs";

// Configuration pour Vercel
export const config = {
  api: {
    bodyParser: false, // Désactiver pour gérer FormData
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
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

    // Parser le FormData avec formidable
    const form = formidable({ maxFileSize: 50 * 1024 * 1024 }); // 50 MB max

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Vérifier le type MIME
    if (!file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ message: "File must be an image" });
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(file.filepath);

    // Créer le FormData pour Replicate
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("content", fileBuffer, {
      filename: file.originalFilename || "upload.jpg",
      contentType: file.mimetype || "image/jpeg",
    });

    // Upload vers Replicate
    const uploadResponse = await fetch("https://api.replicate.com/v1/uploads", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData as any,
    });

    // Nettoyer le fichier temporaire
    fs.unlinkSync(file.filepath);

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("Replicate upload error:", error);
      return res.status(uploadResponse.status).json({
        message: "Failed to upload to Replicate",
        error,
      });
    }

    const data = await uploadResponse.json();

    // Retourner l'URL
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
