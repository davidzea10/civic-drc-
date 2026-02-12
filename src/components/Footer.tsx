import { Link } from "react-router-dom";
import drcFlag from "@/assets/drc-flag.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="civic-container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={drcFlag} alt="Drapeau RDC" className="h-8 w-12 rounded-sm object-cover" />
              <span className="font-display text-xl font-bold">CIVIC-DRC</span>
            </div>
            <p className="text-sm opacity-70">
              Plateforme citoyenne pour la démocratie participative en République Démocratique du Congo.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider opacity-50">Navigation</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Accueil</Link></li>
              <li><Link to="/ministeres" className="hover:opacity-100 transition-opacity">Ministères</Link></li>
              <li><Link to="/provinces" className="hover:opacity-100 transition-opacity">Provinces</Link></li>
              <li><Link to="/propositions" className="hover:opacity-100 transition-opacity">Propositions</Link></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider opacity-50">Ressources</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/a-propos" className="hover:opacity-100 transition-opacity">À propos</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-100 transition-opacity">Tableau de bord</Link></li>
              <li><span className="cursor-default">Conditions d'utilisation</span></li>
              <li><span className="cursor-default">Politique de confidentialité</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider opacity-50">Contact</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Kinshasa, RDC</li>
              <li>contact@civic-drc.cd</li>
              <li>+243 850 377 919</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-6 sm:flex-row">
          <p className="text-xs opacity-50">
            © 2026 CIVIC-DRC. Tous droits réservés.
          </p>
          <div className="flex gap-2">
            <span className="inline-block h-4 w-6 rounded-sm bg-civic-blue" />
            <span className="inline-block h-4 w-6 rounded-sm bg-civic-yellow" />
            <span className="inline-block h-4 w-6 rounded-sm bg-civic-red" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
