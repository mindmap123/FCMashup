# Guide de Déploiement

## Option 1 : Supabase Edge Functions (Recommandé)

### Prérequis
- Compte Supabase
- Supabase CLI installé
- Token Replicate API

### Étapes

1. **Initialiser Supabase**
```bash
supabase init
```

2. **Créer la fonction**
```bash
supabase functions new generate-canape
```

3. **Copier le code**
Copiez le contenu de `functions/generateCanapeWithReplicate.ts` dans `supabase/functions/generate-canape/index.ts`

4. **Configurer les secrets**
```bash
supabase secrets set REPLICATE_API_TOKEN=your_token_here
```

5. **Déployer**
```bash
supabase functions deploy generate-canape
```

6. **Obtenir l'URL**
L'URL sera : `https://[project-ref].supabase.co/functions/v1/generate-canape`

7. **Configurer le frontend**
Dans `.env` :
```
VITE_BACKEND_URL=https://[project-ref].supabase.co/functions/v1/generate-canape
```

## Option 2 : Deno Deploy

### Étapes

1. **Créer un compte** sur [deno.com/deploy](https://deno.com/deploy)

2. **Créer un nouveau projet**

3. **Déployer via GitHub**
   - Connectez votre repo
   - Sélectionnez `functions/generateCanapeWithReplicate.ts` comme entry point

4. **Configurer les variables d'environnement**
   - Ajoutez `REPLICATE_API_TOKEN` dans les settings

5. **Obtenir l'URL de déploiement**

6. **Configurer le frontend**
```
VITE_BACKEND_URL=https://your-project.deno.dev
```

## Option 3 : Cloudflare Workers

### Adaptation nécessaire

Le code Deno doit être adapté pour Cloudflare Workers :

1. Remplacer les imports Deno par les APIs Cloudflare
2. Utiliser `wrangler` pour le déploiement
3. Configurer les secrets avec `wrangler secret put`

## Déploiement Frontend

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add VITE_BACKEND_URL
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Déployer
netlify deploy --prod --dir=dist
```

### Configuration des variables d'environnement

Dans les settings de votre plateforme, ajoutez :
- `VITE_BACKEND_URL` : URL de votre backend déployé

## Upload d'Images en Production

⚠️ **Important** : Le code actuel utilise des data URLs (base64) pour les images. En production, vous devriez :

1. **Uploader les images vers un stockage cloud** (S3, Cloudinary, Supabase Storage)
2. **Obtenir des URLs publiques**
3. **Passer ces URLs au backend**

### Exemple avec Supabase Storage

```typescript
// Dans src/lib/storage.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function uploadImage(file: File, bucket: string): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrl
}
```

Puis modifiez `handleGenerate` dans `FranceCanape.tsx` :

```typescript
const imageSofaUrl = await uploadImage(state.sofaImage.file, 'sofas')
const imageFabricUrl = await uploadImage(state.fabricImage.file, 'fabrics')
```

## Monitoring et Logs

### Supabase
- Logs disponibles dans le dashboard Supabase
- Monitoring des invocations et erreurs

### Deno Deploy
- Dashboard avec métriques en temps réel
- Logs accessibles via l'interface web

### Replicate
- Consultez votre usage sur replicate.com
- Surveillez les coûts par modèle

## Sécurité

1. **Ne jamais exposer** `REPLICATE_API_TOKEN` côté client
2. **Implémenter un rate limiting** sur le backend
3. **Valider les uploads** (taille, type MIME)
4. **Ajouter une authentification** si nécessaire
5. **Configurer CORS** correctement

## Coûts Estimés

- **Replicate** : ~$0.01-0.05 par génération (selon le modèle)
- **Supabase** : Gratuit jusqu'à 500k invocations/mois
- **Deno Deploy** : Gratuit jusqu'à 100k requêtes/mois
- **Vercel/Netlify** : Gratuit pour projets personnels

## Support

Pour toute question, consultez :
- [Documentation Replicate](https://replicate.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Deno Deploy](https://deno.com/deploy/docs)
