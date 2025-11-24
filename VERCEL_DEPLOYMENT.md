# 🚀 Guide de Déploiement Vercel

## Prérequis

- Compte GitHub
- Compte Vercel
- Token API Replicate

## 📋 Étapes de déploiement

### 1. Initialiser Git et pousser sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - France Canapé Visualizer"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git branch -M main
git push -u origin main
```

### 2. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"New Project"**
3. Importer votre repo GitHub
4. Configuration :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Root Directory** : `/`

### 3. Configurer les variables d'environnement

Dans Vercel → Settings → Environment Variables, ajouter :

```
REPLICATE_API_TOKEN=r8_votre_token_ici
```

**Important** : Cette variable est nécessaire pour que l'API `/api/generate` fonctionne.

### 4. Déployer

Cliquer sur **"Deploy"** et attendre la fin du build.

## 🔧 Configuration locale vs Production

### Développement local (avec Deno)

Fichier `.env` :

```env
REPLICATE_API_TOKEN=r8_votre_token
VITE_BACKEND_URL=http://localhost:8000/api/generate
```

Démarrer le backend Deno :

```bash
./scripts/start-backend.sh
```

Démarrer le frontend :

```bash
npm run dev
```

### Production (Vercel)

Fichier `.env.production` (optionnel) :

```env
VITE_BACKEND_URL=/api/generate
```

Le backend est automatiquement géré par Vercel via `/api/generate`.

## 📁 Structure du projet

```
/
├── api/                    # Vercel Serverless Functions
│   └── generate.ts         # API de génération IA
├── functions/              # Backend Deno (dev local uniquement)
│   ├── server.ts
│   └── generateCanapeWithReplicate.ts
├── src/                    # Frontend React
├── dist/                   # Build output (généré)
├── vercel.json            # Configuration Vercel
└── .env                   # Variables d'environnement (local)
```

## 🔄 Déploiement automatique

Chaque push sur la branche `main` déclenche automatiquement un nouveau déploiement sur Vercel.

## 🐛 Dépannage

### Erreur "REPLICATE_API_TOKEN not configured"

Vérifier que la variable d'environnement est bien configurée dans Vercel → Settings → Environment Variables.

### Erreur 404 sur /api/generate

Vérifier que le fichier `api/generate.ts` existe et que `vercel.json` est correctement configuré.

### Build échoue

Vérifier les logs de build dans Vercel et s'assurer que toutes les dépendances sont installées :

```bash
npm install
npm run build
```

## 📊 Monitoring

- **Logs** : Vercel → Deployments → [Votre déploiement] → Logs
- **Analytics** : Vercel → Analytics
- **Performance** : Vercel → Speed Insights

## 🔐 Sécurité

- ✅ Le token Replicate est stocké de manière sécurisée dans les variables d'environnement Vercel
- ✅ Le fichier `.env` est dans `.gitignore` et n'est jamais commité
- ✅ Les API routes sont protégées par CORS

## 🎯 URLs

- **Production** : `https://votre-projet.vercel.app`
- **Preview** : Chaque PR génère une URL de preview unique
- **Local** : `http://localhost:5173` (frontend) + `http://localhost:8000` (backend Deno)

---

✅ **Votre application est maintenant déployée et accessible publiquement !**
