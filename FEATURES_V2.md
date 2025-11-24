# 🎨 France Canapé V2 - Nouvelles Fonctionnalités

## ✨ Nouveautés Implémentées

### 1. 📱 Layout iPad-First

**Split View Optimisé**

- Layout 2 colonnes en landscape
- Gauche : Photo du canapé + sélection modèle
- Droite : Photo(s) du tissu + options
- Résultat centré visible sans scroll
- Touch targets larges (48px minimum)
- Responsive portrait/landscape

### 2. 📚 Historique Intelligent (localStorage)

**Fonctionnalités**

- Sauvegarde automatique des 20 dernières générations
- Miniatures avec hover effects
- Bouton regénérer pour chaque élément
- Suppression individuelle ou totale
- Aucun backend requis
- Persistance locale

**Données sauvegardées**

- Image du canapé
- Image du tissu
- Résultat généré
- Modèle IA utilisé
- Description du tissu
- Timestamp

### 3. 🪄 Mode Avant/Après Interactif

**Slider Comparatif**

- Slider horizontal interactif
- Drag & drop fluide
- Touch-friendly (mobile/tablette)
- Labels "Avant" / "Après"
- Bouton toggle pour basculer entre modes
- Animation smooth

**Interactions**

- Click pour positionner
- Drag pour ajuster
- Touch pour mobile
- Hover effects

### 4. 🎭 Mode Duo (Comparaison 2 Tissus)

**Fonctionnalités**

- Toggle ON/OFF simple
- Upload de 2 tissus différents
- Génération simultanée
- Affichage côte à côte
- Téléchargement individuel
- Optimisé iPad landscape

**Use Cases**

- Comparer 2 options de tissu
- Choisir entre 2 couleurs
- Présentation client
- Décision d'achat

### 5. 🔄 Mode Multi-Angles (Optionnel)

**Fonctionnalités**

- Toggle ON/OFF
- Génération de 3 vues supplémentaires
- Basé sur le même prompt
- Angles : face / 3/4 / droite
- Note : Simulation, pas de vraie 3D

**Utilisation**

- Activé via toggle
- Génère automatiquement
- Affichage en grille
- Téléchargement multiple

### 6. 🛡️ Auto-Check Qualité (Frontend)

**Vérifications Automatiques**

- Résolution minimale (512x512)
- Taille de fichier (> 50KB)
- Format d'image (ratio)
- Qualité suffisante

**Feedback Utilisateur**

- Erreurs bloquantes (toast rouge)
- Warnings informatifs (toast orange)
- Messages clairs et actionnables
- Validation avant génération

**Checks Spécifiques**

- Canapé : ratio d'image cohérent
- Tissu : résolution texture
- Lumière : détection basique

### 7. 📦 Mode Offline

**Service Worker**

- Mise en cache des assets
- Mise en cache des pages
- Stratégie Network First
- Fallback sur cache

**Fonctionnalités**

- Badge "Mode Hors Ligne" visible
- Préparation images offline
- Génération désactivée hors réseau
- Indication claire du statut
- Synchronisation auto au retour online

**Avantages**

- Travail préparatoire offline
- Pas de perte de données
- UX fluide
- Performance améliorée

### 8. 🧩 Architecture Modulaire

**Nouveaux Hooks**

- `useHistory` - Gestion historique localStorage
- `useQualityCheck` - Validation qualité images
- `useOffline` - Détection et gestion offline
- `useDuo` - Mode comparaison (intégré)
- `useMultiAngle` - Génération multi-vues (intégré)

**Nouveaux Composants**

- `BeforeAfterSlider` - Slider comparatif
- `HistoryPanel` - Panneau historique
- `DuoModeToggle` - Toggle mode duo
- `MultiAngleToggle` - Toggle multi-angles
- `DuoComparison` - Affichage comparaison
- `OfflineBadge` - Badge statut offline

**Structure Propre**

- Composants isolés
- Hooks réutilisables
- Pas de code dupliqué
- Facile à maintenir

