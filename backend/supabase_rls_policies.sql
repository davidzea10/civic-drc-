-- À exécuter dans Supabase > SQL Editor.
-- Prérequis : avoir exécuté supabase_schema.sql (tables utilisateurs, votes, commentaires, etc.).

-- ========== Utilisateurs ==========
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inscription : anon peut insérer" ON utilisateurs;
CREATE POLICY "Inscription : anon peut insérer"
  ON utilisateurs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Connexion : anon peut lire" ON utilisateurs;
CREATE POLICY "Connexion : anon peut lire"
  ON utilisateurs FOR SELECT TO anon USING (true);

-- ========== Votes (like/dislike) — pour que les votes s'enregistrent avec clé anon ==========
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Votes : lecture" ON votes;
CREATE POLICY "Votes : lecture"
  ON votes FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Votes : insertion" ON votes;
CREATE POLICY "Votes : insertion"
  ON votes FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Votes : mise à jour" ON votes;
CREATE POLICY "Votes : mise à jour"
  ON votes FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ========== Commentaires ==========
ALTER TABLE commentaires ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Commentaires : lecture" ON commentaires;
CREATE POLICY "Commentaires : lecture"
  ON commentaires FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Commentaires : insertion" ON commentaires;
CREATE POLICY "Commentaires : insertion"
  ON commentaires FOR INSERT TO anon WITH CHECK (true);
