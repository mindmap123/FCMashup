#!/bin/bash

echo "🔍 Vérification du Déploiement Vercel"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier le repo Git
echo "📦 Repository Git:"
REPO=$(git remote get-url origin)
echo "   $REPO"
BRANCH=$(git branch --show-current)
echo "   Branche: $BRANCH"
COMMIT=$(git log -1 --format="%h - %s")
echo "   Dernier commit: $COMMIT"
echo ""

# Vérifier les fichiers API
echo "📁 Fichiers API présents:"
if [ -f "api/upload.ts" ]; then
    echo -e "   ${GREEN}✓${NC} api/upload.ts"
else
    echo -e "   ${RED}✗${NC} api/upload.ts MANQUANT"
fi

if [ -f "api/generate.ts" ]; then
    echo -e "   ${GREEN}✓${NC} api/generate.ts"
else
    echo -e "   ${RED}✗${NC} api/generate.ts MANQUANT"
fi

if [ -f "api/token.ts" ]; then
    echo -e "   ${GREEN}✓${NC} api/token.ts"
else
    echo -e "   ${RED}✗${NC} api/token.ts MANQUANT"
fi
echo ""

# Vérifier les fichiers frontend
echo "📁 Fichiers Frontend présents:"
if [ -f "src/lib/uploadToReplicate.ts" ]; then
    echo -e "   ${GREEN}✓${NC} src/lib/uploadToReplicate.ts"
else
    echo -e "   ${RED}✗${NC} src/lib/uploadToReplicate.ts MANQUANT"
fi

if [ -f "src/lib/replicate.ts" ]; then
    echo -e "   ${GREEN}✓${NC} src/lib/replicate.ts"
else
    echo -e "   ${RED}✗${NC} src/lib/replicate.ts MANQUANT"
fi
echo ""

# Vérifier vercel.json
echo "⚙️  Configuration Vercel:"
if [ -f "vercel.json" ]; then
    echo -e "   ${GREEN}✓${NC} vercel.json présent"
    echo "   Contenu:"
    cat vercel.json | grep -A 3 "functions"
else
    echo -e "   ${RED}✗${NC} vercel.json MANQUANT"
fi
echo ""

# Vérifier .env
echo "🔐 Variables d'environnement (.env):"
if [ -f ".env" ]; then
    if grep -q "REPLICATE_API_TOKEN" .env; then
        TOKEN=$(grep "REPLICATE_API_TOKEN" .env | cut -d'=' -f2)
        if [ -n "$TOKEN" ]; then
            echo -e "   ${GREEN}✓${NC} REPLICATE_API_TOKEN configuré (${TOKEN:0:5}...)"
        else
            echo -e "   ${RED}✗${NC} REPLICATE_API_TOKEN vide"
        fi
    else
        echo -e "   ${RED}✗${NC} REPLICATE_API_TOKEN non trouvé"
    fi
else
    echo -e "   ${YELLOW}⚠${NC} .env non trouvé (normal en production)"
fi
echo ""

# Build test
echo "🔨 Test de build:"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} Build réussi"
else
    echo -e "   ${RED}✗${NC} Build échoué"
fi
echo ""

# Type check
echo "📝 Type check TypeScript:"
npm run type-check > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} Aucune erreur TypeScript"
else
    echo -e "   ${RED}✗${NC} Erreurs TypeScript détectées"
fi
echo ""

echo "======================================"
echo "✅ Vérification terminée"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifier le dashboard Vercel"
echo "   2. Confirmer que le repo 'mindmap123/FCMashup' est connecté"
echo "   3. Vérifier que les fonctions serverless sont détectées"
echo "   4. Ajouter REPLICATE_API_TOKEN dans Vercel Environment Variables"
echo "   5. Tester l'upload en production"
echo ""
