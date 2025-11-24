import { useState, useEffect } from "react";
import { HistoryItem } from "@/types";

const HISTORY_KEY = "france-canape-history";
const MAX_HISTORY_ITEMS = 5; // Réduit pour éviter de saturer le localStorage

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Charger l'historique au démarrage
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique", error);
        // Si l'historique est corrompu, le vider
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  }, []);

  // Ajouter un élément à l'historique
  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(updatedHistory);

    // Gestion d'erreur pour quota dépassé
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn("⚠️ Quota localStorage dépassé, nettoyage de l'historique");
      // Vider l'historique et réessayer avec seulement le nouvel item
      const minimalHistory = [newItem];
      setHistory(minimalHistory);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(minimalHistory));
      } catch {
        console.error("❌ Impossible de sauvegarder l'historique");
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  };

  // Supprimer un élément
  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique", error);
    }
  };

  // Vider l'historique
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
