import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadImage(url: string, filename: string) {
  try {
    // Fetch l'image depuis l'URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Créer un URL local pour le blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Créer un lien de téléchargement
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Nettoyage
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    // Fallback : ouvrir dans un nouvel onglet
    window.open(url, "_blank");
  }
}
