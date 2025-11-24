import type { VercelRequest, VercelResponse } from "@vercel/node";
import FormData from "form-data";
import https from "https";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const { image, filename } = req.body;

    if (!image || typeof image !== "string") {
      console.error("❌ No image data provided");
      return res.status(400).json({ message: "No image data provided" });
    }

    if (!image.startsWith("data:image/")) {
      console.error("❌ Invalid image format");
      return res.status(400).json({ message: "Invalid image format" });
    }

    console.log("📤 Backend upload starting...");

    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error("❌ Invalid base64 format");
      return res.status(400).json({ message: "Invalid base64 format" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    console.log(
      `📦 Size: ${(buffer.length / 1024 / 1024).toFixed(
        2
      )} MB, Type: ${mimeType}`
    );

    if (buffer.length > 15 * 1024 * 1024) {
      console.error("❌ Image too large");
      return res.status(413).json({ message: "Image too large (max 15MB)" });
    }

    const formData = new FormData();
    formData.append("content", buffer, {
      filename: filename || "upload.jpg",
      contentType: mimeType,
    });

    console.log("📤 Uploading to Replicate...");

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: "api.replicate.com",
        path: "/v1/uploads",
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          ...formData.getHeaders(),
        },
      };

      const request = https.request(options, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          if (
            response.statusCode &&
            response.statusCode >= 200 &&
            response.statusCode < 300
          ) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`Invalid JSON response: ${data}`));
            }
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${data}`));
          }
        });
      });

      request.on("error", reject);
      formData.pipe(request);
    });

    console.log("✅ Upload successful");
    console.log("📍 URL:", uploadResult.urls?.get || uploadResult.url);

    return res.status(200).json({
      uploaded: true,
      url: uploadResult.urls?.get || uploadResult.url,
      id: uploadResult.id,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
      error: error instanceof Error ? error.stack : String(error),
    });
  }
}
