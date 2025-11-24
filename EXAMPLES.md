# Exemples d'Utilisation

## Scénarios d'Usage

### 1. Client Particulier

**Contexte** : Marie veut visualiser son canapé avec un nouveau tissu avant de commander.

**Étapes** :
1. Prend une photo de son canapé actuel avec son iPad
2. Sélectionne le modèle Banana Pro
3. Upload la photo du canapé
4. Upload une photo du tissu qu'elle aime (trouvée en ligne)
5. Ajoute la description : "velours côtelé bleu marine"
6. Génère l'image
7. Télécharge le résultat pour le montrer à son conjoint

### 2. Designer d'Intérieur

**Contexte** : Thomas présente plusieurs options de tissus à un client.

**Étapes** :
1. Upload une photo du canapé du client
2. Génère 5 versions avec différents tissus
3. Compare les résultats côte à côte
4. Envoie les images au client pour validation
5. Le client choisit son préféré

### 3. Magasin de Meubles

**Contexte** : Un magasin veut montrer toutes les options de tissus disponibles.

**Étapes** :
1. Prend des photos professionnelles de chaque modèle de canapé
2. Crée une bibliothèque de photos de tissus
3. Génère des visualisations pour chaque combinaison
4. Utilise les images sur le site web et en magasin

## Exemples de Descriptions de Tissu

### Descriptions Efficaces

✅ **Bon** : "velours côtelé beige avec texture profonde"
- Spécifique sur le type de tissu
- Mentionne la couleur
- Décrit la texture

✅ **Bon** : "lin naturel écru légèrement texturé"
- Type de matériau clair
- Couleur précise
- Détail de texture

✅ **Bon** : "cuir vieilli marron foncé avec patine"
- Matériau et finition
- Couleur détaillée
- Caractéristique visuelle

### Descriptions à Éviter

❌ **Mauvais** : "joli tissu"
- Trop vague
- Pas d'information utile

❌ **Mauvais** : "comme celui de ma grand-mère"
- Référence personnelle non universelle

❌ **Mauvais** : "moderne et élégant"
- Subjectif
- Pas de détails techniques

## Conseils pour de Meilleurs Résultats

### Photos du Canapé

1. **Éclairage** : Lumière naturelle uniforme, éviter les ombres dures
2. **Angle** : Vue de face ou 3/4, montrer toute la surface
3. **Arrière-plan** : Simple et neutre si possible
4. **Résolution** : Minimum 1024x768, idéalement 2K+
5. **Focus** : Net, pas de flou

### Photos du Tissu

1. **Gros plan** : Montrer clairement la texture et le tissage
2. **Éclairage** : Uniforme pour voir les vraies couleurs
3. **Angle** : Perpendiculaire au tissu
4. **Échelle** : Assez proche pour voir les détails
5. **Représentatif** : Partie typique du tissu, pas un défaut

### Choix du Modèle

**Banana Pro** :
- ✅ Meilleur pour : Tissus complexes, textures détaillées
- ✅ Points forts : Précision, respect des détails
- ⏱️ Temps : ~30-60 secondes

**Seedream** :
- ✅ Meilleur pour : Résultats rapides, tissus simples
- ✅ Points forts : Vitesse, bon rendu général
- ⏱️ Temps : ~20-40 secondes

## Cas d'Usage Avancés

### Batch Processing (Futur)

```typescript
// Générer plusieurs variantes
const fabrics = ['velours-bleu', 'lin-beige', 'cuir-marron']
const results = await Promise.all(
  fabrics.map(fabric => generateCanape({
    sofaImage,
    fabricImage: getFabricImage(fabric),
    model: 'banana'
  }))
)
```

### Comparaison A/B

```typescript
// Comparer les deux modèles
const [bananaResult, seedreamResult] = await Promise.all([
  generateCanape({ ...params, model: 'banana' }),
  generateCanape({ ...params, model: 'seedream' })
])
```

### Intégration E-commerce

```typescript
// Générer automatiquement pour le catalogue
async function generateProductVariants(productId: string) {
  const sofa = await getProductImage(productId)
  const fabrics = await getAvailableFabrics()
  
  for (const fabric of fabrics) {
    const result = await generateCanape({
      sofaImage: sofa,
      fabricImage: fabric.image,
      fabricDescription: fabric.description,
      model: 'banana'
    })
    
    await saveProductVariant(productId, fabric.id, result.imageUrl)
  }
}
```

## Résolution de Problèmes

### Problème : Le tissu ne s'applique pas correctement

**Solutions** :
1. Vérifier que la photo du canapé montre bien les surfaces rembourrées
2. S'assurer que la photo du tissu est nette et bien éclairée
3. Essayer l'autre modèle IA
4. Ajouter une description plus détaillée du tissu

### Problème : Les couleurs ne correspondent pas

**Solutions** :
1. Vérifier l'éclairage de la photo du tissu
2. Ajouter la couleur exacte dans la description
3. Utiliser une photo du tissu avec un éclairage neutre

### Problème : La structure du canapé change

**Solutions** :
1. Utiliser une photo du canapé plus nette
2. Essayer Banana Pro qui préserve mieux la structure
3. Vérifier que la photo du canapé est bien cadrée

### Problème : Génération trop lente

**Solutions** :
1. Essayer Seedream qui est plus rapide
2. Réduire la résolution des images uploadées
3. Vérifier la connexion internet

## Exemples de Résultats

### Avant / Après

**Canapé Original** : Tissu gris uni
**Nouveau Tissu** : Velours côtelé vert émeraude
**Résultat** : Canapé avec texture velours visible, couleur verte profonde, structure identique

**Canapé Original** : Cuir noir
**Nouveau Tissu** : Lin beige naturel
**Résultat** : Transformation complète du look, texture lin visible, teinte beige chaude

**Canapé Original** : Tissu à motifs
**Nouveau Tissu** : Velours uni bleu nuit
**Résultat** : Surface lisse et uniforme, couleur riche, même forme

## Intégration avec d'Autres Outils

### Figma / Design Tools

1. Exporter les résultats en PNG haute résolution
2. Importer dans Figma pour créer des planches d'ambiance
3. Combiner avec d'autres éléments de décoration

### Réseaux Sociaux

1. Générer l'image
2. Télécharger en haute qualité
3. Partager sur Instagram, Pinterest, etc.
4. Utiliser pour du contenu marketing

### CRM / ERP

1. Intégrer l'API dans votre système
2. Générer automatiquement lors de la création de devis
3. Joindre les visualisations aux propositions clients

## Métriques de Succès

### Qualité du Résultat

- ✅ Structure du canapé préservée à 100%
- ✅ Texture du tissu clairement visible
- ✅ Couleurs fidèles à l'échantillon
- ✅ Éclairage cohérent
- ✅ Aspect photographique réaliste

### Performance

- ⏱️ Temps de génération : 20-60 secondes
- 📊 Taux de succès : > 95%
- 🎯 Satisfaction utilisateur : > 4.5/5

## Support et Communauté

Pour partager vos résultats ou obtenir de l'aide :
- GitHub Issues : Bugs et feature requests
- Discord : Communauté et support
- Email : support@france-canape.fr

## Licence d'Utilisation des Images

Les images générées vous appartiennent et peuvent être utilisées :
- ✅ Usage commercial
- ✅ Marketing et publicité
- ✅ Présentations clients
- ✅ Site web et réseaux sociaux

Crédits appréciés mais non obligatoires : "Généré avec France Canapé"
