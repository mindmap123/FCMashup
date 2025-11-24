import { Banana, Sparkles } from "lucide-react";
import { AIModel } from "@/types";
import { cn } from "@/lib/utils";

interface CompactModelSelectorProps {
  selectedModel: AIModel | null;
  onSelectModel: (model: AIModel) => void;
  disabled?: boolean;
}

export default function CompactModelSelector({
  selectedModel,
  onSelectModel,
  disabled = false,
}: CompactModelSelectorProps) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 gap-1">
      <button
        onClick={() => onSelectModel("banana")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          selectedModel === "banana"
            ? "bg-banana-500 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-200"
        )}
      >
        <Banana className="w-4 h-4" />
        Banana Pro
      </button>
      <button
        onClick={() => onSelectModel("seedream")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          selectedModel === "seedream"
            ? "bg-blue-500 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-200"
        )}
      >
        <Sparkles className="w-4 h-4" />
        Seedream
      </button>
    </div>
  );
}
