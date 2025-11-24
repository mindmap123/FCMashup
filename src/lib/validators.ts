import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format non supporté. Utilisez JPG, PNG, WebP ou AVIF.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Fichier trop volumineux. Maximum 10MB.",
    };
  }

  return { valid: true };
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Impossible de lire le fichier"));
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsDataURL(file);
  });
}
