export type AIModel = "banana" | "seedream";

export interface GenerationRequest {
  imageSofaUrl: string;
  imageFabricUrl: string;
  fabricDescription?: string;
  model: AIModel;
}

export interface GenerationResponse {
  imageUrl: string;
}

export interface UploadedImage {
  file: File;
  preview: string;
}

export interface AppState {
  selectedModel: AIModel | null;
  sofaImage: UploadedImage | null;
  fabricImage1: UploadedImage | null;
  fabricImage2: UploadedImage | null; // Pour le mode Duo
  fabricDescription: string;
  generatedImage1: string | null;
  generatedImage2: string | null; // Pour le mode Duo
  isGenerating: boolean;
  isDuoMode: boolean;
  showBeforeAfter: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  sofaImage: string;
  fabricImage: string;
  resultImage: string;
  model: AIModel;
  description?: string;
  mode?: "normal" | "duo";
  tissu1Url?: string;
  tissu2Url?: string;
}

export interface QualityCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
