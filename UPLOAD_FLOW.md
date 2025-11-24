# Flux d'Upload - Architecture Backend

## Problème Résolu

Replicate bloque les requêtes directes depuis le navigateur (CORS) → Solution: Backend proxy

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                      (React + Vite)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1. File → base64
                              ↓
                    📤 POST /api/upload
                    { image: "data:image/...",
                      filename: "sofa.jpg" }
                              │
┌─────────────────────────────────────────────────────────────┐
│                    /api/upload.ts                            │
│                 (Vercel Serverless)                          │
│                                                              │
│  • Parse base64                                              │
│  • Convert to Buffer                                         │
│  • Create FormData                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 2. FormData + Token
                              ↓
                    📤 POST https://api.replicate.com/v1/uploads
                    Authorization: Token r8_xxx
                              │
┌─────────────────────────────────────────────────────────────┐
│                      REPLICATE API                           │
│                                                              │
│  • Store image                                               │
│  • Return URL                                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 3. { url: "https://...", id: "..." }
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    /api/upload.ts                            │
│                                                              │
│  • Return { uploaded: true, url, id }                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 4. URL Replicate
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│  • Store URL                                                 │
│  • Use for generation                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 5. POST /api/generate
                              │    { sofa_url, fabric_url }
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   /api/generate.ts                           │
│                   (Edge Function)                            │
│                                                              │
│  • Validate URLs (must start with http)                      │
│  • Call Replicate prediction API                             │
│  • Return generated image URL                                │
└─────────────────────────────────────────────────────────────┘
```

## Logs de Suivi

### Frontend (`uploadToReplicate.ts`)

```
📤 Upload vers backend...
✅ Upload vers Replicate OK
```

### Backend (`/api/upload.ts`)

```
📤 Upload vers backend...
📤 Upload vers Replicate...
✅ Upload vers Replicate OK
```

## Sécurité

✅ **Token jamais exposé**: `REPLICATE_API_TOKEN` reste côté serveur  
✅ **Validation stricte**: Seules les images sont acceptées  
✅ **URLs validées**: `/api/generate` rejette les data URLs  
✅ **CORS configuré**: Tous les endpoints ont les headers CORS

## Fichiers Modifiés

| Fichier                        | Rôle               | Changement                        |
| ------------------------------ | ------------------ | --------------------------------- |
| `api/upload.ts`                | Backend upload     | JSON + base64 au lieu de FormData |
| `src/lib/uploadToReplicate.ts` | Client upload      | Appelle `/api/upload`             |
| `src/lib/replicate.ts`         | Génération         | Upload auto des data URLs         |
| `api/generate.ts`              | Backend génération | Valide les URLs HTTP              |

## Dépendances Retirées

- ❌ `formidable` (plus nécessaire)
- ❌ `@types/formidable`

## Dépendances Utilisées

- ✅ `form-data` (pour FormData côté serveur)
- ✅ `@vercel/node` (types Vercel)
