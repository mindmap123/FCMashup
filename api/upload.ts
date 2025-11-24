// Edge Function configuration
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ message: "REPLICATE_API_TOKEN not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Récupérer le fichier depuis le FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Vérifier la taille (max 50 Mo)
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ message: "File too large (max 50MB)" }),
        {
          status: 413,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Vérifier le type MIME
    if (!file.type.startsWith("image/")) {
      return new Response(
        JSON.stringify({ message: "File must be an image" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Créer un FormData pour Replicate
    const replicateFormData = new FormData();
    replicateFormData.append("content", file);

    // Upload vers Replicate /v1/uploads
    const uploadResponse = await fetch("https://api.replicate.com/v1/uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: replicateFormData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("Replicate upload error:", error);
      return new Response(
        JSON.stringify({
          message: "Failed to upload to Replicate",
          error,
        }),
        {
          status: uploadResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await uploadResponse.json();

    // Retourner l'URL publique
    return new Response(
      JSON.stringify({
        uploaded: true,
        url: data.urls?.get || data.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
