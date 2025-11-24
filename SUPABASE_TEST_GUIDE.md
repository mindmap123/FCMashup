# 🧪 Guide de Test Supabase pour FCMashup

## 📋 Prérequis

1. Compte Supabase actif
2. Projet: `mpshazhcbbmsyeugkzrp`
3. URL: `https://mpshazhcbbmsyeugkzrp.supabase.co`

---

## 🗄️ ÉTAPE 1: Créer la Table

### Option A: Via Supabase Dashboard (RECOMMANDÉ)

1. Aller sur: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp
2. Cliquer sur **SQL Editor** dans le menu gauche
3. Cliquer sur **New Query**
4. Copier-coller le SQL suivant:

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

5. Cliquer sur **Run** (ou Ctrl+Enter)
6. Vérifier le message: `Success. No rows returned`

### Option B: Via Script Node.js

```bash
node scripts/setup-supabase.js
```

---

## ✅ ÉTAPE 2: Vérifier la Table

### Via Dashboard

1. Aller sur: **Table Editor** → **history**
2. Vérifier les colonnes:
   - ✅ `id` (int8, primary key)
   - ✅ `image_url` (text, not null)
   - ✅ `type` (text, nullable)
   - ✅ `metadata` (jsonb, nullable)
   - ✅ `created_at` (timestamptz, default: now())

### Via SQL

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'history'
ORDER BY ordinal_position;
```

---

## 🔒 ÉTAPE 3: Vérifier les Policies

### Via Dashboard

1. Aller sur: **Authentication** → **Policies**
2. Sélectionner la table **history**
3. Vérifier les 3 policies:
   - ✅ `Allow public read access` (SELECT)
   - ✅ `Allow public insert access` (INSERT)
   - ✅ `Allow public delete access` (DELETE)

### Via SQL

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'history';
```

**Résultat attendu:**

| policyname                 | cmd    | roles    |
| -------------------------- | ------ | -------- |
| Allow public read access   | SELECT | {public} |
| Allow public insert access | INSERT | {public} |
| Allow public delete access | DELETE | {public} |

---

## 🧪 ÉTAPE 4: Test d'Insertion Manuelle

### Via SQL Editor

```sql
-- Insérer une entrée de test
INSERT INTO history (image_url, type, metadata)
VALUES (
  'https://replicate.delivery/test/image.jpg',
  'simple',
  '{"sofaUrl": "https://example.com/sofa.jpg", "fabricUrl": "https://example.com/fabric.jpg", "model": "banana"}'::jsonb
);

-- Vérifier l'insertion
SELECT * FROM history ORDER BY created_at DESC LIMIT 1;
```

**Résultat attendu:**

- 1 ligne insérée
- `id` auto-généré
- `created_at` = timestamp actuel

### Via Script Node.js

```bash
node -e "
import('@supabase/supabase-js').then(({ createClient }) => {
  const supabase = createClient(
    'https://mpshazhcbbmsyeugkzrp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2hhemhjYmJtc3lldWdrenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjczNzEsImV4cCI6MjA3OTU0MzM3MX0.TrgJ8D8-eQA252i9jZODnIJFIgj3h-oiEyB2Zn6RePc'
  );

  supabase.from('history').insert({
    image_url: 'https://test.com/image.jpg',
    type: 'test',
    metadata: { test: true }
  }).then(({ data, error }) => {
    if (error) console.error('❌ Error:', error);
    else console.log('✅ Success:', data);
  });
});
"
```

---

## 🎨 ÉTAPE 5: Test depuis l'Application

### Test Local (http://localhost:5173)

1. Lancer l'app: `npm run dev`
2. Générer une image:
   - Sélectionner un modèle (Banana Pro ou Seedream)
   - Uploader une image de canapé
   - Uploader une image de tissu
   - Cliquer "Générer"
3. Vérifier la console navigateur:
   ```
   ✅ History saved to Supabase
   ```
4. Vérifier dans Supabase Dashboard → Table Editor → history
5. Vérifier que l'entrée apparaît avec:
   - `image_url`: URL Replicate
   - `type`: "simple" ou "duo"
   - `metadata`: JSON avec sofaUrl, fabricUrl, model, description

### Test Production (Vercel)

1. Déployer sur Vercel
2. Ouvrir l'app en production
3. Générer une image
4. Vérifier dans Supabase que l'entrée est créée
5. Recharger l'app
6. Vérifier que l'historique s'affiche

