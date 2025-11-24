#!/bin/bash

echo "🚀 Creating Supabase table 'history'"
echo "===================================="
echo ""

# Lire le SQL depuis le fichier
SQL=$(cat supabase-setup.sql)

echo "📝 SQL to execute:"
echo "---"
cat supabase-setup.sql
echo "---"
echo ""

echo "⚠️  IMPORTANT: You need to execute this SQL manually in Supabase Dashboard"
echo ""
echo "📍 Steps:"
echo "   1. Go to: https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp"
echo "   2. Click 'SQL Editor' in the left menu"
echo "   3. Click 'New Query'"
echo "   4. Copy-paste the SQL above"
echo "   5. Click 'Run' (or press Ctrl+Enter)"
echo ""
echo "✅ After running the SQL, test with:"
echo "   node scripts/test-supabase.js"
echo ""

# Ouvrir le dashboard dans le navigateur (macOS)
if command -v open &> /dev/null; then
    echo "🌐 Opening Supabase Dashboard..."
    open "https://supabase.com/dashboard/project/mpshazhcbbmsyeugkzrp/editor"
fi
