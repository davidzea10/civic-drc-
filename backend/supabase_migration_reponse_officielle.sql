-- Migration : ajouter la colonne reponse_officielle à la table existante propositions.
-- À exécuter une seule fois dans Supabase → SQL Editor (si la colonne n'existe pas encore).

ALTER TABLE propositions ADD COLUMN IF NOT EXISTS reponse_officielle TEXT;
