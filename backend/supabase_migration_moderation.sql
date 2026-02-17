-- Modération : score et flag sur propositions et commentaires (ne pas bloquer, afficher à l'admin)
ALTER TABLE propositions ADD COLUMN IF NOT EXISTS taux_moderation NUMERIC(5,2);
ALTER TABLE propositions ADD COLUMN IF NOT EXISTS a_moderer BOOLEAN DEFAULT false;
ALTER TABLE commentaires ADD COLUMN IF NOT EXISTS taux_moderation NUMERIC(5,2);
ALTER TABLE commentaires ADD COLUMN IF NOT EXISTS a_moderer BOOLEAN DEFAULT false;
