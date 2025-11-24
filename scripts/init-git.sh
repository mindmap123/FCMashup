#!/bin/bash

echo "🔧 Initialisation de Git pour France Canapé Visualizer"

# Vérifier si Git est déjà initialisé
if [ -d .git ]; then
    echo "✅ Git est déjà initialisé"
else
    echo "📦 Initialisation de Git..."
    git init
    echo "✅ Git initialisé"
fi

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Créer le commit initial
echo "💾 Création du commit initial..."
git commit -m "Initial commit - France Canapé Visualizer

- Frontend React + Vite + TypeScript
- Backend Deno (dev local)
- API Vercel Serverless Functions (production)
- Génération IA avec Replicate (Banana Pro & Seedream)
- Mode Duo pour comparer 2 tissus
- Historique des générations
- UI Premium avec gradients adaptatifs"

echo ""
echo "✅ Git initialisé avec succès !"
echo ""
echo "📌 Prochaines étapes :"
echo "1. Créer un repo sur GitHub"
echo "2. Ajouter l'origine :"
echo "   git remote add origin https://github.com/<USERNAME>/<REPO>.git"
echo "3. Pousser le code :"
echo "   git branch -M main"
echo "   git push -u origin main"
echo "4. Déployer sur Vercel (voir VERCEL_DEPLOYMENT.md)"
