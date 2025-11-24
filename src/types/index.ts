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
  fabricImage: UploadedImage | null;
  fabricImage2: UploadedImage | null; // Pour le mode Duo
  fabricDescription: string;
  generatedImageUrl: string | null;
  generatedImageUrl2: string | null; // Pour le mode Duo
  isGenerating: boolean;
  isDuoMode: boolean;
  isMultiAngleMode: boolean;
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
