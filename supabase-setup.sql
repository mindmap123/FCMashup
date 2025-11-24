-- Créer la table history dans Supabase
-- Exécuter ce SQL dans le SQL Editor de Supabase Dashboard

CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur created_at pour les requêtes de tri
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access" ON history
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion publique
CREATE POLICY "Allow public insert access" ON history
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la suppression publique
CREATE POLICY "Allow public delete access" ON history
  FOR DELETE
  USING (true);
