# Système d'Upload Backend pour Vercel

## Architecture

Le système d'upload utilise une architecture backend pour contourner les restrictions CORS de Replicate.

### Flux d'Upload

```
Frontend (Browser)
    ↓ base64 JSON
/api/upload (Vercel Serverless)
    ↓ FormData
Replicate API
    ↓ URL
Frontend
```

## Fichiers Modifiés

### 1. `/api/upload.ts` - Backend Serverless

- **Fonction**: Handler Vercel qui reçoit les images en base64 et les upload vers Replicate
- **Input**: `{ image: string (base64), filename: string }`
- **Output**: `{ uploaded: true, url: string, id: string }`
- **Logs**:
  - `📤 Upload vers backend...`
  - `📤 Upload vers Replicate...`
  - `✅ Upload vers Replicate OK`

### 2. `/src/lib/uploadToReplicate.ts` - Client Upload

- **Fonction**: Convertit les fichiers en base64 et appelle `/api/upload`
- **Input**: `File` object
- **Output**: URL Replicate
- **Logs**:
  - `📤 Upload vers backend...`
  - `✅ Upload vers Replicate OK`

### 3. `/src/lib/replicate.ts` - Génération

- **Fonction**: Détecte les data URLs et les upload automatiquement avant génération
- **Validation**: Vérifie que les URLs commencent par `http` avant d'appeler `/api/generate`

### 4. `/api/generate.ts` - Génération Backend

- **Fonction**: Reçoit uniquement des URLs Replicate (pas de data URLs)
- **Validation**: Rejette les requêtes sans URLs HTTP valides
- **Runtime**: Edge Function pour performance optimale

## Sécurité

- ✅ Pas d'exposition de `REPLICATE_API_TOKEN` côté client
- ✅ Validation des formats d'image (data:image/\*)
- ✅ Validation des URLs HTTP dans `/api/generate`
- ✅ CORS configuré pour tous les endpoints

## Déploiement Vercel

Les fonctions serverless sont automatiquement détectées grâce à `vercel.json`:

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

## Test Local

```bash
npm run dev
```

Les endpoints seront disponibles sur:

- `http://localhost:5173/api/upload`
- `http://localhost:5173/api/generate`

## Variables d'Environnement

Assurez-vous que `REPLICATE_API_TOKEN` est configuré dans:

- `.env` (local)
- Vercel Dashboard → Settings → Environment Variables (production)

## Déploiement sur Vercel

1. **Push vers Git**:

   ```bash
   git add .
   git commit -m "feat: backend upload system for Vercel"
   git push
   ```

2. **Vercel détectera automatiquement**:

   - ✅ `/api/upload.ts` → Serverless Function
   - ✅ `/api/generate.ts` → Edge Function
   - ✅ Frontend Vite → Static Site

3. **Vérifier les logs Vercel**:

   - Cherchez `📤 Upload vers backend...`
   - Cherchez `✅ Upload vers Replicate OK`

4. **Tester en production**:
   - Uploadez une image de canapé
   - Uploadez une image de tissu
   - Lancez la génération
   - Vérifiez que les URLs Replicate sont utilisées
