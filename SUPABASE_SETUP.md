# Configuration Supabase pour FCMashup

## 📋 Informations de Connexion

- **URL**: `https://mpshazhcbbmsyeugkzrp.supabase.co`
- **Anon Key**: Configurée dans `src/lib/supabase.ts`

## 🗄️ Configuration de la Base de Données

### 1. Créer la Table `history`

Exécutez le SQL suivant dans le **SQL Editor** de Supabase Dashboard:

```sql
-- Créer la table history
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
```

### 2. Structure de la Table

| Colonne      | Type      | Requis   | Description                                     |
| ------------ | --------- | -------- | ----------------------------------------------- |
| `id`         | BIGSERIAL | Oui (PK) | Identifiant unique auto-incrémenté              |
| `image_url`  | TEXT      | Oui      | URL de l'image générée (Replicate)              |
| `type`       | TEXT      | Non      | Type de génération ("simple" ou "duo")          |
| `metadata`   | JSONB     | Non      | Métadonnées (URLs sources, modèle, description) |
| `created_at` | TIMESTAMP | Oui      | Date de création (auto)                         |

### 3. Exemple de Métadonnées

```json
{
  "sofaUrl": "https://replicate.delivery/...",
  "fabricUrl": "https://replicate.delivery/...",
  "fabricUrl2": "https://replicate.delivery/...",
  "model": "banana",
  "description": "Tissu velours bleu"
}
```

## 📁 Fichiers Créés

### `src/lib/supabase.ts`

Client Supabase configuré avec les credentials.

### `src/lib/historyService.ts`

Service pour interagir avec la table `history`:

- `saveHistory(data)` - Sauvegarder une génération
- `getHistory()` - Récupérer l'historique
- `deleteHistoryEntry(id)` - Supprimer une entrée

### `src/hooks/useHistory.ts` (Modifié)

Hook React qui utilise Supabase au lieu de localStorage:

- Charge l'historique depuis Supabase au démarrage
- Fallback vers localStorage si Supabase échoue
- Suppression et nettoyage via Supabase

### `src/hooks/useCanapeGenerator.ts` (Modifié)

Sauvegarde automatique dans Supabase après chaque génération réussie.

## 🚀 Fonctionnement

### Sauvegarde Automatique

Quand une image est générée avec succès:

```typescript
await saveHistory({
  image_url: generatedImageUrl,
  type: isDuoMode ? "duo" : "simple",
  metadata: {
    sofaUrl: "https://replicate.delivery/...",
    fabricUrl: "https://replicate.delivery/...",
    model: "banana",
    description: "Description du tissu",
  },
});
```

### Récupération de l'Historique

Au chargement de l'app:

```typescript
const { data: history } = await getHistory();
// Retourne les entrées triées par date (plus récent en premier)
```

### Affichage

Le composant `HistoryPanel` affiche automatiquement l'historique depuis Supabase.

## ✅ Avantages

- ✅ **Persistance**: L'historique survit aux changements de machine/navigateur
- ✅ **Scalabilité**: Pas de limite localStorage (5MB)
- ✅ **Synchronisation**: Historique partagé entre appareils
- ✅ **Backup**: Données sauvegardées dans le cloud
- ✅ **Fallback**: Utilise localStorage si Supabase échoue

## 🧪 Test

### 1. Vérifier la Table

Dans Supabase Dashboard → Table Editor → `history`

### 2. Tester l'Insertion

```sql
SELECT * FROM history ORDER BY created_at DESC LIMIT 10;
```

### 3. Tester depuis l'App

1. Générer une image
2. Vérifier dans Supabase que l'entrée est créée
3. Recharger l'app
4. Vérifier que l'historique s'affiche

## 🔒 Sécurité

- **RLS activé**: Row Level Security pour contrôler l'accès
- **Politiques publiques**: Lecture/écriture/suppression autorisées pour tous
- **Anon Key**: Utilisée côté client (sécurisée pour usage public)

## 📊 Monitoring

Supabase Dashboard → Database → Tables → `history`

- Nombre d'entrées
- Taille de la table
- Requêtes récentes

## 🔄 Migration depuis localStorage

L'historique localStorage existant reste accessible en fallback si Supabase échoue.

Pour migrer manuellement:

```typescript
// Dans la console du navigateur
const oldHistory = JSON.parse(
  localStorage.getItem("france-canape-history") || "[]"
);
for (const item of oldHistory) {
  await saveHistory({
    image_url: item.resultImage,
    type: item.mode || "simple",
    metadata: {
      sofaUrl: item.sofaImage,
      fabricUrl: item.fabricImage,
      model: item.model,
      description: item.description,
    },
  });
}
```

## 📝 Notes

- Les images sont stockées sur Replicate, seules les URLs sont dans Supabase
- La table `history` peut être nettoyée périodiquement si nécessaire
- Les métadonnées JSONB permettent d'ajouter des champs sans migration
