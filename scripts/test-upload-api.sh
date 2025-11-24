#!/bin/bash

echo "🧪 Test de l'API Upload"
echo "======================="
echo ""

# Image de test 1x1 pixel rouge en base64
TEST_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

# Vérifier si un argument URL est fourni
if [ -z "$1" ]; then
    URL="http://localhost:5173"
    echo "⚠️  Aucune URL fournie, utilisation de: $URL"
    echo "   Usage: ./test-upload-api.sh https://votre-app.vercel.app"
else
    URL="$1"
    echo "🌐 Test sur: $URL"
fi

echo ""
echo "📤 Test 1: Vérification du token..."
TOKEN_RESPONSE=$(curl -s "$URL/api/token")
echo "Réponse: $TOKEN_RESPONSE"

if echo "$TOKEN_RESPONSE" | grep -q '"configured":true'; then
    echo "✅ Token configuré"
else
    echo "❌ Token non configuré"
    exit 1
fi

echo ""
echo "📤 Test 2: Upload d'une image test..."
UPLOAD_RESPONSE=$(curl -s -X POST "$URL/api/upload" \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"$TEST_IMAGE\",\"filename\":\"test.png\"}")

echo "Réponse: $UPLOAD_RESPONSE"

if echo "$UPLOAD_RESPONSE" | grep -q '"uploaded":true'; then
    echo "✅ Upload réussi"
    
    # Extraire l'URL
    URL_REPLICATE=$(echo "$UPLOAD_RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    echo "📍 URL Replicate: $URL_REPLICATE"
    
    if [[ $URL_REPLICATE == https://replicate.delivery/* ]]; then
        echo "✅ URL Replicate valide"
    else
        echo "⚠️  URL Replicate inattendue"
    fi
else
    echo "❌ Upload échoué"
    exit 1
fi

echo ""
echo "🎉 Tous les tests passent !"
