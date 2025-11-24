#!/bin/bash

# Script de démarrage rapide pour le développement
# Usage: ./scripts/start-dev.sh

echo "🚀 Démarrage de France Canapé en mode développement..."

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  N'oubliez pas de configurer VITE_BACKEND_URL dans .env"
fi

# Démarrer le serveur de développement
echo "🎨 Lancement du serveur frontend..."
npm run dev
