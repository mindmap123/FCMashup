// Serveur Deno principal pour France Canapé
// Mode simple : 1 canapé + 1 tissu = 1 rendu IA

import { generateCanapeWithReplicate } from "./functions/generateCanapeWithReplicate.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  // Route: POST /api/generate
  if (url.pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📥 Requête reçue:", body);

      const { imageSofaUrl, imageFabricUrl, fabricDescription, model } = body;

      // Validation
      if (!imageSofaUrl || !imageFabricUrl) {
        return jsonResponse(
          { success: false, error: "imageSofaUrl et imageFabricUrl requis" },
          400
        );
      }

      if (!model || (model !== "banana" && model !== "seedream")) {
        return jsonResponse(
          { success: false, error: "model doit être 'banana' ou 'seedream'" },
          400
        );
      }

      // Vérifier le token Replicate
      const apiKey = Deno.env.get("REPLICATE_API_TOKEN");
      if (!apiKey) {
        return jsonResponse(
          {
            success: false,
            error: "REPLICATE_API_TOKEN non configuré sur le serveur",
          },
          500
        );
      }

      // Appeler la fonction de génération
      const result = await generateCanapeWithReplicate({
        imageSofaUrl,
        imageFabricUrl,
        fabricDescription,
        model,
      });

      if (result.success) {
        return jsonResponse(result, 200);
      } else {
        return jsonResponse(result, 500);
      }
    } catch (error) {
      console.error("❌ Erreur serveur:", error);
      return jsonResponse(
        {
          success: false,
          error: error instanceof Error ? error.message : "Erreur serveur",
        },
        500
      );
    }
  }

  // Route non trouvée
  return jsonResponse({ error: "Route non trouvée" }, 404);
}

// Démarrage du serveur
console.log("🚀 Serveur Deno en cours d'exécution sur http://localhost:8000");
console.log("📍 Route disponible: POST /api/generate");

Deno.serve({ port: 8000 }, handleRequest);
