# Guide Supabase – CIVIC-DRC (étapes détaillées)

## 1. Créer le projet Supabase

1. Va sur https://supabase.com et connecte-toi (ou crée un compte).
2. Clique sur **New project**.
3. Renseigne :
   - **Name** : par ex. `civic-drc`
   - **Database Password** : choisis un mot de passe **fort** et note-le (tu en auras besoin pour la connexion depuis Node).
   - **Region** : choisis la plus proche (ex. Europe West).
4. Clique sur **Create new project** et attends la fin du déploiement.

**Récupérer les infos de connexion :**

- Dans le menu gauche : **Project Settings** (icône engrenage).
- Onglet **Database** :
  - **Connection string** → **URI** : tu verras une URL du type  
    `postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-xx.pooler.supabase.com:6543/postgres`
  - Remplace `[YOUR-PASSWORD]` par le mot de passe du projet → ce sera ta **DATABASE_URL**.
- (Optionnel) Onglet **API** : **Project URL** et **anon** / **service_role** key si tu utilises plus tard l'API REST Supabase. Pour l'instant, la connexion Node avec `pg` utilise uniquement la **Database URI**.

---

## 2. Variables d'environnement

1. Dans le dossier **backend/** (à la racine du backend, pas dans `src/`), crée un fichier nommé exactement **`.env`**.
2. Contenu minimal (adapte les valeurs) :

```
PORT=3000
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:TON_MOT_DE_PASSE@aws-0-xx.pooler.supabase.com:6543/postgres
JWT_SECRET=une_cle_secrete_longue_et_aleatoire_pour_signer_les_tokens
```

- **DATABASE_URL** : la chaîne de connexion PostgreSQL (avec le vrai mot de passe).
- **JWT_SECRET** : une chaîne aléatoire longue (pour signer les JWT plus tard). Ne la partage pas et ne la mets jamais sur GitHub (le `.env` est dans `.gitignore`).

Le fichier `server.js` charge déjà `require('dotenv').config()` au démarrage, donc ces variables seront disponibles dans `process.env.DATABASE_URL` et `process.env.JWT_SECRET`.

---

## 3. Schéma de base (tables en français)

Toutes les tables et colonnes sont en **français** sur Supabase. Utilise le fichier **`supabase_schema.sql`** dans le dossier backend : copie son contenu dans Supabase **SQL Editor** et exécute-le.

Tables créées : utilisateurs, ministeres, provinces, propositions, votes, commentaires, resultats_moderation.

---

## 4. Connexion depuis Node (pg)

Le fichier **`src/db/client.js`** crée un pool PostgreSQL et exporte **`testConnection()`** qui exécute `SELECT 1`. Le serveur utilise ce module pour l'endpoint **GET /db-test**.

---

## 5. Test de la base avec Postman

- Endpoint **GET /db-test** : si la connexion DB réussit → 200 avec `{ "status": "ok", "database": "connected" }`, sinon 503 avec message d'erreur.
- Dans Postman : **GET** `http://localhost:3000/db-test`.
