# CIVIC-DRC — Liste des APIs Backend

| Méthode | Route | Auth | Description courte |
|---------|--------|------|--------------------|
| GET | /health | Non | Santé du serveur |
| GET | /db-test | Non | Test connexion Supabase |
| POST | /auth/register | Non | Inscription |
| POST | /auth/login | Non | Connexion (retourne JWT) |
| GET | /auth/me | JWT | Utilisateur courant |
| GET | /ministries | Non | Liste ministères |
| GET | /provinces | Non | Liste provinces |
| GET | /proposals | Non | Liste propositions (filtres optionnels) |
| GET | /proposals/:id | Non | Détail proposition |
| POST | /proposals | JWT | Créer une proposition |
| GET | /proposals/:id/votes | Optionnel | Nombre likes/dislikes + vote utilisateur |
| POST | /proposals/:id/votes | JWT | Voter like ou dislike |
| GET | /proposals/:id/comments | Non | Liste commentaires |
| POST | /proposals/:id/comments | JWT | Ajouter un commentaire |
| PATCH | /admin/proposals/:id/status | JWT (admin/responsable) | Changer statut |
| POST | /admin/proposals/:id/response | JWT (admin/responsable) | Réponse officielle |
