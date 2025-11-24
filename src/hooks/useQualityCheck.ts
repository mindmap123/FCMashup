import { QualityCheckResult } from "@/types";

export function useQualityCheck() {
  const checkImageQuality = async (
    file: File,
    type: "sofa" | "fabric"
  ): Promise<QualityCheckResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Vérifier la taille du fichier
    if (file.size < 50000) {
      errors.push(
        "Image trop petite (< 50KB). Utilisez une image de meilleure qualité."
      );
    }

    // Vérifier les dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Vérifier la résolution minimale
        if (width < 512 || height < 512) {
          errors.push(
            `Résolution trop faible (${width}x${height}). Minimum recommandé: 512x512`
          );
        }

        // Vérifier le ratio pour le canapé
        if (type === "sofa") {
          const ratio = width / height;
          if (ratio < 0.5 || ratio > 3) {
            warnings.push(
              "Format d'image inhabituel pour un canapé. Assurez-vous que le canapé est bien visible."
            );
          }
        }

        // Vérifier la résolution pour le tissu
        if (type === "fabric") {
          if (width < 256 || height < 256) {
            warnings.push(
              "Résolution faible pour le tissu. Une meilleure qualité donnera de meilleurs résultats."
            );
          }
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          warnings,
        });
      };

      img.onerror = () => {
        errors.push("Impossible de lire l'image");
        resolve({
          isValid: false,
          errors,
          warnings,
        });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return { checkImageQuality };
}
