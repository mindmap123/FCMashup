/**
 * Upload une image DIRECTEMENT vers Replicate depuis le frontend
 * Contourne le backend pour éviter les erreurs 413
 */
export async function directUploadToReplicate(
  file: File,
  apiToken: string
): Promise<string> {
  try {
    // Créer un FormData avec le fichier
    const formData = new FormData();
    formData.append("content", file);

    // Upload DIRECT vers Replicate
    const response = await fetch("https://api.replicate.com/v1/uploads", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Replicate upload error:", error);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();

    // Retourner l'URL publique
    const url = data.urls?.get || data.url;

    if (!url) {
      throw new Error("No URL returned from Replicate");
    }

    return url;
  } catch (error) {
    console.error("Error uploading to Replicate:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
}
