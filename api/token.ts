import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Endpoint pour vérifier que le token Replicate est configuré
 * Utile pour le debugging sans exposer le token
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.REPLICATE_API_TOKEN;

  return res.status(200).json({
    configured: !!apiKey,
    prefix: apiKey ? `${apiKey.substring(0, 5)}...` : null,
    timestamp: new Date().toISOString(),
  });
}