---

## 🔍 ÉTAPE 6: Test de Lecture

### Via Console Navigateur

```javascript
// Ouvrir DevTools → Console
import { getHistory } from "./src/lib/historyService";

getHistory().then((data) => {
  console.log("📊 History:", data);
  console.log("📈 Count:", data.length);
});
```

### Via SQL

```sql
-- Compter les entrées
SELECT COUNT(*) FROM history;

-- Voir les 10 dernières
SELECT id, image_url, type, created_at
FROM history
ORDER BY created_at DESC
LIMIT 10;

-- Voir les métadonnées
SELECT id, metadata->>'model' as model, metadata->>'description' as description
FROM history
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🗑️ ÉTAPE 7: Test de Suppression

### Via Application

1. Aller dans l'historique
2. Survoler une image
3. Cliquer sur l'icône poubelle
4. Vérifier que l'image disparaît
5. Vérifier dans Supabase que l'entrée est supprimée

### Via SQL

```sql
-- Supprimer une entrée spécifique
DELETE FROM history WHERE id = 1;

-- Supprimer toutes les entrées de test
DELETE FROM history WHERE type = 'test';

-- Vider complètement la table
TRUNCATE TABLE history RESTART IDENTITY;
```

---

## 📊 ÉTAPE 8: Monitoring

### Métriques à Surveiller

1. **Nombre d'entrées**

   ```sql
   SELECT COUNT(*) as total_entries FROM history;
   ```

2. **Entrées par type**

   ```sql
   SELECT type, COUNT(*) as count
   FROM history
   GROUP BY type;
   ```

3. **Entrées par modèle**

   ```sql
   SELECT metadata->>'model' as model, COUNT(*) as count
   FROM history
   GROUP BY metadata->>'model';
   ```

4. **Taille de la table**

   ```sql
   SELECT pg_size_pretty(pg_total_relation_size('history')) as table_size;
   ```

5. **Dernières entrées**
   ```sql
   SELECT id, type, created_at
   FROM history
   ORDER BY created_at DESC
   LIMIT 5;
   ```

---

## 🐛 Troubleshooting

### Erreur: "Could not find the table 'public.history'"

**Solution**: La table n'existe pas. Exécuter le SQL de création (Étape 1).

### Erreur: "new row violates row-level security policy"

**Solution**: Les policies ne sont pas configurées. Vérifier l'Étape 3.

### Erreur: "permission denied for table history"

**Solution**: RLS est activé mais les policies manquent. Exécuter:

```sql
CREATE POLICY "Allow public read access" ON history FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON history FOR DELETE USING (true);
```

### L'historique ne charge pas

**Vérifications**:

1. Console navigateur → Erreurs ?
2. Network tab → Requête vers Supabase ?
3. Supabase Dashboard → Logs → Erreurs ?

**Solution**: Vérifier que:

- La table existe
- Les policies sont actives
- L'anon key est correcte
- Le RLS est activé

### L'insertion échoue silencieusement

**Vérifications**:

```javascript
// Dans useCanapeGenerator.ts, vérifier les logs
console.log("✅ History saved to Supabase");
// ou
console.error("⚠️ Failed to save history:", historyError);
```

**Solution**: Vérifier la policy INSERT.

---

## ✅ Checklist Finale

- [ ] Table `history` créée
- [ ] Index `idx_history_created_at` créé
- [ ] RLS activé
- [ ] Policy SELECT créée
- [ ] Policy INSERT créée
- [ ] Policy DELETE créée
- [ ] Test d'insertion manuelle réussi
- [ ] Test depuis l'app local réussi
- [ ] Test depuis l'app production réussi
- [ ] Historique s'affiche correctement
- [ ] Suppression fonctionne
- [ ] Logs Supabase propres

---

## 🎉 Confirmation de Succès

Si tous les tests passent:

✅ **Supabase est correctement configuré**  
✅ **L'historique est persistant**  
✅ **Fonctionne en local et production**  
✅ **Pas de limite localStorage**  
✅ **Synchronisé entre appareils**

---

## 📞 Support

En cas de problème:

1. Vérifier les logs Supabase: Dashboard → Logs
2. Vérifier la console navigateur
3. Vérifier les policies RLS
4. Tester manuellement via SQL Editor
