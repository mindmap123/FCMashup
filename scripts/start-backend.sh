#!/bin/bash

# Script de démarrage du backend Deno
# Usage: ./scripts/start-backend.sh

echo "🦕 Démarrage du backend Deno..."

# Vérifier si Deno est installé
if ! command -v deno &> /dev/null; then
    echo "❌ Deno n'est pas installé"
    echo "📥 Installez Deno: https://deno.land/manual/getting_started/installation"
    exit 1
fi

# Charger les variables d'environnement depuis .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Variables d'environnement chargées depuis .env"
fi

# Vérifier si REPLICATE_API_TOKEN est défini
if [ -z "$REPLICATE_API_TOKEN" ]; then
    echo "❌ REPLICATE_API_TOKEN n'est pas défini dans .env"
    echo "💡 Ajoutez REPLICATE_API_TOKEN=votre_token dans le fichier .env"
    exit 1
fi

# Démarrer le serveur Deno
cd functions
deno run --allow-net --allow-env --watch server.ts
