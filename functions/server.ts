import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { generateCanapeWithReplicate } from "./generateCanapeWithReplicate.ts";

const PORT = 8000;

// Vérification du token au démarrage
console.log(
  "🔑 Token chargé ?",
  Deno.env.get("REPLICATE_API_TOKEN") ? "✅ OUI" : "❌ NON"
);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Route: /api/generate
  if (url.pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📥 Requête reçue:", body);

      const result = await generateCanapeWithReplicate(body);

      if (result.success) {
        return new Response(JSON.stringify({ imageUrl: result.imageUrl }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ message: result.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("❌ Erreur serveur:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Erreur serveur",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // Route: health check
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 404
  return new Response("Not Found", { status: 404, headers: corsHeaders });
}

console.log(
  `🚀 Serveur Deno en cours d'exécution sur http://localhost:${PORT}`
);
console.log(`📍 Route disponible: POST /api/generate`);
Deno.serve({ port: PORT }, handler);
