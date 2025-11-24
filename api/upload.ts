import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "REPLICATE_API_TOKEN not configured" });
    }

    // Upload vers Replicate Files API
    const uploadResponse = await fetch("https://api.replicate.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: image,
        filename: `upload-${Date.now()}.jpg`,
      }),
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

    // Retourner l'URL publique
    return res.status(200).json({ url: data.urls.get });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
