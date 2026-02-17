# Déployer CIVIC-DRC sur Vercel

Le projet a **deux parties** : le **frontend** (React/Vite) et le **backend** (Node/Express).  
Sur Vercel, on déploie en priorité le **frontend**. Le backend doit être hébergé ailleurs (recommandé : Railway ou Render).

---

## Étape 1 — Préparer le dépôt GitHub

- Tout est déjà sur GitHub.
- Vérifier que le dépôt contient au moins le dossier du frontend (celui qui contient `package.json`, `vite.config.ts`, `src/`).
- Si ton repo contient tout le projet (dossier `civic-drc-` avec frontend + `backend/`), tu indiqueras le **Root Directory** à l’étape 3.

---

## Étape 2 — Où héberger le backend ?

Le backend Node/Express **ne tourne pas** comme un serveur classique sur Vercel. Deux possibilités :

### Option A (recommandée) : Backend sur Railway ou Render

1. **Railway** : [railway.app](https://railway.app)  
   - Connecte GitHub, crée un projet, ajoute le dossier `backend` (ou un repo séparé avec uniquement le backend).  
   - Déploie à partir du dossier où se trouve `package.json` du backend.  
   - Variables d’environnement : `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, éventuellement `MODERATION_URL` si tu déploies aussi le service de modération.  
   - Récupère l’URL du service (ex. `https://ton-backend.up.railway.app`).

2. **Render** : [render.com](https://render.com)  
   - New → Web Service, connecte le repo GitHub.  
   - Root Directory : `backend` (ou le chemin vers ton backend).  
   - Build : `npm install`  
   - Start : `npm start` (ou `node src/server.js`).  
   - Ajoute les mêmes variables d’environnement que ci‑dessus.  
   - Récupère l’URL (ex. `https://ton-backend.onrender.com`).

Tu utiliseras cette URL comme **URL de l’API** pour le frontend (variable `VITE_API_URL` sur Vercel).

### Option B : Pas de backend en production

Si tu veux seulement montrer le frontend sur Vercel, tu peux laisser `VITE_API_URL` pointant vers ton backend en local ou une URL de démo. Les appels API ne marcheront qu’avec un backend accessible à cette URL.

---

## Étape 3 — Déployer le frontend sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi (compte GitHub).

2. **Add New Project** (ou **Import Project**).  
   - Choisis le dépôt GitHub du projet.

3. **Configure le projet** :
   - **Framework Preset** : Vite (détecté automatiquement si `vercel.json` ou `vite.config` est présent).
   - **Root Directory** :  
     - Si tout le repo = le frontend : laisse vide.  
     - Si le frontend est dans un sous-dossier (ex. `civic-drc-`) : clique **Edit**, choisis le dossier **civic-drc-** (ou le nom de ton dossier frontend).
   - **Build Command** : `npm run build` (souvent déjà rempli).
   - **Output Directory** : `dist`.
   - **Install Command** : `npm install`.

4. **Variables d’environnement** (onglet **Environment Variables**) :
   - `VITE_API_URL` = URL de ton backend (ex. `https://ton-backend.up.railway.app` ou `https://ton-backend.onrender.com`).  
     Sans `/` à la fin.  
   - Ajoute-la pour **Production**, **Preview** et **Development** si tu veux que les préviews et la prod utilisent la même API.

5. Clique sur **Deploy**.  
   Vercel build le projet et te donne une URL (ex. `https://civic-drc-xxx.vercel.app`).

---

## Étape 4 — Vérifications après déploiement

- Ouvre l’URL Vercel : la page d’accueil s’affiche.
- Connexion / inscription : les requêtes partent vers `VITE_API_URL`. Si le backend est bien déployé et CORS autorise ton domaine Vercel, tout doit fonctionner.
- Si le backend est sur Railway/Render, ajoute l’origine Vercel dans CORS (ex. `https://ton-projet.vercel.app`). Dans ton backend Express, `cors()` sans option autorise souvent toutes les origines ; en production tu peux restreindre à ton domaine Vercel.

---

## Résumé des URLs

| Rôle              | Où l’héberger | Exemple d’URL                    |
|-------------------|----------------|----------------------------------|
| Frontend (React)  | Vercel         | `https://civic-drc.vercel.app`   |
| Backend (API)     | Railway/Render | `https://civic-drc-api.railway.app` |
| Modération (Python) | Optionnel ; même machine que le backend ou service séparé. Sur Railway/Render tu peux lancer le serveur Python en plus du Node, ou désactiver avec `MODERATION_DISABLED=1`. |

---

## Fichiers utiles dans le projet

- **Frontend** : `vercel.json` à la racine du frontend (dossier `civic-drc-`) pour le build et les rewrites SPA (routage React).
- **Backend** : pas de déploiement Vercel ; utiliser Railway ou Render avec les variables d’environnement listées plus haut.

Une fois le backend déployé, mets à jour `VITE_API_URL` dans les paramètres du projet Vercel et redéploie si besoin.
