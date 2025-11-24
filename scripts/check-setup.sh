#!/bin/bash

# Script de vérification de l'installation
# Usage: ./scripts/check-setup.sh

echo "🔍 Vérification de l'installation de France Canapé..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction de vérification
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# Vérifier Node.js
echo "📦 Vérification des dépendances système..."
node --version > /dev/null 2>&1
check "Node.js installé"

npm --version > /dev/null 2>&1
check "npm installé"

# Vérifier les fichiers essentiels
echo ""
echo "📁 Vérification des fichiers..."

[ -f "package.json" ]
check "package.json présent"

[ -f "tsconfig.json" ]
check "tsconfig.json présent"

[ -f "vite.config.ts" ]
check "vite.config.ts présent"

[ -f "tailwind.config.js" ]
check "tailwind.config.js présent"

[ -f "src/main.tsx" ]
check "src/main.tsx présent"

[ -f "src/App.tsx" ]
check "src/App.tsx présent"

[ -f "functions/generateCanapeWithReplicate.ts" ]
check "Backend Deno présent"

# Vérifier node_modules
echo ""
echo "📚 Vérification des dépendances..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installé"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} node_modules manquant (exécutez: npm install)"
    ((FAILED++))
fi

# Vérifier .env
echo ""
echo "⚙️  Vérification de la configuration..."

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env configuré"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} .env manquant (copiez .env.example vers .env)"
    ((FAILED++))
fi

# Vérifier Deno (optionnel)
echo ""
echo "🦕 Vérification de Deno (optionnel)..."

if command -v deno &> /dev/null; then
    echo -e "${GREEN}✓${NC} Deno installé"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Deno non installé (optionnel pour le backend local)"
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Réussis: ${GREEN}${PASSED}${NC}"
echo -e "Échoués: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Tout est prêt !${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "  1. npm run dev          # Lancer le frontend"
    echo "  2. Configurer le backend (voir DEPLOYMENT.md)"
    echo "  3. Tester l'application"
else
    echo -e "${YELLOW}⚠️  Quelques éléments nécessitent votre attention${NC}"
    echo ""
    echo "Actions recommandées:"
    if [ ! -d "node_modules" ]; then
        echo "  • npm install"
    fi
    if [ ! -f ".env" ]; then
        echo "  • cp .env.example .env"
    fi
fi

echo ""
echo "📚 Documentation:"
echo "  • README.md          - Vue d'ensemble"
echo "  • QUICKSTART.md      - Démarrage rapide"
echo "  • DEPLOYMENT.md      - Guide de déploiement"
echo "  • TECHNICAL.md       - Documentation technique"
echo ""
