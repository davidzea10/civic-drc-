-- Schéma CIVIC-DRC - Tables en français (sans rôle modérateur)

-- 1. Utilisateurs (rôles : citoyen, responsable_ministere, admin)
CREATE TABLE utilisateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'citoyen' CHECK (role IN ('citoyen', 'responsable_ministere', 'admin')),
  cree_le TIMESTAMPTZ DEFAULT now()
);

-- 2. Ministères
CREATE TABLE ministeres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  attributions TEXT
);

-- 3. Provinces
CREATE TABLE provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  gouvernement TEXT
);

-- 4. Propositions (liées à un ministère OU une province)
CREATE TABLE propositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  ministere_id UUID REFERENCES ministeres(id) ON DELETE SET NULL,
  province_id UUID REFERENCES provinces(id) ON DELETE SET NULL,
  probleme TEXT NOT NULL,
  solution TEXT NOT NULL,
  impact TEXT,
  statut TEXT NOT NULL DEFAULT 'reçue' CHECK (statut IN ('reçue', 'en_analyse', 'retenue', 'en_cours_execution')),
  reponse_officielle TEXT,
  cree_le TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT proposition_entite CHECK (ministere_id IS NOT NULL OR province_id IS NOT NULL)
);

-- 5. Votes (like / dislike, un vote par utilisateur par proposition)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
  type_vote TEXT NOT NULL CHECK (type_vote IN ('like', 'dislike')),
  cree_le TIMESTAMPTZ DEFAULT now(),
  UNIQUE(utilisateur_id, proposition_id)
);

-- 6. Commentaires
CREATE TABLE commentaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  cree_le TIMESTAMPTZ DEFAULT now()
);

-- 7. Résultats modération (IA)
CREATE TABLE resultats_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
  etiquette TEXT NOT NULL CHECK (etiquette IN ('acceptable', 'a_verifier', 'haineux')),
  score NUMERIC(5,4),
  cree_le TIMESTAMPTZ DEFAULT now()
);

-- Index utiles pour les requêtes fréquentes
CREATE INDEX idx_propositions_utilisateur ON propositions(utilisateur_id);
CREATE INDEX idx_propositions_ministere ON propositions(ministere_id);
CREATE INDEX idx_propositions_province ON propositions(province_id);
CREATE INDEX idx_propositions_statut ON propositions(statut);
CREATE INDEX idx_votes_proposition ON votes(proposition_id);
CREATE INDEX idx_commentaires_proposition ON commentaires(proposition_id);
CREATE INDEX idx_resultats_moderation_proposition ON resultats_moderation(proposition_id);

-- Si la table propositions existait déjà sans reponse_officielle, exécuter :
-- ALTER TABLE propositions ADD COLUMN IF NOT EXISTS reponse_officielle TEXT;
