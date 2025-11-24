# Démarrage Rapide

Guide pour lancer l'application en 5 minutes.

## Prérequis

- Node.js 18+ installé
- npm, yarn ou pnpm
- (Optionnel) Deno pour le backend local
- (Optionnel) Token Replicate API

## Installation Express

### 1. Cloner et Installer

```bash
# Cloner le repository
git clone https://github.com/your-repo/france-canape-visualizer.git
cd france-canape-visualizer

# Installer les dépendances
npm install
```

### 2. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et configurer l'URL du backend
# VITE_BACKEND_URL=http://localhost:8000/api/generate
```

### 3. Lancer l'Application

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Mode Développement Sans Backend

Si vous voulez tester l'interface sans configurer le backend :

1. Modifiez `.env` :

```
VITE_USE_MOCK_BACKEND=true
```

2. L'application utilisera des données mockées

## Configuration du Backend (Optionnel)

### Option A : Backend Local avec Deno

```bash
# Installer Deno
curl -fsSL https://deno.land/install.sh | sh

# Configurer le token Replicate
export REPLICATE_API_TOKEN=your_token_here

# Lancer le backend
./scripts/start-backend.sh
```

### Option B : Déployer sur Supabase

```bash
# Installer Supabase CLI
npm install -g supabase

# Initialiser
supabase init

# Créer la fonction
supabase functions new generate-canape

# Copier le code
cp functions/generateCanapeWithReplicate.ts supabase/functions/generate-canape/index.ts

# Configurer le secret
supabase secrets set REPLICATE_API_TOKEN=your_token_here

# Déployer
supabase functions deploy generate-canape

# Obtenir l'URL et la mettre dans .env
```

## Vérification

### Frontend

1. Ouvrez `http://localhost:5173`
2. Vous devriez voir l'interface France Canapé
3. Les deux boutons de modèle IA sont visibles
4. Les zones d'upload sont fonctionnelles

### Backend (si configuré)

1. Le backend écoute sur `http://localhost:8000`
2. Testez avec curl :

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "imageSofaUrl": "https://example.com/sofa.jpg",
    "imageFabricUrl": "https://example.com/fabric.jpg",
    "model": "banana"
  }'
```

## Premiers Pas

### 1. Sélectionner un Modèle

- Cliquez sur "Banana Pro" ou "Seedream"
- Le thème de l'interface change selon votre choix

### 2. Uploader les Images

- **Canapé** : Glissez-déposez ou cliquez pour sélectionner
- **Tissu** : Même processus

### 3. (Optionnel) Ajouter une Description

- Décrivez le tissu : "velours côtelé beige"
- Cela aide l'IA à mieux comprendre

### 4. Générer

- Cliquez sur "Générer l'image avec IA"
- Attendez 20-60 secondes
- Le résultat s'affiche automatiquement

### 5. Télécharger

- Cliquez sur "Télécharger" pour sauvegarder
- Ou "Recommencer" pour une nouvelle génération

## Résolution de Problèmes

### Port déjà utilisé

```bash
# Changer le port dans vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Backend ne démarre pas

```bash
# Vérifier que Deno est installé
deno --version

# Vérifier que le token est défini
echo $REPLICATE_API_TOKEN
```

### Images ne s'uploadent pas

- Vérifiez la taille (max 10MB)
- Vérifiez le format (JPEG, PNG, WebP)
- Regardez la console du navigateur pour les erreurs

## Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Vérifier le code
npm run type-check   # Vérifier les types TypeScript
```

## Structure des Fichiers

```
france-canape-visualizer/
├── src/                    # Code source
│   ├── components/        # Composants React
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitaires
│   ├── pages/            # Pages
│   └── types/            # Types TypeScript
├── functions/             # Backend Deno
├── public/               # Assets statiques
├── scripts/              # Scripts utilitaires
└── ...                   # Config files
```

## Prochaines Étapes

1. **Personnaliser** : Modifiez les couleurs dans `tailwind.config.js`
2. **Déployer** : Suivez `DEPLOYMENT.md` pour mettre en production
3. **Contribuer** : Lisez `CONTRIBUTING.md` pour participer

## Ressources

- [Documentation complète](./README.md)
- [Guide de déploiement](./DEPLOYMENT.md)
- [Documentation technique](./TECHNICAL.md)
- [Exemples d'utilisation](./EXAMPLES.md)

## Support

- GitHub Issues : Bugs et questions
- Discord : Communauté
- Email : support@france-canape.fr

---

**Bon développement ! 🚀**
