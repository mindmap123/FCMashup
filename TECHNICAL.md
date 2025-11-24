# Documentation Technique

## Architecture

### Frontend (React + TypeScript)

```
src/
├── components/          # Composants React réutilisables
│   ├── ui/             # Composants UI de base (Button, Card)
│   ├── ModelSelector.tsx
│   ├── ImageUploadZone.tsx
│   ├── FabricDescription.tsx
│   ├── GenerationButton.tsx
│   ├── PreviewPane.tsx
│   └── ResultView.tsx
├── hooks/              # Custom React hooks
│   └── useCanapeGenerator.ts
├── lib/                # Utilitaires et helpers
│   ├── constants.ts    # Constantes de configuration
│   ├── validators.ts   # Validation des fichiers
│   ├── replicate.ts    # Client API Replicate
│   └── utils.ts        # Utilitaires généraux
├── pages/              # Pages de l'application
│   └── FranceCanape.tsx
├── types/              # Définitions TypeScript
│   └── index.ts
├── App.tsx             # Composant racine
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

### Backend (Deno)

```
functions/
└── generateCanapeWithReplicate.ts  # Edge function Deno
```

## Flux de Données

### 1. Sélection du Modèle

```
User Click → selectModel() → Update State → Toast Notification
```

### 2. Upload d'Image

```
File Drop/Select → validateImageFile() → createImagePreview() → Update State → Toast
```

### 3. Génération

```
User Click → generate()
  ↓
Validate Inputs
  ↓
Set Loading State
  ↓
Call Backend API (generateCanapeWithReplicate)
  ↓
Backend: Upload to Replicate
  ↓
Backend: Poll for Completion
  ↓
Backend: Return Image URL
  ↓
Update State with Result
  ↓
