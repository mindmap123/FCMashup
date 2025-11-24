# 🛋️ France Canapé - Visualiseur IA

> Application web permettant de visualiser un canapé avec un tissu personnalisé via un transfert de matériau réalisé par IA.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)](https://tailwindcss.com/)

## ✨ Fonctionnalités

### 🎨 Interface Utilisateur

- **Sélection de modèle IA** : Banana Pro (Google) ou Seedream (ByteDance)
- **Upload d'images** : Drag & drop, sélection fichier, ou capture photo (mobile)
- **Description optionnelle** : Affinez le résultat avec une description du tissu
- **Prévisualisation** : Aperçu en temps réel du canapé uploadé
- **Téléchargement** : Sauvegardez le résultat généré en haute qualité

### 🤖 Intelligence Artificielle

- **Génération IA** : Transfert de matériau préservant 100% la structure du canapé
- **Deux modèles** : Banana Pro (précision) et Seedream (rapidité)
- **Prompt optimisé** : Garantit la préservation de la géométrie originale

### 📱 Responsive Design

- **Optimisé iPad** : Layout 2 colonnes en landscape
- **Mobile-friendly** : Interface tactile avec capture photo
- **Touch targets** : Minimum 48px pour une utilisation confortable

## 🚀 Démarrage Rapide

```bash
# Cloner le repository
git clone https://github.com/your-repo/france-canape-visualizer.git
cd france-canape-visualizer

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Lancer l'application
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

📖 **Guide complet** : Voir [QUICKSTART.md](./QUICKSTART.md)

## 🧱 Stack Technique

### Frontend

- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite 5
- **Styling** : Tailwind CSS 3.3
- **UI Components** : shadcn/ui (custom)
- **Icons** : lucide-react
- **Notifications** : sonner

### Backend

- **Runtime** : Deno
- **API** : Replicate (Banana Pro / Seedream)
- **Deployment** : Edge Functions (Supabase/Deno Deploy)

## 📂 Structure du Projet

```
france-canape-visualizer/
├── src/
│   ├── components/      # Composants React
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitaires
│   ├── pages/          # Pages
│   └── types/          # Types TypeScript
├── functions/          # Backend Deno
├── public/            # Assets statiques
├── scripts/           # Scripts utilitaires
└── docs/              # Documentation
```

## 🎯 Utilisation

### 1. Sélectionner un Modèle IA

Choisissez entre :

- **Banana Pro** : Meilleure précision, idéal pour tissus complexes
- **Seedream** : Plus rapide, parfait pour tests rapides

### 2. Uploader les Images

- **Photo du canapé** : Vue claire montrant toutes les surfaces
- **Photo du tissu** : Gros plan montrant la texture et les détails

### 3. Générer

Cliquez sur "Générer l'image avec IA" et attendez 20-60 secondes.

### 4. Télécharger

Sauvegardez votre résultat ou recommencez avec un autre tissu.

## 🚢 Déploiement

### Frontend (Vercel - Recommandé)

```bash
npm install -g vercel
vercel
```

### Backend (Supabase Edge Functions)

```bash
supabase functions deploy generate-canape
```

📖 **Guide complet** : Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Documentation

- 📖 [Guide de Démarrage Rapide](./QUICKSTART.md)
- 🚀 [Guide de Déploiement](./DEPLOYMENT.md)
- 🔧 [Documentation Technique](./TECHNICAL.md)
- 💡 [Exemples d'Utilisation](./EXAMPLES.md)
- 🤝 [Guide de Contribution](./CONTRIBUTING.md)
- 📝 [Changelog](./CHANGELOG.md)

## 🎨 Captures d'Écran

### Interface Principale (iPad Landscape)

```
┌─────────────────────────────────────────────────────────┐
│  [Banana Pro] [Seedream]                                │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Upload Canapé    │  │ Prévisualisation │            │
│  └──────────────────┘  └──────────────────┘            │
│  ┌──────────────────┐                                   │
│  │ Upload Tissu     │                                   │
│  └──────────────────┘                                   │
│  [Description...]                                       │
│  [Générer avec IA]                                      │
└─────────────────────────────────────────────────────────┘
```

## 🧪 Tests

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build
npm run build
```

## 🔐 Sécurité

- ✅ Token API non exposé côté client
- ✅ Validation stricte des fichiers (type, taille)
- ✅ CORS configuré
- ✅ Sanitization des inputs

## 📊 Performance

- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Lighthouse Score** : > 90
- **Bundle Size** : ~150KB (gzipped)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Replicate](https://replicate.com/) pour l'API IA
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes

## 📞 Support

- 🐛 **Bugs** : [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 **Email** : support@france-canape.fr

## 🗺️ Roadmap

- [ ] Authentification utilisateur
- [ ] Historique des générations
- [ ] Partage de résultats
- [ ] Comparaison avant/après
- [ ] Batch processing
- [ ] Application mobile
- [ ] API publique

---

**Fait avec ❤️ par l'équipe France Canapé**

[⬆ Retour en haut](#-france-canapé---visualiseur-ia)
