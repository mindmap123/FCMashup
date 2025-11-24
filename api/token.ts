// Edge Function pour exposer le token Replicate de manière sécurisée
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.REPLICATE_API_TOKEN;

  if (!apiKey) {
    return new Response(JSON.stringify({ message: "Token not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ token: apiKey }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
