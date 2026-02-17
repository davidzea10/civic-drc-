-- Créer les tables votes et commentaires si elles n'existent pas.
-- Exécuter dans Supabase > SQL Editor si les propositions s'enregistrent mais pas les likes/commentaires.

-- Votes (like / dislike)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
  type_vote TEXT NOT NULL CHECK (type_vote IN ('like', 'dislike')),
  cree_le TIMESTAMPTZ DEFAULT now(),
  UNIQUE(utilisateur_id, proposition_id)
);

-- Commentaires
CREATE TABLE IF NOT EXISTS commentaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  cree_le TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_votes_proposition ON votes(proposition_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_proposition ON commentaires(proposition_id);
