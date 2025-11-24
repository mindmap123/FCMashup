/**
 * Upload une image vers notre backend qui la transfère à Replicate
 * Utilise base64 pour éviter les problèmes de FormData avec Vercel
 */
export async function uploadImageToReplicate(file: File): Promise<string> {
  try {
    console.log("📤 Upload vers backend...");

    // Convertir le fichier en base64
    const base64 = await fileToBase64(file);

    // Envoyer au backend qui fera l'upload vers Replicate
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
        filename: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.uploaded || !data.url) {
      throw new Error("Invalid response from upload API");
    }

    console.log("✅ Upload vers Replicate OK");
    return data.url;
  } catch (error) {
    console.error("❌ Error uploading to Replicate:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}

/**
 * Convertir un File en base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
