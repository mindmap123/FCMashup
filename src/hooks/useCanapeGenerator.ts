import { useState } from "react";
import { toast } from "sonner";
import { AIModel, AppState, UploadedImage } from "@/types";
import { validateImageFile, createImagePreview } from "@/lib/validators";
import { generateCanapeWithReplicate } from "@/lib/replicate";
import { saveHistory } from "@/lib/historyService";

export function useCanapeGenerator() {
  const [state, setState] = useState<AppState>({
    selectedModel: null,
    sofaImage: null,
    fabricImage1: null,
    fabricImage2: null,
    fabricDescription: "",
    generatedImage1: null,
    generatedImage2: null,
    isGenerating: false,
    isDuoMode: false,
    showBeforeAfter: false,
  });

  const selectModel = (model: AIModel) => {
    setState((prev) => ({ ...prev, selectedModel: model }));
    toast.success(
      `Modèle ${model === "banana" ? "Banana Pro" : "Seedream"} sélectionné`
    );
  };

  const uploadImage = async (file: File, type: "sofa" | "fabric") => {
    const validation = validateImageFile(file);

    if (!validation.valid) {
      toast.error(validation.error || "Fichier invalide");
      return;
    }

    try {
      const preview = await createImagePreview(file);
      const uploadedImage: UploadedImage = { file, preview };

      if (type === "sofa") {
        setState((prev) => ({ ...prev, sofaImage: uploadedImage }));
        toast.success("Image du canapé uploadée");
      } else {
        setState((prev) => ({ ...prev, fabricImage1: uploadedImage }));
        toast.success("Image du tissu uploadée");
      }
    } catch (error) {
      toast.error("Erreur lors du chargement de l'image");
    }
  };

  const removeImage = (type: "sofa" | "fabric") => {
    if (type === "sofa") {
      setState((prev) => ({ ...prev, sofaImage: null }));
    } else {
      setState((prev) => ({ ...prev, fabricImage1: null }));
    }
  };

  const setDescription = (description: string) => {
    setState((prev) => ({ ...prev, fabricDescription: description }));
  };

  const generate = async () => {
    if (!state.selectedModel || !state.sofaImage || !state.fabricImage1) {
      toast.error("Veuillez compléter tous les champs requis");
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true }));
    toast.info("Génération en cours...");

    try {
      const imageSofaUrl = state.sofaImage.preview;
      const imageFabricUrl = state.fabricImage1.preview;

      const response = await generateCanapeWithReplicate({
        imageSofaUrl,
        imageFabricUrl,
        fabricDescription: state.fabricDescription || undefined,
        model: state.selectedModel,
      });

      setState((prev) => ({
        ...prev,
        generatedImage1: response.imageUrl,
        isGenerating: false,
      }));

      // Sauvegarder dans Supabase
      try {
        await saveHistory({
          image_url: response.imageUrl,
          type: state.isDuoMode ? "duo" : "simple",
          metadata: {
            sofaUrl: imageSofaUrl,
            fabricUrl: imageFabricUrl,
            model: state.selectedModel,
            description: state.fabricDescription,
          },
        });
        console.log("✅ History saved to Supabase");
      } catch (historyError) {
        console.error("⚠️ Failed to save history:", historyError);
        // Ne pas bloquer l'utilisateur si la sauvegarde échoue
      }

      toast.success("Image générée avec succès !");
    } catch (error) {
      setState((prev) => ({ ...prev, isGenerating: false }));
      const message =
        error instanceof Error ? error.message : "Erreur lors de la génération";
      toast.error(message);
    }
  };

  const restart = () => {
    setState({
      selectedModel: null,
      sofaImage: null,
      fabricImage1: null,
      fabricImage2: null,
      fabricDescription: "",
      generatedImage1: null,
      generatedImage2: null,
      isGenerating: false,
      isDuoMode: false,
      showBeforeAfter: false,
    });
    toast.info("Nouvelle session démarrée");
  };

  const canGenerate =
    state.selectedModel !== null &&
    state.sofaImage !== null &&
    state.fabricImage1 !== null &&
    !state.isGenerating;

  return {
    state,
    selectModel,
    uploadImage,
    removeImage,
    setDescription,
    generate,
    restart,
    canGenerate,
  };
}
