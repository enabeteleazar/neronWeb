# Néron Console

Interface unifiée plein écran pour NéronOS.

## Objectif

- Orbe central représentant l'activité de Néron.
- Fenêtres flottantes ouvrables par commande ou navigation.
- Regroupement progressif des anciennes UI : dashboard, homelab, vocal, web.

## Installation

```bash
cd /etc/neron/ui
cp -r /chemin/neron-console ./app
cd app
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Connexion Néron Core

Configurer l'URL API dans `.env` :

```env
VITE_NERON_API_URL=http://localhost:8010
VITE_NERON_API_KEY=change-me
```

Les appels sont centralisés dans `src/lib/neronApi.ts`.
