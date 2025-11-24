#!/bin/bash

# Script de test pour vérifier que l'upload backend fonctionne

echo "🧪 Test du système d'upload backend"
echo ""

# Vérifier que le serveur dev tourne
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ Le serveur dev ne tourne pas. Lancez 'npm run dev' d'abord."
    exit 1
fi

echo "✅ Serveur dev détecté"
echo ""

# Créer une petite image de test en base64 (1x1 pixel rouge)
TEST_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

echo "📤 Test de l'endpoint /api/upload..."
RESPONSE=$(curl -s -X POST http://localhost:5173/api/upload \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"$TEST_IMAGE\",\"filename\":\"test.png\"}")

echo "Réponse: $RESPONSE"
echo ""

# Vérifier si la réponse contient "uploaded"
if echo "$RESPONSE" | grep -q "uploaded"; then
    echo "✅ Upload backend fonctionne !"
else
    echo "❌ Erreur lors de l'upload"
    exit 1
fi

echo ""
echo "🎉 Tous les tests passent !"
