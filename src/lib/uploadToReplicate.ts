/**
 * Upload une image directement vers Replicate et retourne l'URL publique
 */
export async function uploadImageToReplicate(file: File): Promise<string> {
  try {
    // Convertir le fichier en base64 pour l'upload Replicate
    const base64 = await fileToBase64(file);

    // Appeler l'API d'upload Replicate via notre backend
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64 }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading to Replicate:", error);
    throw new Error("Failed to upload image");
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
