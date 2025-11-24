import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  variant?: "green" | "blue";
}

export default function SectionTitle({
  icon: Icon,
  title,
  className = "",
  variant = "green",
}: SectionTitleProps) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${className}`}>
      <div
        className={cn(
          "p-2 rounded-lg shadow-sm",
          variant === "blue"
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-green-500 to-green-600"
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  );
}
