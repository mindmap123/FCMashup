import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, Camera, X, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedImage } from "@/types";
import Button from "./ui/Button";

interface CompactUploadZoneProps {
  title?: string;
  uploadedImage: UploadedImage | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
  compactMode?: boolean; // Mode compact pour Duo : icônes uniquement
}

export default function CompactUploadZone({
  title,
  uploadedImage,
  onImageUpload,
  onImageRemove,
  disabled = false,
  compactMode = false,
}: CompactUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) onImageUpload(files[0]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onImageUpload(files[0]);
  };

  const handleUploadClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    if (!disabled) cameraInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      {title && (
        <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
          {title}
        </h3>
      )}

      {uploadedImage ? (
        <div
          className={cn(
            "relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50 flex-1",
            compactMode ? "min-h-[280px]" : "min-h-[200px] max-h-[240px]"
          )}
          style={{ aspectRatio: "1" }}
        >
          <img
            src={uploadedImage.preview}
            alt={title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onImageRemove}
            disabled={disabled}
            className={cn(
              "absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white",
              "hover:bg-red-600 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all flex-1",
            compactMode
              ? "min-h-[280px] p-3"
              : "min-h-[200px] max-h-[240px] p-4",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ aspectRatio: "1" }}
        >
          {compactMode ? (
            // Mode compact : icônes dans des boutons stylisés comme à gauche
            <div className="flex flex-col items-center justify-center gap-3 w-full h-full px-2">
              <Upload className="w-10 h-10 text-gray-400 mb-1" />
              <p className="text-xs text-gray-600 text-center mb-1 px-1">
                Glissez-déposez une image ici
              </p>
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={disabled}
                className={cn(
                  "w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-white",
                  "hover:bg-gray-50 transition-colors flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <FolderOpen className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handleCameraClick}
                disabled={disabled}
                className={cn(
                  "w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-white",
                  "hover:bg-gray-50 transition-colors flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            // Mode normal : avec texte et boutons
            <>
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-xs text-gray-600 text-center mb-3 px-2">
                Glissez-déposez une image ici
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  disabled={disabled}
                  className="w-full text-xs"
                >
                  <FolderOpen className="w-3 h-3 mr-1" />
                  Choisir depuis la photothèque
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCameraClick}
                  disabled={disabled}
                  className="w-full text-xs"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  Prendre une photo
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
