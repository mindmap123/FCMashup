import { WifiOff, Wifi } from "lucide-react";

interface OfflineBadgeProps {
  isOffline: boolean;
}

export default function OfflineBadge({ isOffline }: OfflineBadgeProps) {
  if (!isOffline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Mode Hors Ligne</span>
    </div>
  );
}

export function OnlineBadge() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
      <Wifi className="w-4 h-4" />
      <span className="text-sm font-medium">En Ligne</span>
    </div>
  );
}