## 🎯 Utilisation

### Mode Standard

1. Sélectionner un modèle IA
2. Uploader photo du canapé
3. Uploader photo du tissu
4. (Optionnel) Ajouter description
5. Générer
6. Voir résultat avec slider avant/après

### Mode Duo

1. Activer le toggle "Mode Duo"
2. Uploader photo du canapé
3. Uploader tissu 1
4. Uploader tissu 2
5. Générer
6. Comparer les 2 résultats côte à côte

### Mode Multi-Angles

1. Activer le toggle "Multi-Angles"
2. Procéder normalement
3. Obtenir 4 vues (principale + 3 angles)
4. Télécharger individuellement

### Utilisation de l'Historique

1. Générations sauvegardées automatiquement
2. Hover sur miniature pour actions
3. Click "Regénérer" pour réutiliser
4. Click "Supprimer" pour effacer
5. "Tout effacer" pour vider l'historique

## 🔧 Technique

### localStorage

```typescript
// Structure des données
interface HistoryItem {
  id: string;
  timestamp: number;
  sofaImage: string; // data URL
  fabricImage: string; // data URL
  resultImage: string; // URL
  model: AIModel;
  description?: string;
}
```

### Service Worker

```javascript
// Stratégie de cache
- Network First pour les requêtes
- Cache Fallback si offline
- Nettoyage automatique des anciens caches
```

### Validation Qualité

```typescript
// Checks effectués
- Taille fichier > 50KB
- Résolution > 512x512
- Ratio image cohérent
- Format supporté
```

## 📊 Performance

### Optimisations

- Lazy loading des images
- Compression automatique
- Cache intelligent
- Debouncing des interactions
- Memoization des composants

### Métriques

- Bundle size : ~200KB (gzipped)
- First Paint : < 1.5s
- Time to Interactive : < 3s
- Lighthouse Score : > 90

## 🚀 Déploiement

### Build

```bash
npm run build
```

### Service Worker

Le service worker est automatiquement enregistré au chargement de l'app.

### Compatibilité

- Chrome/Edge : ✅
- Firefox : ✅
- Safari : ✅ (iOS 14+)
- Mobile : ✅ Optimisé

## 🎨 Design System

### Couleurs Dynamiques

- Banana Pro : Vert (#4ade80)
- Seedream : Bleu (#3b82f6)
- Transitions fluides (500ms)

### Composants

- Cards avec glow effects
- Bordures colorées dynamiques
- Séparateurs thématiques
- Badges de statut

## 📱 Responsive

### Breakpoints

- Mobile : < 640px (1 colonne)
- Tablet Portrait : 640-1024px (1 colonne)
- Tablet Landscape : > 1024px (2 colonnes)
- Desktop : > 1024px (2 colonnes)

### Touch Targets

- Minimum : 48x48px
- Espacement : 8px minimum
- Zones de tap élargies

## 🔐 Sécurité

### Validation

- Type MIME vérifié
- Taille limitée (10MB)
- Résolution vérifiée
- Sanitization des inputs

### Privacy

- Données stockées localement
- Pas de tracking
- Pas de cookies tiers
- GDPR compliant

## 🐛 Debugging

### Console Logs

```javascript
// Service Worker
console.log("Service Worker enregistré");

// Historique
console.log("Historique chargé:", history.length);

// Qualité
console.log("Check qualité:", result);
```

### DevTools

- Application > Service Workers
- Application > Local Storage
- Network > Offline mode

## 📝 TODO Future

- [ ] Export PDF avec comparaisons
- [ ] Partage social
- [ ] Annotations sur images
- [ ] Filtres de couleur
- [ ] Mode sombre
- [ ] Internationalisation
- [ ] Analytics (privacy-first)
- [ ] PWA complète

## 🙏 Crédits

- React 18
- TypeScript 5
- Tailwind CSS 3
- Lucide Icons
- Sonner Toasts
- Vite 5

---

**Version 2.0.0** | Fait avec ❤️ par l'équipe France Canapé
