import { Sparkles, Loader2 } from "lucide-react";
import { AIModel } from "@/types";

interface PremiumGenerationButtonProps {
  isGenerating: boolean;
  canGenerate: boolean;
  selectedModel: AIModel | null;
  onGenerate: () => void;
}

export default function PremiumGenerationButton({
  isGenerating,
  canGenerate,
  selectedModel,
  onGenerate,
}: PremiumGenerationButtonProps) {
  const getGradient = () => {
    if (selectedModel === "banana") {
      return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
    }
    if (selectedModel === "seedream") {
      return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
    }
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <button
      onClick={onGenerate}
      disabled={!canGenerate || isGenerating}
      className={`
        w-full py-4 px-6 rounded-xl
        text-white font-bold text-lg
        shadow-lg hover:shadow-xl
        transform transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${getGradient()}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Génération en cours...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            <span>Générer avec l'IA</span>
          </>
        )}
      </div>
    </button>
  );
}
