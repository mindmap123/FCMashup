// Edge Function configuration
export const config = {
  runtime: "edge",
};

interface GenerateRequest {
  sofa_url: string;
  fabric_url: string;
  description?: string;
  model: "banana" | "seedream";
}

export default async function handler(req: Request) {
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

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as GenerateRequest;
    const { sofa_url, fabric_url, description = "", model } = body;

    if (!sofa_url || !fabric_url) {
      return new Response(JSON.stringify({ message: "Missing image URLs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Valider que ce sont bien des URLs
    if (!sofa_url.startsWith("http") || !fabric_url.startsWith("http")) {
      return new Response(
        JSON.stringify({ message: "Invalid URLs provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    const basePrompt = `Use the first image strictly as the base photo. Do not modify the sofa's shape, proportions, stitching, cushions, seams, legs, lighting, shadows, background, or perspective. The sofa geometry must remain IDENTICAL to the first image.

Use the second image ONLY as a fabric reference (texture, color, grain, weave, reflectance). Accurately transfer this fabric onto the sofa upholstery (seat, backrest, armrests) without altering the sofa structure. Do NOT redesign the sofa. Do NOT invent new shapes or modify volumes. Apply the fabric as a realistic material replacement, following the same folds, tension, curves and contact shadows from the original sofa.

The fabric appearance must match the sample exactly: same color tone, same weave density, same thread pattern, same texture scale. Keep everything photorealistic and consistent with the original lighting.`;

    const prompt = description
      ? `${basePrompt}\n\nExtra fabric details: ${description}`
      : basePrompt;

    let modelPath: string;
    let inputPayload: Record<string, unknown>;

    if (model === "banana") {
      modelPath = "google/nano-banana-pro";
      inputPayload = {
        prompt,
        resolution: "2K",
        image_input: [sofa_url, fabric_url],
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_filter_level: "block_only_high",
      };
    } else {
      modelPath = "bytedance/seedream-4";
      inputPayload = {
        prompt,
        image_input: [sofa_url, fabric_url],
        size: "2K",
        aspect_ratio: "match_input_image",
        max_images: 1,
      };
    }

    const replicateRes = await fetch(
      `https://api.replicate.com/v1/models/${modelPath}/predictions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({ input: inputPayload }),
      }
    );

    const raw = await replicateRes.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      return new Response(
        JSON.stringify({ message: "Invalid Replicate response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!replicateRes.ok) {
      return new Response(
        JSON.stringify({
          message: data?.detail || `Replicate error: ${replicateRes.status}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract image URL
    let imageUrl: string | null = null;
    if (typeof data === "string") {
      imageUrl = data;
    } else if (Array.isArray(data)) {
      imageUrl = data[0];
    } else if (data?.output) {
      if (typeof data.output === "string") {
        imageUrl = data.output;
      } else if (Array.isArray(data.output)) {
        imageUrl = data.output[0];
      }
    }

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ message: "No image URL generated" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
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
