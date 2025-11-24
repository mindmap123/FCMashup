# Guide de Contribution

Merci de votre intérêt pour contribuer à France Canapé ! Ce document vous guidera à travers le processus.

## Code de Conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :
- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Faites preuve d'empathie envers les autres membres

## Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/your-repo/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Screenshots si applicable
   - Environnement (navigateur, OS, version)

### Proposer une Fonctionnalité

1. Vérifiez que la fonctionnalité n'est pas déjà proposée
2. Créez une issue avec le template "Feature Request"
3. Décrivez :
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives considérées
   - Impact potentiel

### Soumettre une Pull Request

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créez une branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
4. **Faites vos modifications**
5. **Testez** vos changements
6. **Commit** avec des messages clairs
   ```bash
   git commit -m "feat: ajoute la fonctionnalité X"
   ```
7. **Push** vers votre fork
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
8. **Ouvrez une Pull Request** vers `main`

## Standards de Code

### TypeScript

- Utilisez TypeScript strict mode
- Définissez des types explicites
- Évitez `any` autant que possible
- Documentez les interfaces complexes

```typescript
// ✅ Bon
interface UserData {
  id: string
  name: string
  email: string
}

// ❌ Mauvais
const userData: any = { ... }
```

### React

- Utilisez des composants fonctionnels
- Préférez les hooks aux classes
- Nommez les composants en PascalCase
- Utilisez des props typées

```typescript
// ✅ Bon
interface ButtonProps {
  label: string
  onClick: () => void
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### Styling

- Utilisez Tailwind CSS
- Suivez l'ordre des classes : layout → spacing → colors → typography
- Utilisez `cn()` pour les classes conditionnelles
- Créez des composants réutilisables pour les patterns communs

```typescript
// ✅ Bon
<div className={cn(
  'flex items-center justify-center',
  'p-4 m-2',
  'bg-blue-500 text-white',
  'text-lg font-bold',
  isActive && 'ring-2 ring-blue-700'
)}>
```

### Naming Conventions

- **Fichiers** : PascalCase pour composants, camelCase pour utilitaires
  - `Button.tsx`, `useCanapeGenerator.ts`
- **Variables** : camelCase
  - `const userName = 'John'`
- **Constantes** : UPPER_SNAKE_CASE
  - `const MAX_FILE_SIZE = 10000000`
- **Types/Interfaces** : PascalCase
  - `interface UserProfile { ... }`

### Commits

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, pas de changement de code
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Maintenance

Exemples :
```
feat: ajoute le support de WebP
fix: corrige l'upload sur Safari
docs: met à jour le README
refactor: simplifie le hook useCanapeGenerator
```

## Structure du Projet

```
src/
├── components/     # Composants React
│   ├── ui/        # Composants UI de base
│   └── ...        # Composants métier
├── hooks/         # Custom hooks
├── lib/           # Utilitaires
├── pages/         # Pages
├── types/         # Types TypeScript
└── ...
```

### Où Ajouter du Code

- **Nouveau composant UI** → `src/components/ui/`
- **Nouveau composant métier** → `src/components/`
- **Nouveau hook** → `src/hooks/`
- **Nouvelle fonction utilitaire** → `src/lib/`
- **Nouveaux types** → `src/types/`

## Tests

### Avant de Soumettre

1. **Vérifiez le build**
   ```bash
   npm run build
   ```

2. **Vérifiez le linting**
   ```bash
   npm run lint
   ```

3. **Vérifiez les types**
   ```bash
   npm run type-check
   ```

4. **Testez manuellement**
   - Testez sur différents navigateurs
   - Testez sur mobile/tablette
   - Vérifiez l'accessibilité

### Tests Automatisés (À Venir)

Nous prévoyons d'ajouter :
- Tests unitaires (Vitest)
- Tests de composants (React Testing Library)
- Tests E2E (Playwright)

## Documentation

### Code

- Commentez le code complexe
- Utilisez JSDoc pour les fonctions publiques
- Mettez à jour les types TypeScript

```typescript
/**
 * Valide un fichier image
 * @param file - Le fichier à valider
 * @returns Objet avec valid (boolean) et error optionnel
 */
export function validateImageFile(file: File): ValidationResult {
  // ...
}
```

### README

Si vous ajoutez une fonctionnalité majeure :
- Mettez à jour le README.md
- Ajoutez des exemples d'utilisation
- Mettez à jour TECHNICAL.md si nécessaire

## Processus de Review

1. Un mainteneur reviewera votre PR
2. Des changements peuvent être demandés
3. Une fois approuvée, la PR sera mergée
4. Votre contribution sera créditée dans CHANGELOG.md

### Critères d'Acceptation

- ✅ Code propre et lisible
- ✅ Types TypeScript corrects
- ✅ Pas d'erreurs de linting
- ✅ Build réussi
- ✅ Fonctionnalité testée
- ✅ Documentation à jour
- ✅ Commits bien formatés

## Priorités Actuelles

Nous recherchons particulièrement de l'aide sur :

1. **Tests** : Mise en place de la suite de tests
2. **Accessibilité** : Amélioration WCAG AAA
3. **Performance** : Optimisations
4. **Documentation** : Tutoriels et guides
5. **Internationalisation** : Support multilingue

## Questions ?

- Ouvrez une [Discussion](https://github.com/your-repo/discussions)
- Rejoignez notre [Discord](https://discord.gg/your-server)
- Envoyez un email à dev@france-canape.fr

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

## Remerciements

Merci à tous nos contributeurs ! 🎉

Votre nom apparaîtra ici après votre première contribution.

---

**Bon coding ! 🚀**
