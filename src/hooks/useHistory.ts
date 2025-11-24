import { useState, useEffect } from "react";
import { HistoryItem } from "@/types";
import { getHistory, deleteHistoryEntry } from "@/lib/historyService";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger l'historique depuis Supabase au démarrage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();

      // Convertir les données Supabase au format HistoryItem
      const formattedHistory: HistoryItem[] = data.map((item) => ({
        id: item.id.toString(),
        timestamp: new Date(item.created_at).getTime(),
        sofaImage: item.metadata?.sofaUrl || "",
        fabricImage: item.metadata?.fabricUrl || "",
        resultImage: item.image_url,
        model: (item.metadata?.model || "banana") as "banana" | "seedream",
        description: item.metadata?.description,
        mode: item.type === "duo" ? "duo" : "normal",
        tissu1Url: item.metadata?.fabricUrl,
        tissu2Url: item.metadata?.fabricUrl2,
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error("❌ Error loading history from Supabase:", error);
      // Fallback vers localStorage si Supabase échoue
      const stored = localStorage.getItem("france-canape-history");
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch {
          setHistory([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un élément à l'historique (maintenant géré par useCanapeGenerator)
  const addToHistory = (_item: Omit<HistoryItem, "id" | "timestamp">) => {
    // Cette fonction est maintenant un no-op car la sauvegarde est faite dans useCanapeGenerator
    // On recharge juste l'historique depuis Supabase
    loadHistory();
  };

  // Supprimer un élément
  const removeFromHistory = async (id: string) => {
    try {
      await deleteHistoryEntry(parseInt(id));
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Error deleting history entry:", error);
    }
  };

  // Vider l'historique
  const clearHistory = async () => {
    try {
      // Supprimer tous les éléments un par un
      await Promise.all(
        history.map((item) => deleteHistoryEntry(parseInt(item.id)))
      );
      setHistory([]);
    } catch (error) {
      console.error("❌ Error clearing history:", error);
    }
  };

  return {
    history,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refreshHistory: loadHistory,
  };
}