Toast Success
```

## Composants Clés

### useCanapeGenerator Hook

Hook personnalisé qui encapsule toute la logique métier :
- Gestion de l'état de l'application
- Validation des fichiers
- Appels API
- Gestion des erreurs
- Notifications

**Avantages** :
- Séparation des préoccupations
- Réutilisabilité
- Testabilité
- Code plus propre dans les composants

### ModelSelector

Affiche deux boutons pour sélectionner le modèle IA.

**Props** :
- `selectedModel`: Modèle actuellement sélectionné
- `onSelectModel`: Callback de sélection
- `disabled`: État désactivé

**Thèmes** :
- Banana Pro : Vert (#4ade80)
- Seedream : Bleu (#3b82f6)

### ImageUploadZone

Zone d'upload avec drag & drop, sélection fichier et capture caméra.

**Features** :
- Drag & drop avec feedback visuel
- Sélection fichier classique
- Capture caméra (mobile uniquement)
- Preview de l'image uploadée
- Bouton de suppression

**Validation** :
- Types acceptés : JPEG, PNG, WebP
- Taille max : 10MB

### GenerationButton

Bouton de génération avec états de chargement.

**États** :
- Désactivé si inputs incomplets
- Loading avec spinner pendant génération
- Couleur dynamique selon modèle sélectionné

## API Backend

### Endpoint : POST /api/generate

**Request Body** :
```typescript
{
  imageSofaUrl: string      // URL de l'image du canapé
  imageFabricUrl: string    // URL de l'image du tissu
  fabricDescription?: string // Description optionnelle
  model: 'banana' | 'seedream' // Modèle IA
}
```

**Response** :
```typescript
{
  imageUrl: string  // URL de l'image générée
}
```

**Erreurs** :
- 400 : Champs manquants ou invalides
- 500 : Erreur Replicate ou serveur

## Configuration Replicate

### Banana Pro (Google)

```typescript
{
  model: 'google/nano-banana-pro',
  resolution: '2K',
  aspect_ratio: 'match_input_image',
  output_format: 'png',
  safety_filter_level: 'block_only_high'
}
```

### Seedream (ByteDance)

```typescript
{
  model: 'bytedance/seedream-4',
  size: '2K',
  aspect_ratio: 'match_input_image',
  max_images: 1
}
```

## Prompt IA

Le prompt est conçu pour :

1. **Préserver la géométrie** : Aucune modification de forme, proportions, structure
2. **Transférer uniquement la texture** : Couleur, tissage, grain, reflets
3. **Maintenir les détails** : Plis, coutures, ombres, éclairage
4. **Résultat photographique** : Pas de rendu CGI ou textures artificielles

Le prompt complet est dans `src/lib/constants.ts`.

## Responsive Design

### Breakpoints Tailwind

- `sm`: 640px (mobile large)
- `md`: 768px (tablette portrait)
- `lg`: 1024px (tablette landscape / desktop)

### Layout

- **Mobile** : Colonne unique, scroll vertical
- **Tablette Portrait** : Colonne unique optimisée
- **Tablette Landscape / Desktop** : 2 colonnes (Actions | Preview)

### Touch Targets

Tous les éléments interactifs ont une taille minimale de 48x48px (classe `touch-target`).

## Gestion d'État

### AppState Interface

```typescript
interface AppState {
  selectedModel: AIModel | null
  sofaImage: UploadedImage | null
  fabricImage: UploadedImage | null
  fabricDescription: string
  generatedImageUrl: string | null
  isGenerating: boolean
}
```

### Flux d'État

```
Initial State → User Actions → State Updates → UI Re-render
```

## Notifications (Sonner)

Types de notifications :
- **Success** : Upload réussi, génération terminée
- **Error** : Validation échouée, erreur API
- **Info** : Génération en cours, session redémarrée

Configuration : Position `top-center`, auto-dismiss, rich colors.

## Performance

### Optimisations

1. **Lazy Loading** : Images chargées à la demande
2. **Debouncing** : Description du tissu (si nécessaire)
3. **Memoization** : Composants React.memo pour éviter re-renders
4. **Code Splitting** : Vite gère automatiquement

### Métriques Cibles

- First Contentful Paint : < 1.5s
- Time to Interactive : < 3s
- Lighthouse Score : > 90

## Sécurité

### Frontend

- Validation stricte des types de fichiers
- Limite de taille de fichier (10MB)
- Sanitization des inputs utilisateur
- Pas de token API exposé

### Backend

- Validation des inputs
- Rate limiting (à implémenter)
- CORS configuré
- Token API en variable d'environnement

## Tests (À Implémenter)

### Tests Unitaires

- Validation de fichiers
- Utilitaires (cn, downloadImage)
- Hooks personnalisés

### Tests d'Intégration

- Flux complet d'upload
- Génération avec mock API
- Gestion d'erreurs

### Tests E2E

- Parcours utilisateur complet
- Responsive sur différents devices
- Accessibilité

## Accessibilité

- Labels ARIA sur tous les contrôles
- Navigation clavier complète
- Contraste de couleurs WCAG AA
- Focus visible sur tous les éléments interactifs
- Messages d'erreur descriptifs

## Améliorations Futures

1. **Authentification** : Login utilisateur
2. **Historique** : Sauvegarder les générations
3. **Partage** : Partager les résultats
4. **Comparaison** : Avant/après côte à côte
5. **Batch Processing** : Plusieurs tissus sur un canapé
6. **Favoris** : Sauvegarder des tissus préférés
7. **Export** : Différents formats et résolutions
8. **Analytics** : Tracking des utilisations
9. **A/B Testing** : Comparer les modèles IA
10. **Feedback** : Système de notation des résultats

## Dépendances Principales

### Production

- `react` : Framework UI
- `react-dom` : Rendu React
- `lucide-react` : Icônes
- `sonner` : Notifications toast
- `clsx` + `tailwind-merge` : Gestion des classes CSS

### Développement

- `vite` : Build tool
- `typescript` : Typage statique
- `tailwindcss` : Framework CSS
- `eslint` : Linting

## Variables d'Environnement

### Frontend

- `VITE_BACKEND_URL` : URL du backend API

### Backend

- `REPLICATE_API_TOKEN` : Token d'authentification Replicate

## Logs et Debugging

### Frontend

```typescript
// Activer les logs détaillés
localStorage.setItem('debug', 'true')
```

### Backend

Les logs sont automatiquement capturés par la plateforme de déploiement (Supabase, Deno Deploy, etc.).

## Support Navigateurs

- Chrome/Edge : Dernières 2 versions
- Firefox : Dernières 2 versions
- Safari : Dernières 2 versions
- Mobile Safari : iOS 14+
- Chrome Mobile : Android 10+

## Licence

MIT - Voir LICENSE file
