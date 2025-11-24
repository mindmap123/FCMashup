# 🛡️ PROTECTION DU BACKEND - RÈGLES STRICTES

## ⚠️ FICHIERS INTOUCHABLES

Les fichiers suivants sont **CRITIQUES** et ne doivent **JAMAIS** être supprimés, déplacés ou modifiés automatiquement :

### Backend Deno

- ✅ `functions/server.ts`
- ✅ `functions/generateCanapeWithReplicate.ts`
- ✅ `functions/README.md`

### Scripts

- ✅ `scripts/start-backend.sh`

### Configuration

- ✅ `.env`
- ✅ `.env.example`
- ✅ `server.ts` (racine)

## 🚀 Démarrage du backend

```bash
# Méthode 1 : Script automatique
./scripts/start-backend.sh

# Méthode 2 : Commande directe
cd functions
deno run --allow-net --allow-env server.ts
```

## ✅ Vérification du backend

Le serveur doit afficher :

```
🚀 Serveur Deno en cours d'exécution sur http://localhost:8000
📍 Route disponible: POST /api/generate
```

## 🔧 Configuration

### .env

```env
REPLICATE_API_TOKEN=votre_token_ici
VITE_BACKEND_URL=http://localhost:8000/api/generate
```

## 📡 Routes API

### POST /api/generate

Génère une image de canapé avec tissu personnalisé.

**Request:**

```json
{
  "imageSofaUrl": "data:image/jpeg;base64,...",
  "imageFabricUrl": "data:image/jpeg;base64,...",
  "fabricDescription": "optional description",
  "model": "banana" | "seedream"
}
```

**Response (success):**

```json
{
  "success": true,
  "url": "https://replicate.delivery/..."
}
```

**Response (error):**

```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

## 🔒 Règles de protection

1. **Nettoyage automatique** : Le dossier `functions/` est exclu de tout nettoyage
2. **Suppression** : Aucun fichier backend ne peut être supprimé automatiquement
3. **Modification** : Les modifications doivent être manuelles et documentées
4. **Backup** : Toujours garder une copie de `functions/` avant toute modification

## ⚡ Dépannage

### Erreur "Module not found"

```bash
# Vérifier que les fichiers existent
ls -la functions/
# Doit afficher : server.ts et generateCanapeWithReplicate.ts
```

### Erreur "Connection refused"

```bash
# Vérifier que le backend est démarré
curl http://localhost:8000/health
# Doit retourner : {"status":"ok"}
```

### Erreur "REPLICATE_API_TOKEN manquant"

```bash
# Vérifier le fichier .env
cat .env | grep REPLICATE_API_TOKEN
```

## 📝 Historique des modifications

- **2024-11-24** : Création du backend stable avec protection
- **Règle** : Toute modification future doit être documentée ici

---

⚠️ **RAPPEL** : Ces fichiers sont essentiels au fonctionnement de l'application. Ne jamais les supprimer !
