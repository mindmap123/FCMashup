# 🚀 Quick Start Supabase - 2 Minutes

## Étape 1: Créer la Table (1 min)

### Option A: Copier-Coller Direct

1. **Ouvrir**: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp/editor
2. **Cliquer**: "New Query" (bouton en haut)
3. **Copier-Coller** ce SQL:

```sql
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON history FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON history FOR DELETE USING (true);
```

4. **Cliquer**: "Run" (ou Ctrl+Enter)
5. **Vérifier**: Message "Success. No rows returned"

### Option B: Via Fichier

```bash
# Le SQL est dans ce fichier:
cat supabase-setup.sql

# Copier le contenu et coller dans Supabase SQL Editor
```

---

## Étape 2: Tester (30 secondes)

```bash
node scripts/test-supabase.js
```

**Résultat attendu**:

```
🧪 Testing Supabase Integration
================================

1️⃣  Testing connection...
   ✅ Connection successful

2️⃣  Testing INSERT...
   ✅ INSERT successful (id: 1)

3️⃣  Testing SELECT...
   ✅ SELECT successful

4️⃣  Testing ORDER BY...
   ✅ ORDER BY successful

5️⃣  Testing DELETE...
   ✅ DELETE successful

6️⃣  Verifying deletion...
   ✅ Entry successfully deleted

7️⃣  Counting total entries...
   ✅ COUNT successful
   📊 Total entries: 0

================================
🎉 All tests passed!
```

---

## Étape 3: Vérifier dans l'App (30 secondes)

```bash
npm run dev
```

1. Ouvrir http://localhost:5173
2. Générer une image
3. Console navigateur: `✅ History saved to Supabase`
4. Vérifier Supabase Dashboard → Table Editor → history
5. Voir la nouvelle entrée

---

## ✅ C'est Tout !

Supabase est maintenant configuré et fonctionne.

### Vérification Rapide

```bash
# Voir les entrées dans Supabase
node -e "
import('@supabase/supabase-js').then(({ createClient }) => {
  const s = createClient('https://mpshazhcbbmsyeugkzrp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2hhemhjYmJtc3lldWdrenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjczNzEsImV4cCI6MjA3OTU0MzM3MX0.TrgJ8D8-eQA252i9jZODnIJFIgj3h-oiEyB2Zn6RePc');
  s.from('history').select('*').then(({data}) => console.log('📊 Entries:', data?.length || 0));
});
"
```

---

## 🐛 Problème ?

### "Could not find the table 'public.history'"

→ La table n'existe pas. Retour à l'Étape 1.

### "new row violates row-level security policy"

→ Les policies manquent. Exécuter tout le SQL de l'Étape 1.

### "permission denied for table history"

→ RLS activé mais policies manquantes. Exécuter les CREATE POLICY.

---

## 📞 Aide

- **Dashboard**: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp
- **Table Editor**: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp/editor
- **SQL Editor**: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp/sql

---

**Temps total**: 2 minutes ⏱️
