import { useState, useRef } from "react";
import { toast } from "sonner";
import { AIModel, UploadedImage, HistoryItem } from "@/types";
import { validateImageFile, createImagePreview } from "@/lib/validators";
import { useHistory } from "@/hooks/useHistory";
import { useQualityCheck } from "@/hooks/useQualityCheck";
import { useOffline } from "@/hooks/useOffline";
import { generateCanapeWithReplicate } from "@/lib/replicate";

import SectionTitle from "@/components/SectionTitle";
import CompactModelSelector from "@/components/CompactModelSelector";
import CompactUploadZone from "@/components/CompactUploadZone";
import PremiumFabricDescription from "@/components/PremiumFabricDescription";
import PremiumGenerationButton from "@/components/PremiumGenerationButton";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import HistoryPanel from "@/components/HistoryPanel";
import DuoModeToggle from "@/components/DuoModeToggle";
import OfflineBadge from "@/components/OfflineBadge";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Download, RotateCcw, Sofa, Palette } from "lucide-react";
import { downloadImage, cn } from "@/lib/utils";

export default function FranceCanapeV6() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>("banana");
  const [sofaImage, setSofaImage] = useState<UploadedImage | null>(null);
  const [fabricImage1, setFabricImage1] = useState<UploadedImage | null>(null);
  const [fabricImage2, setFabricImage2] = useState<UploadedImage | null>(null);
  const [fabricDescription, setFabricDescription] = useState("");
  const [generatedImage1, setGeneratedImage1] = useState<string | null>(null);
  const [generatedImage2, setGeneratedImage2] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDuoMode, setIsDuoMode] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useHistory();
  const { checkImageQuality } = useQualityCheck();
  const { isOffline } = useOffline();

  const resultRef = useRef<HTMLDivElement>(null);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  const handleImageUpload = async (
    file: File,
    type: "sofa" | "fabric1" | "fabric2"
  ) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "Fichier invalide");
      return;
    }

    const qualityCheck = await checkImageQuality(
      file,
      type === "sofa" ? "sofa" : "fabric"
    );
    if (!qualityCheck.isValid) {
      qualityCheck.errors.forEach((error) => toast.error(error));
      return;
    }
    qualityCheck.warnings.forEach((warning) => toast.warning(warning));

    try {
      const preview = await createImagePreview(file);
      const uploadedImage: UploadedImage = { file, preview };

      if (type === "sofa") setSofaImage(uploadedImage);
      else if (type === "fabric1") setFabricImage1(uploadedImage);
      else setFabricImage2(uploadedImage);

      toast.success(`Image uploadée`);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    }
  };

  const handleGenerate = async () => {
    if (isOffline) {
      toast.error("Génération impossible en mode hors ligne");
      return;
    }

    if (!selectedModel || !sofaImage || !fabricImage1) {
      toast.error("Veuillez compléter tous les champs requis");
      return;
    }

    if (isDuoMode && !fabricImage2) {
      toast.error("Veuillez uploader le second tissu");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération en cours...");

    try {
      // Génération Tissu 1
      const response1 = await generateCanapeWithReplicate({
        imageSofaUrl: sofaImage.preview,
        imageFabricUrl: fabricImage1.preview,
        fabricDescription: fabricDescription || undefined,
        model: selectedModel,
      });

      setGeneratedImage1(response1.imageUrl);

      if (isDuoMode && fabricImage2) {
        // Mode DUO : Génération Tissu 2
        const response2 = await generateCanapeWithReplicate({
          imageSofaUrl: sofaImage.preview,
          imageFabricUrl: fabricImage2.preview,
          fabricDescription: fabricDescription || undefined,
          model: selectedModel,
        });

        setGeneratedImage2(response2.imageUrl);

        // Historique DUO : une seule entrée avec les deux URLs
        addToHistory({
          sofaImage: "sofa.jpg",
          fabricImage: "fabric-duo.jpg",
          resultImage: response1.imageUrl, // Pour compatibilité
          model: selectedModel,
          description: fabricDescription,
          mode: "duo",
          tissu1Url: response1.imageUrl,
          tissu2Url: response2.imageUrl,
        });

        setShowBeforeAfter(true);
      } else {
        // Mode NORMAL : une seule génération
        addToHistory({
          sofaImage: "sofa.jpg",
          fabricImage: "fabric1.jpg",
          resultImage: response1.imageUrl,
          model: selectedModel,
          description: fabricDescription,
          mode: "normal",
        });
      }

      setIsGenerating(false);
      toast.success("Généré avec succès !");
    } catch (error) {
      setIsGenerating(false);
      const message = error instanceof Error ? error.message : "Erreur";
      toast.error(message);
    }
  };

  const handleRestart = () => {
    setSelectedModel("banana");
    setSofaImage(null);
    setFabricImage1(null);
    setFabricImage2(null);
    setFabricDescription("");
    setGeneratedImage1(null);
    setGeneratedImage2(null);
    setShowBeforeAfter(false);
    toast.info("Nouvelle session");
  };

  const handleBackToEdit = () => {
    setGeneratedImage1(null);
    setGeneratedImage2(null);
    setShowBeforeAfter(false);
    toast.info("Retour à l'édition");
  };

  const handleViewFromHistory = (item: HistoryItem) => {
    if (item.mode === "duo" && item.tissu1Url && item.tissu2Url) {
      setGeneratedImage1(item.tissu1Url);
      setGeneratedImage2(item.tissu2Url);
      setShowBeforeAfter(true);
      setIsDuoMode(true);
    } else {
      setGeneratedImage1(item.resultImage);
      setGeneratedImage2(null);
      setShowBeforeAfter(false);
      setIsDuoMode(false);
    }
    setSelectedModel(item.model);
    toast.info("Image chargée depuis l'historique");

    // Scroll vers le résultat
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const canGenerate =
    selectedModel !== null &&
    sofaImage !== null &&
    fabricImage1 !== null &&
    !isGenerating &&
    !isOffline &&
    (!isDuoMode || fabricImage2 !== null);

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        selectedModel === "seedream"
          ? "bg-gradient-to-b from-[#EEF2FF] via-white to-[#EEF2FF]/30"
          : "bg-gradient-to-b from-green-50 via-white to-green-50/30"
      )}
    >
      <OfflineBadge isOffline={isOffline} />

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Sélecteur compact + Mode Duo + Recommencer */}
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <CompactModelSelector
            selectedModel={selectedModel}
            onSelectModel={handleModelSelect}
            disabled={isGenerating}
          />
          <DuoModeToggle
            enabled={isDuoMode}
            onChange={setIsDuoMode}
            disabled={isGenerating}
          />
          <Button
            onClick={handleRestart}
            variant="outline"
            size="sm"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </Button>
        </div>

        {/* Grille Canapé + Tissu côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Upload Canapé */}
          <Card
            className={cn(
              "shadow-lg hover:shadow-xl transition-all duration-200",
              selectedModel === "seedream"
                ? "ring-2 ring-blue-400 shadow-blue-200/50"
                : "ring-2 ring-green-400 shadow-green-200/50"
            )}
          >
            <CardContent className="p-6">
              <SectionTitle
                icon={Sofa}
                title="CANAPÉ"
                variant={selectedModel === "seedream" ? "blue" : "green"}
              />
              <CompactUploadZone
                title="Photo du canapé"
                uploadedImage={sofaImage}
                onImageUpload={(file) => handleImageUpload(file, "sofa")}
                onImageRemove={() => setSofaImage(null)}
                disabled={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Upload Tissu(s) */}
          <Card
            className={cn(
              "shadow-lg hover:shadow-xl transition-all duration-200",
              selectedModel === "seedream"
                ? "ring-2 ring-blue-400 shadow-blue-200/50"
                : "ring-2 ring-green-400 shadow-green-200/50"
            )}
          >
            <CardContent className="p-6">
              <SectionTitle
                icon={Palette}
                title="TISSU"
                variant={selectedModel === "seedream" ? "blue" : "green"}
              />
              {isDuoMode ? (
                <div className="grid grid-cols-2 gap-3">
                  <CompactUploadZone
                    title="Tissu 1"
                    uploadedImage={fabricImage1}
                    onImageUpload={(file) => handleImageUpload(file, "fabric1")}
                    onImageRemove={() => setFabricImage1(null)}
                    disabled={isGenerating}
                    compactMode={true}
                  />
                  <CompactUploadZone
                    title="Tissu 2"
                    uploadedImage={fabricImage2}
                    onImageUpload={(file) => handleImageUpload(file, "fabric2")}
                    onImageRemove={() => setFabricImage2(null)}
                    disabled={isGenerating}
                    compactMode={true}
                  />
                </div>
              ) : (
                <CompactUploadZone
                  title="Photo du tissu"
                  uploadedImage={fabricImage1}
                  onImageUpload={(file) => handleImageUpload(file, "fabric1")}
                  onImageRemove={() => setFabricImage1(null)}
                  disabled={isGenerating}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <PremiumFabricDescription
              value={fabricDescription}
              onChange={setFabricDescription}
              disabled={isGenerating}
            />
          </CardContent>
        </Card>

        {/* Bouton Génération Premium */}
        <PremiumGenerationButton
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          selectedModel={selectedModel}
          onGenerate={handleGenerate}
        />

        {/* Résultat avec animation */}
        {generatedImage1 && (
          <div ref={resultRef} className="animate-in fade-in duration-500 mt-8">
            <Card className="shadow-2xl">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-center mb-3">
                  {isDuoMode && generatedImage2
                    ? "COMPARAISON DUO"
                    : "RÉSULTAT"}
                </h2>

                {/* Mode DUO avec 2 images */}
                {isDuoMode && generatedImage2 ? (
                  <div className="space-y-4">
                    {/* Slider comparatif si showBeforeAfter est true */}
                    {showBeforeAfter && (
                      <BeforeAfterSlider
                        imageLeft={generatedImage1}
                        imageRight={generatedImage2}
                        labelLeft="Tissu 1"
                        labelRight="Tissu 2"
                      />
                    )}

                    {/* Images individuelles (toujours affichées en mode Duo) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-2">
                        <p className="text-center font-semibold text-sm">
                          Tissu 1
                        </p>
                        <img
                          src={generatedImage1}
                          alt="Résultat Tissu 1"
                          className="w-full rounded-lg shadow-md"
                        />
                        <Button
                          onClick={async () =>
                            await downloadImage(
                              generatedImage1,
                              `canape-tissu1-${Date.now()}.png`
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger Tissu 1
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-center font-semibold text-sm">
                          Tissu 2
                        </p>
                        <img
                          src={generatedImage2}
                          alt="Résultat Tissu 2"
                          className="w-full rounded-lg shadow-md"
                        />
                        <Button
                          onClick={async () =>
                            await downloadImage(
                              generatedImage2,
                              `canape-tissu2-${Date.now()}.png`
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger Tissu 2
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mode NORMAL : Une seule image */
                  <div className="max-w-4xl mx-auto">
                    <img
                      src={generatedImage1}
                      alt="Résultat"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={handleBackToEdit}
                    variant="outline"
                    size="sm"
                  >
                    ← Retour
                  </Button>
                  {isDuoMode && generatedImage2 && (
                    <Button
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      variant="outline"
                      size="sm"
                    >
                      {showBeforeAfter
                        ? "Masquer le slider"
                        : "Afficher le slider"}
                    </Button>
                  )}
                  {!isDuoMode && (
                    <Button
                      onClick={async () =>
                        await downloadImage(
                          generatedImage1,
                          `canape-${Date.now()}.png`
                        )
                      }
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                  )}
                  <Button onClick={handleRestart} variant="primary" size="sm">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Recommencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historique affiché à la fin */}
        {history.length > 0 && (
          <Card className="shadow-lg mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">📋 Historique</h2>
                <Button onClick={clearHistory} variant="outline" size="sm">
                  Effacer tout
                </Button>
              </div>
              <HistoryPanel
                history={history}
                onDelete={removeFromHistory}
                onClear={clearHistory}
                onView={handleViewFromHistory}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
