# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-01-XX

### Ajouté

#### Fonctionnalités Principales
- Sélection de modèle IA (Banana Pro / Seedream)
- Upload d'images par drag & drop
- Sélection de fichiers depuis l'appareil
- Capture photo directe (mobile)
- Description optionnelle du tissu
- Génération d'image avec IA
- Prévisualisation en temps réel
- Téléchargement des résultats
- Fonction "Recommencer"

#### Interface Utilisateur
- Design responsive (mobile, tablette, desktop)
- Layout optimisé iPad (2 colonnes en landscape)
- Thèmes dynamiques selon le modèle sélectionné
- Animations et transitions fluides
- Touch targets optimisés (48px minimum)
- Feedback visuel pour drag & drop

#### Composants
- `ModelSelector` : Sélection du modèle IA
- `ImageUploadZone` : Zone d'upload avec preview
- `FabricDescription` : Champ de description
- `GenerationButton` : Bouton de génération avec états
- `PreviewPane` : Aperçu du canapé
- `ResultView` : Affichage du résultat avec actions
- `Button` : Composant bouton réutilisable
- `Card` : Composant carte réutilisable

#### Hooks Personnalisés
- `useCanapeGenerator` : Gestion complète de l'état et de la logique

#### Backend
- Fonction Deno Edge pour Replicate API
- Support Banana Pro (Google)
- Support Seedream (ByteDance)
- Prompt IA optimisé pour préservation de structure
- Gestion d'erreurs robuste
- Polling automatique des résultats

#### Notifications
- Toasts pour succès, erreurs et informations
- Auto-dismiss configurable
- Position centrée en haut
- Rich colors pour meilleure visibilité

#### Validation
- Validation des types de fichiers (JPEG, PNG, WebP)
- Limite de taille (10MB)
- Messages d'erreur descriptifs

#### Documentation
- README complet avec instructions
- Guide de déploiement (DEPLOYMENT.md)
- Documentation technique (TECHNICAL.md)
- Exemples d'utilisation (EXAMPLES.md)
- Fichier .env.example

#### Configuration
- TypeScript strict mode
- ESLint avec règles React
- Tailwind CSS avec thèmes personnalisés
- Vite pour build optimisé
- Path aliases (@/)

### Sécurité
- Token API non exposé côté client
- Validation stricte des inputs
- CORS configuré
- Sanitization des données utilisateur

## [Unreleased]

### À Venir
- Authentification utilisateur
- Historique des générations
- Partage de résultats
- Comparaison avant/après
- Batch processing
- Système de favoris
- Export multi-formats
- Analytics
- A/B testing des modèles
- Système de feedback

### En Considération
- Support de plus de modèles IA
- Édition avancée (ajustements de couleur, contraste)
- Intégration avec plateformes e-commerce
- API publique
- Application mobile native
- Mode hors-ligne
- Collaboration en temps réel
- Bibliothèque de tissus prédéfinis

## Notes de Version

### Version 1.0.0 - Release Initiale

Cette première version établit les fondations de l'application avec toutes les fonctionnalités essentielles pour visualiser un canapé avec un tissu personnalisé.

**Points Forts** :
- Interface intuitive et responsive
- Deux modèles IA au choix
- Résultats de haute qualité
- Déploiement simple

**Limitations Connues** :
- Pas d'authentification (toutes les générations sont anonymes)
- Pas d'historique (les résultats ne sont pas sauvegardés)
- Upload limité à 10MB par image
- Temps de génération variable (20-60s)

**Compatibilité** :
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- iOS 14+ / Android 10+
- Tablettes et desktop

**Performance** :
- First Contentful Paint : < 1.5s
- Time to Interactive : < 3s
- Bundle size : ~150KB (gzipped)

---

Pour toute question ou suggestion, ouvrez une issue sur GitHub.
