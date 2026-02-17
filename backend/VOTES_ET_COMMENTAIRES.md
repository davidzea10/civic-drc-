# Enregistrement des votes (like/dislike) et commentaires

Si les propositions s’enregistrent mais **pas les likes ni les commentaires** (ils disparaissent après actualisation), faites les points suivants.

**Test rapide :** avec le backend démarré, ouvrez `http://localhost:3000/proposals-votes-test` dans le navigateur. Vous verrez si les tables sont accessibles ou l’erreur exacte.

## 1. Tables dans Supabase

Les tables `votes` et `commentaires` doivent exister.

- Si vous avez déjà exécuté **supabase_schema.sql** en entier, elles existent.
- Sinon, exécutez **supabase_tables_votes_commentaires.sql** dans Supabase → SQL Editor.

## 2. Clé backend (recommandé)

Dans **backend/.env**, ajoutez la clé **service_role** (elle contourne la RLS) :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
JWT_SECRET=votre_secret_jwt
```

Récupération de la clé : Supabase → **Settings** → **API** → **Project API keys** → **service_role** (secret).

Redémarrez le backend après modification du .env.

## 3. Si vous n’utilisez que la clé anon

Sans `SUPABASE_SERVICE_ROLE_KEY`, le backend utilise la clé anon. Les écritures en base sont alors bloquées par la RLS sauf si des politiques existent.

Exécutez **supabase_rls_policies.sql** dans Supabase → SQL Editor (au moins la partie Votes et Commentaires). Vous pouvez ré-exécuter le script : les politiques sont supprimées puis recréées.

## 4. Vérification

1. Se connecter sur l’app.
2. Ouvrir une proposition, cliquer sur Like (ou Dislike).
3. Actualiser la page : le compteur doit rester (ex. 1 like).
4. Dans Supabase → **Table Editor** → **votes** : une ligne doit apparaître avec `proposition_id`, `utilisateur_id`, `type_vote` (like ou dislike).

Si un message d’erreur s’affiche sous les boutons Like/Dislike, il provient de l’API : notez-le pour diagnostiquer (ex. « permission denied for table votes » = RLS ou clé manquante).
