# Checklist de Vérification Vercel

## ✅ Étapes Complétées

### 1. Code Push

- [x] Commit créé avec message détaillé
- [x] Push vers GitHub réussi
- [x] Vercel va détecter automatiquement le push

### 2. Configuration Vercel

Vérifiez dans le dashboard Vercel:

#### Variables d'Environnement

```
Settings → Environment Variables
```

- [ ] `REPLICATE_API_TOKEN` est configuré
- [ ] Valeur: `r8_***` (votre token Replicate depuis .env)
- [ ] Scope: Production, Preview, Development

#### Build Settings

```
Settings → General
```

- [x] Framework Preset: Vite
- [x] Build Command: `npm run build`
- [x] Output Directory: `dist`
- [x] Install Command: `npm install`

### 3. Déploiement

Attendez que Vercel déploie (2-3 minutes):

```
Deployments → Latest Deployment
```

#### Vérifications Post-Déploiement

1. **Fonctions Serverless Détectées**

   ```
   Functions → Check for:
   - /api/upload
   - /api/generate
   ```

2. **Logs de Build**

   ```
   Cherchez:
   ✓ Built in XXs
   ✓ Serverless Functions detected
   ```

3. **Test Upload**

   - [ ] Ouvrir l'app en production
   - [ ] Uploader une image de canapé
   - [ ] Uploader une image de tissu
   - [ ] Vérifier les logs dans Function Logs

4. **Logs Runtime**

   ```
   Functions → /api/upload → Logs

   Cherchez:
   📤 Upload vers backend...
   📤 Upload vers Replicate...
   ✅ Upload vers Replicate OK
   ```

### 4. Test Complet

#### Test Frontend

```bash
# Ouvrir l'app en production
https://votre-app.vercel.app

# Workflow complet:
1. Sélectionner un modèle (Banana Pro ou Seedream)
2. Uploader image canapé (drag & drop ou sélection)
3. Uploader image tissu
4. (Optionnel) Ajouter description
5. Cliquer "Générer"
6. Attendre la génération (30-60s)
7. Vérifier l'image générée
8. Télécharger le résultat
```

#### Test API Direct

```bash
# Test /api/upload
curl -X POST https://votre-app.vercel.app/api/upload \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==","filename":"test.png"}'

# Réponse attendue:
# {"uploaded":true,"url":"https://replicate.delivery/...","id":"..."}
```

### 5. Troubleshooting

#### Erreur: "REPLICATE_API_TOKEN not configured"

→ Ajouter la variable d'environnement dans Vercel Dashboard

#### Erreur: "Failed to upload to Replicate"

→ Vérifier que le token est valide
→ Vérifier les logs Replicate: https://replicate.com/account/api-tokens

#### Erreur: "Invalid URLs provided"

→ Vérifier que les images sont bien uploadées avant génération
→ Les URLs doivent commencer par `https://replicate.delivery/`

#### Erreur CORS

→ Vérifier que les headers CORS sont présents dans les réponses
→ Ouvrir DevTools → Network → Vérifier les headers

## 📊 Métriques à Surveiller

### Performance

- Upload time: < 5s
- Generation time: 30-60s
- Total workflow: < 90s

### Logs

- Pas d'erreurs 500
- Pas d'erreurs CORS
- Tous les uploads réussissent

### Coûts Replicate

- Vérifier l'usage: https://replicate.com/account/billing
- Chaque génération coûte ~$0.01-0.05

## 🎉 Succès !

Si tous les tests passent:

- ✅ Backend upload fonctionne
- ✅ CORS résolu
- ✅ Token sécurisé
- ✅ Génération opérationnelle
- ✅ Prêt pour production !
