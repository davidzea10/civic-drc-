import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirige vers la page de connexion (/) si l'utilisateur n'est pas authentifié.
 * À utiliser pour les routes qui nécessitent d'être connecté.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
