import { supabase } from "./supabase";

export interface HistoryEntry {
  id?: number;
  image_url: string;
  type?: string;
  metadata?: {
    sofaUrl?: string;
    fabricUrl?: string;
    model?: string;
    description?: string;
  };
  created_at?: string;
}

export async function saveHistory(data: HistoryEntry) {
  const { data: result, error } = await supabase.from("history").insert(data);

  if (error) {
    console.error("❌ Error saving to history:", error);
    throw error;
  }

  console.log("✅ Saved to history:", result);
  return result;
}

export async function getHistory() {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching history:", error);
    throw error;
  }

  return data;
}

export async function deleteHistoryEntry(id: number) {
  const { error } = await supabase.from("history").delete().eq("id", id);

  if (error) {
    console.error("❌ Error deleting history entry:", error);
    throw error;
  }

  console.log("✅ Deleted history entry:", id);
}
