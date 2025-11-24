# Backend Deno - FICHIERS CRITIQUES

⚠️ **NE JAMAIS SUPPRIMER CE DOSSIER OU SES FICHIERS**

Ce dossier contient le backend Deno essentiel au fonctionnement de l'application.

## Fichiers obligatoires

- `server.ts` - Serveur HTTP Deno (port 8000)
- `generateCanapeWithReplicate.ts` - Logique de génération IA

## Démarrage

```bash
# Depuis la racine du projet
./scripts/start-backend.sh

# Ou directement
cd functions
deno run --allow-net --allow-env server.ts
```

## Variables d'environnement requises

- `REPLICATE_API_TOKEN` - Token API Replicate (défini dans .env)

## Routes disponibles

- `POST /api/generate` - Génération d'image avec IA
- `GET /health` - Health check

## ⚠️ IMPORTANT

Ces fichiers sont **CRITIQUES** et ne doivent **JAMAIS** être supprimés lors d'un nettoyage automatique.
