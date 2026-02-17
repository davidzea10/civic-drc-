import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import drcFlag from "@/assets/drc-flag.png";
import heroBg from "@/assets/hero-bg.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { register as apiRegister, login as apiLogin } from "@/lib/api";

const provinces = [
  "Kinshasa", "Haut-Katanga", "Nord-Kivu", "Sud-Kivu", "Kasaï Central",
  "Équateur", "Tshopo", "Ituri", "Lualaba", "Kongo-Central",
  "Bas-Uele", "Haut-Uele", "Kasaï", "Kasaï Oriental", "Kwango",
  "Kwilu", "Lomami", "Mai-Ndombe", "Maniema",
  "Mongala", "Nord-Ubangi", "Sankuru", "Sud-Ubangi", "Tanganyika", "Tshuapa",
];

type ViewMode = "connexion" | "inscription";

const Auth = () => {
  const navigate = useNavigate();
  const { currentUser, setAuthFromApi } = useAuth();
  const [view, setView] = useState<ViewMode>("connexion");
  const [loginMode, setLoginMode] = useState<"citizen" | "ministry">("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      navigate("/accueil", { replace: true });
      return;
    }
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await apiLogin(loginData);
      setAuthFromApi(res.user, res.token);
      setLoginData({ email: "", password: "" });
      const role = res.user.role === "responsable_ministere" ? "ministry" : res.user.role === "admin" ? "admin" : "citizen";
      if (role === "ministry") navigate("/ministry-dashboard", { replace: true });
      else if (role === "admin") navigate("/accueil", { replace: true });
      else navigate("/accueil", { replace: true });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Les mots de passe ne correspondent pas.");
      return;
    }
    setRegisterLoading(true);
    try {
      await apiRegister({
        name: registerData.fullName.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });
      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        province: "",
        password: "",
        confirmPassword: "",
      });
      setRegisterSuccess(true);
      setView("connexion");
      setRegisterError("");
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const switchToRegister = () => {
    setView("inscription");
    setRegisterSuccess(false);
    setRegisterError("");
    setLoginError("");
  };

  const switchToConnexion = () => {
    setView("connexion");
    setLoginError("");
    setRegisterError("");
  };

  if (currentUser) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="civic-hero-overlay absolute inset-0" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-accent/20 bg-accent/5 blur-2xl" />
        <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-2xl border-2 border-white/10 -rotate-12 opacity-60" />
        <div className="absolute bottom-1/4 left-1/4 h-24 w-24 rounded-full border-2 border-accent/30 opacity-60" />
      </div>

      <div className="civic-container relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo + Brand */}
        <div
          className={`mb-8 flex flex-col items-center transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white/30 bg-card/20 shadow-2xl backdrop-blur-md">
            <img src={drcFlag} alt="République Démocratique du Congo" className="h-14 w-20 rounded-lg object-cover" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-primary-foreground md:text-4xl">
            CIVIC-DRC
          </h1>
          <p className="mt-1 text-sm font-medium text-primary-foreground/80">
            République Démocratique du Congo
          </p>
          <p className="mt-2 max-w-md text-center text-sm text-primary-foreground/70">
            Votre voix, notre avenir — Plateforme citoyenne de consultation
          </p>
        </div>

        {/* Card: Connexion | Inscription */}
        <div
          className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "250ms" }}
        >
          <div className="rounded-3xl border border-white/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            {/* Tabs */}
            <div className="mb-6 flex rounded-2xl bg-secondary/80 p-1.5">
              <button
                type="button"
                onClick={switchToConnexion}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  view === "connexion"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" /> Connexion
                </span>
              </button>
              <button
                type="button"
                onClick={switchToRegister}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                  view === "inscription"
                    ? "bg-civic-green text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" /> Inscription
                </span>
              </button>
            </div>

            {/* Success message after inscription */}
            {registerSuccess && view === "connexion" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-civic-green-light p-3 text-sm text-civic-green animate-fade-in">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Compte créé avec succès. Connectez-vous maintenant.</span>
              </div>
            )}

            {/* Connexion form */}
            {view === "connexion" && (
              <div className="animate-fade-in">
                <div className="mb-4 flex rounded-xl bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => { setLoginMode("citizen"); setLoginError(""); }}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      loginMode === "citizen" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5"><User className="h-4 w-4" /> Citoyen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMode("ministry"); setLoginError(""); }}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      loginMode === "ministry" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5"><Building2 className="h-4 w-4" /> Ministère</span>
                  </button>
                </div>

                {loginError && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-civic-red-light p-3 text-sm text-civic-red animate-fade-in">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      {loginMode === "ministry" ? "Email officiel" : "Adresse email"}
                    </label>
                    <input
                      type="email"
                      placeholder={loginMode === "ministry" ? "responsable@ministere.gouv.cd" : "votre@email.com"}
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Lock className="h-4 w-4 text-primary" /> Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                      loginMode === "ministry" ? "bg-civic-blue text-white hover:opacity-90" : "civic-gradient-bg text-primary-foreground hover:brightness-110"
                    }`}
                  >
                    {loginLoading ? "Connexion..." : loginMode === "ministry" ? (
                      <><Building2 className="h-4 w-4" /> Accéder à mon ministère</>
                    ) : (
                      <><LogIn className="h-4 w-4" /> Se connecter</>
                    )}
                  </button>
                </form>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <button type="button" onClick={switchToRegister} className="font-semibold text-primary hover:underline">
                    Créer un compte
                  </button>
                </p>
              </div>
            )}

            {/* Inscription form */}
            {view === "inscription" && (
              <div className="animate-fade-in space-y-4">
                {registerError && (
                  <div className="flex items-center gap-2 rounded-xl bg-civic-red-light p-3 text-sm text-civic-red">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{registerError}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <User className="h-4 w-4 text-civic-green" /> Nom complet *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jean-Pierre Mukendi"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-civic-green" /> Adresse email *
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-civic-green" /> Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+243 XXX XXX XXX"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4 text-civic-green" /> Province *
                    </label>
                    <select
                      value={registerData.province}
                      onChange={(e) => setRegisterData({ ...registerData, province: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionner votre province...</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-civic-green" /> Mot de passe *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-civic-green" /> Confirmer *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" required className="mt-1 rounded border-border" />
                    <span className="text-xs text-muted-foreground">
                      J'accepte les conditions d'utilisation et la politique de confidentialité de CIVIC-DRC.
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full rounded-xl bg-civic-green px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UserPlus className="h-4 w-4" /> {registerLoading ? "Inscription..." : "Créer mon compte"}
                  </button>
                </form>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <button type="button" onClick={switchToConnexion} className="font-semibold text-primary hover:underline">
                    Se connecter
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Link to accueil (without login) */}
        <div
          className={`mt-8 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link
            to="/accueil"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-5 py-2.5 text-sm font-medium text-primary-foreground/90 backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
          >
            Découvrir le site <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
