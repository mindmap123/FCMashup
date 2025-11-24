export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AI_PROMPT_TEMPLATE = `Use the first image strictly as the base photo. Do not modify the sofa's shape, proportions, stitching, cushions, seams, legs, lighting, shadows, background, or perspective. The sofa geometry must remain IDENTICAL to the first image. Use the second image ONLY as a fabric reference (texture, color, grain, weave, reflectance). Accurately transfer this fabric onto the sofa upholstery (seat, backrest, armrests) without altering the sofa structure. Do NOT redesign the sofa. Do NOT invent new shapes or modify volumes. Apply the fabric as a realistic material replacement, following the same folds, tension, curves and contact shadows from the original sofa. The fabric appearance must match the sample exactly: same color tone, same weave density, same thread pattern, same texture scale. Keep everything photorealistic and consistent with the original lighting.`;

export const BANANA_PRO_CONFIG = {
  model: "google/nano-banana-pro",
  resolution: "2K",
  aspect_ratio: "match_input_image",
  output_format: "png",
  safety_filter_level: "block_only_high",
};

export const SEEDREAM_CONFIG = {
  model: "bytedance/seedream-4",
  size: "2K",
  aspect_ratio: "match_input_image",
  max_images: 1,
};
