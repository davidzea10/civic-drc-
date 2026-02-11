# Guide Supabase - CIVIC-DRC (etapes detaillees)

## 1. Creer le projet Supabase

1. Va sur https://supabase.com et connecte-toi (ou cree un compte).
2. Clique sur **New project**.
3. Renseigne : Name (ex. civic-drc), Database Password (note-le), Region.
4. Clique sur **Create new project**.

**Recuperer la connexion :** Project Settings > Database > Connection string > URI. Remplace [YOUR-PASSWORD] par ton mot de passe → ce sera DATABASE_URL dans .env.

## 2. Variables d'environnement

Dans **backend/** cree un fichier **.env** avec :

PORT=3000
DATABASE_URL=postgresql://postgres.[REF]:MOT_DE_PASSE@...pooler.supabase.com:6543/postgres
JWT_SECRET=une_cle_secrete_longue

## 3. Schema (tables en francais)

Execute le script **supabase_schema.sql** dans Supabase > SQL Editor. Tables : utilisateurs, ministeres, provinces, propositions, votes, commentaires, resultats_moderation.

## 4. Connexion Node

Le fichier src/db/client.js utilise pg et exporte testConnection() (SELECT 1).

## 5. Test Postman

GET http://localhost:3000/db-test → 200 = connexion OK.
