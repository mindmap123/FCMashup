// Configuration pour Vercel Node Runtime
export const config = {
  api: {
    bodyParser: false, // Désactiver le parser par défaut pour gérer FormData
  },
};

import type { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";

// Helper pour parser le multipart/form-data
async function parseMultipartForm(
  req: IncomingMessage
): Promise<{ file: Buffer; filename: string; mimetype: string } | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          resolve(null);
          return;
        }

        const parts = buffer.toString("binary").split(`--${boundary}`);

        for (const part of parts) {
          if (
            part.includes("Content-Disposition") &&
            part.includes("filename=")
          ) {
            const filenameMatch = part.match(/filename="([^"]+)"/);
            const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);

            if (filenameMatch) {
              const filename = filenameMatch[1];
              const mimetype = contentTypeMatch
                ? contentTypeMatch[1]
                : "application/octet-stream";

              // Extraire le contenu binaire du fichier
              const fileStart = part.indexOf("\r\n\r\n") + 4;
              const fileEnd = part.lastIndexOf("\r\n");
              const fileContent = part.substring(fileStart, fileEnd);
              const fileBuffer = Buffer.from(fileContent, "binary");

              resolve({ file: fileBuffer, filename, mimetype });
              return;
            }
          }
        }

        resolve(null);
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }

  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ message: "REPLICATE_API_TOKEN not configured" })
      );
      return;
    }

    // Parser le multipart/form-data
    const fileData = await parseMultipartForm(req);

    if (!fileData) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "No file provided" }));
      return;
    }

    // Vérifier la taille (max 50 Mo)
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (fileData.file.length > maxSize) {
      res.statusCode = 413;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "File too large (max 50MB)" }));
      return;
    }

    // Vérifier le type MIME
    if (!fileData.mimetype.startsWith("image/")) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "File must be an image" }));
      return;
    }

    // Créer le boundary pour multipart/form-data
    const boundary = `----WebKitFormBoundary${Math.random()
      .toString(36)
      .substring(2)}`;
    const formDataBody = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="content"; filename="${fileData.filename}"`,
      `Content-Type: ${fileData.mimetype}`,
      "",
      fileData.file.toString("binary"),
      `--${boundary}--`,
    ].join("\r\n");

    // Upload vers Replicate /v1/uploads
    const uploadResponse = await fetch("https://api.replicate.com/v1/uploads", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: Buffer.from(formDataBody, "binary"),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("Replicate upload error:", error);
      res.statusCode = uploadResponse.status;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Failed to upload to Replicate",
          error,
        })
      );
      return;
    }

    const data = await uploadResponse.json();

    // Retourner l'URL publique
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        uploaded: true,
        url: data.urls?.get || data.url,
      })
    );
  } catch (error) {
    console.error("Upload error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }
}
