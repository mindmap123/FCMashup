import { History, Trash2, Eye } from "lucide-react";
import { HistoryItem } from "@/types";
import Button from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface HistoryPanelProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onView?: (item: HistoryItem) => void;
}

export default function HistoryPanel({
  history,
  onDelete,
  onClear,
  onView,
}: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Aucune génération dans l'historique
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique ({history.length})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-1" />
          Tout effacer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
            >
              {/* Mode DUO : Afficher les deux images en vertical dans un carré */}
              {item.mode === "duo" && item.tissu1Url && item.tissu2Url ? (
                <div className="relative aspect-square">
                  <div className="grid grid-rows-2 gap-0.5 h-full">
                    <img
                      src={item.tissu1Url}
                      alt="Tissu 1"
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={item.tissu2Url}
                      alt="Tissu 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Badge DUO visible */}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                    DUO
                  </div>
                </div>
              ) : (
                /* Mode NORMAL : Une seule image */
                <img
                  src={item.resultImage}
                  alt="Résultat"
                  className="w-full aspect-square object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {onView && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onView(item)}
                    className="bg-white/90 hover:bg-white"
                    title="Visualiser"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="bg-white/90 hover:bg-white text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">
                  {new Date(item.timestamp).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
