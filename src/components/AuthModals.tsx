import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Phone, MapPin, Building2, AlertCircle } from "lucide-react";
import drcFlag from "@/assets/drc-flag.png";
import { useAuth, type UserData } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthModalsProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
}

const AuthModals = ({
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
}: AuthModalsProps) => {
  const { login, loginAsMinistry } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"citizen" | "ministry">("citizen");
  const [loginError, setLoginError] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    password: "",
    confirmPassword: "",
  });

  const provinces = [
    "Kinshasa", "Haut-Katanga", "Nord-Kivu", "Sud-Kivu", "Kasaï Central",
    "Équateur", "Tshopo", "Ituri", "Lualaba", "Kongo-Central",
    "Bas-Uele", "Haut-Uele", "Kasaï", "Kasaï Oriental", "Kwango",
    "Kwilu", "Lomami", "Lualaba", "Mai-Ndombe", "Maniema",
    "Mongala", "Nord-Ubangi", "Sankuru", "Sud-Ubangi", "Tanganyika", "Tshuapa",
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (loginMode === "ministry") {
      const user = loginAsMinistry(loginData.email, loginData.password);
      if (user) {
        setLoginData({ email: "", password: "" });
        setIsLoginOpen(false);
        setLoginMode("citizen");
        navigate("/ministry-dashboard");
      } else {
        setLoginError("Email ou mot de passe incorrect. Vérifiez vos identifiants ministériels.");
      }
    } else {
      // Citizen login
      login({
        name: "Citoyen Congolais",
        email: loginData.email,
        role: "citizen",
      });
      setLoginData({ email: "", password: "" });
      setIsLoginOpen(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    login({
      name: registerData.fullName,
      email: registerData.email,
      role: "citizen",
    });
    setRegisterData({ fullName: "", email: "", phone: "", province: "", password: "", confirmPassword: "" });
    setIsRegisterOpen(false);
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={(open) => {
        setIsLoginOpen(open);
        if (!open) {
          setLoginError("");
          setLoginMode("citizen");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {loginMode === "ministry" ? (
                <Building2 className="h-8 w-8 text-primary" />
              ) : (
                <LogIn className="h-8 w-8 text-primary" />
              )}
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Connexion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {loginMode === "ministry"
                ? "Connectez-vous à votre espace ministériel"
                : "Connectez-vous à votre compte CIVIC-DRC"}
            </DialogDescription>
          </DialogHeader>

          {/* Login Mode Toggle */}
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMode("citizen");
                setLoginError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                loginMode === "citizen"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <User className="h-4 w-4" /> Citoyen
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("ministry");
                setLoginError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                loginMode === "ministry"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Building2 className="h-4 w-4" /> Ministère
              </span>
            </button>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="flex items-center gap-2 rounded-xl bg-civic-red-light p-3 text-sm text-civic-red animate-fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {loginMode === "ministry" ? "Email officiel" : "Adresse email"}
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder={loginMode === "ministry" ? "responsable@ministere.gouv.cd" : "votre@email.com"}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginMode === "ministry" && (
              <div className="flex items-start gap-2 rounded-xl bg-civic-blue-light p-3 animate-fade-in">
                <Building2 className="h-4 w-4 mt-0.5 text-civic-blue flex-shrink-0" />
                <p className="text-xs text-civic-blue">
                  Utilisez les identifiants fournis par l'administrateur de la plateforme.
                  Vous serez redirigé vers votre tableau de bord ministériel.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-primary hover:underline font-medium">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 ${
                loginMode === "ministry"
                  ? "bg-civic-blue text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {loginMode === "ministry" ? (
                <>
                  <Building2 className="h-4 w-4" /> Accéder à mon ministère
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Se connecter
                </>
              )}
            </button>

            {loginMode === "citizen" && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="w-full rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" /> Créer un compte citoyen
                </button>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-civic-green-light">
              <UserPlus className="h-8 w-8 text-civic-green" />
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              Inscription Citoyen
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Créez votre compte pour participer à la gouvernance de la RDC
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegister} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-civic-green" /> Nom complet *
              </Label>
              <Input
                id="reg-name"
                placeholder="Ex: Jean-Pierre Mukendi"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-civic-green" /> Adresse email *
              </Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="votre@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-civic-green" /> Téléphone
              </Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="+243 XXX XXX XXX"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-province" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-civic-green" /> Province *
              </Label>
              <select
                id="reg-province"
                value={registerData.province}
                onChange={(e) => setRegisterData({ ...registerData, province: e.target.value })}
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sélectionner votre province...</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-civic-green" /> Mot de passe *
                </Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-civic-green" /> Confirmer *
                </Label>
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-border" />
              <span className="text-xs text-muted-foreground">
                J'accepte les <button type="button" className="text-primary hover:underline">conditions d'utilisation</button> et la{" "}
                <button type="button" className="text-primary hover:underline">politique de confidentialité</button> de CIVIC-DRC.
              </span>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-xl bg-civic-green px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" /> Créer mon compte
              </button>
            </DialogFooter>

            <div className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsLoginOpen(true);
                }}
                className="text-primary font-medium hover:underline"
              >
                Se connecter
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModals;
