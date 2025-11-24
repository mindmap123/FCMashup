/**
 * Upload une image directement vers Replicate via notre API et retourne l'URL publique
 */
export async function uploadImageToReplicate(file: File): Promise<string> {
  try {
    // Créer un FormData avec le fichier
    const formData = new FormData();
    formData.append("file", file);

    // Appeler notre API d'upload
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData, // Pas de Content-Type header, le navigateur le gère automatiquement
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

    return data.url;
  } catch (error) {
    console.error("Error uploading to Replicate:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}
