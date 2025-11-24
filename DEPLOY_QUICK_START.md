# ⚡ Déploiement Rapide sur Vercel

## 🚀 En 5 minutes

### 1️⃣ Initialiser Git

```bash
./scripts/init-git.sh
```

### 2️⃣ Créer un repo GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. Nom du repo : `france-canape-visualizer`
3. Visibilité : Public ou Private
4. **Ne pas** initialiser avec README, .gitignore ou license
5. Créer le repo

### 3️⃣ Pousser le code

```bash
git remote add origin https://github.com/<USERNAME>/france-canape-visualizer.git
git branch -M main
git push -u origin main
```

### 4️⃣ Déployer sur Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer votre repo GitHub
3. Configuration automatique détectée ✅
4. Ajouter la variable d'environnement :
   ```
   REPLICATE_API_TOKEN=votre_token_replicate_ici
   ```
5. Cliquer sur **Deploy**

### 5️⃣ C'est prêt ! 🎉

Votre app est en ligne sur : `https://votre-projet.vercel.app`

---

## 🔧 Développement local

### Backend Deno (optionnel)

```bash
./scripts/start-backend.sh
```

### Frontend

```bash
npm run dev
```

---

## 📚 Documentation complète

Voir [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) pour plus de détails.
