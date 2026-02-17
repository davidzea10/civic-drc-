import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, Shield, User, LogOut, ChevronDown, Building2, LayoutDashboard } from "lucide-react";
import drcFlag from "@/assets/drc-flag.png";
import AuthModals from "@/components/AuthModals";
import AdminPanel from "@/components/AdminPanel";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Accueil", path: "/accueil" },
  { label: "Ministères", path: "/ministeres" },
  { label: "Provinces", path: "/provinces" },
  { label: "Propositions", path: "/propositions" },
  
  { label: "À propos", path: "/a-propos" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const getRoleBadge = () => {
    if (!currentUser) return "";
    switch (currentUser.role) {
      case "admin":
        return "Administrateur";
      case "ministry":
        return currentUser.ministryName || "Responsable Ministériel";
      default:
        return "Citoyen";
    }
  };

  const getRoleBadgeColor = () => {
    if (!currentUser) return "";
    switch (currentUser.role) {
      case "admin":
        return "bg-civic-red-light text-civic-red";
      case "ministry":
        return "bg-civic-blue-light text-civic-blue";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="civic-container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/accueil" className="flex items-center gap-3">
            <img src={drcFlag} alt="Drapeau RDC" className="h-8 w-12 rounded-sm object-cover shadow-sm" />
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              CIVIC-DRC
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Ministry Dashboard link for ministry users */}
            {currentUser?.role === "ministry" && (
              <Link
                to="/ministry-dashboard"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === "/ministry-dashboard"
                    ? "bg-civic-blue/10 text-civic-blue"
                    : "text-civic-blue hover:bg-civic-blue/10"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Mon Ministère
              </Link>
            )}
            {/* Gérer les propositions — admin et responsable ministère */}
            {(currentUser?.role === "admin" || currentUser?.role === "ministry") && (
              <Link
                to="/admin/propositions"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === "/admin/propositions"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Gérer les propositions
              </Link>
            )}
          </nav>

          {/* Auth buttons + Mobile toggle */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              /* Logged in user menu */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    currentUser.role === "ministry"
                      ? "bg-civic-blue text-white"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-foreground">{currentUser.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-border bg-card p-2 shadow-lg animate-fade-in z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeColor()}`}>
                        {getRoleBadge()}
                      </span>
                    </div>

                    {/* Ministry Dashboard link */}
{currentUser.role === "ministry" && (
                        <button
                          onClick={() => {
                            navigate("/ministry-dashboard");
                            setShowUserMenu(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                        >
                          <LayoutDashboard className="h-4 w-4 text-civic-blue" /> Mon Tableau de Bord
                        </button>
                    )}

                    {(currentUser.role === "admin" || currentUser.role === "ministry") && (
                      <button
                        onClick={() => {
                          navigate("/admin/propositions");
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        Gérer les propositions
                      </button>
                    )}

                    {/* Admin Panel - only for admin role */}
                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setIsAdminOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <Shield className="h-4 w-4 text-civic-red" /> Panneau Admin
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-civic-red transition-colors hover:bg-civic-red-light"
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
                >
                  <LogIn className="h-4 w-4" /> Connexion
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:inline-flex"
                >
                  <UserPlus className="h-4 w-4" /> Inscription
                </button>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hidden items-center gap-1.5 rounded-lg bg-civic-red/10 px-3 py-2 text-sm font-medium text-civic-red transition-colors hover:bg-civic-red/20 md:inline-flex"
                  title="Panneau Administrateur"
                >
                  <Shield className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="animate-fade-in border-t border-border bg-card p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Ministry Dashboard link for mobile */}
              {currentUser?.role === "ministry" && (
                <Link
                  to="/ministry-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                    location.pathname === "/ministry-dashboard"
                      ? "bg-civic-blue/10 text-civic-blue"
                      : "text-civic-blue hover:bg-civic-blue/10"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" /> Mon Ministère
                </Link>
              )}

              {/* Gérer les propositions — mobile */}
              {(currentUser?.role === "admin" || currentUser?.role === "ministry") && (
                <Link
                  to="/admin/propositions"
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === "/admin/propositions"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Gérer les propositions
                </Link>
              )}

              <div className="mt-3 border-t border-border pt-3 space-y-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        currentUser.role === "ministry"
                          ? "bg-civic-blue text-white"
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeColor()}`}>
                          {getRoleBadge()}
                        </span>
                      </div>
                    </div>

                    {currentUser.role === "ministry" && (
                      <button
                        onClick={() => {
                          navigate("/ministry-dashboard");
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-civic-blue transition-colors hover:bg-civic-blue/10"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Mon Tableau de Bord
                      </button>
                    )}

                    {(currentUser.role === "admin" || currentUser.role === "ministry") && (
                      <Link
                        to="/admin/propositions"
                        onClick={() => setMobileOpen(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Gérer les propositions
                      </Link>
                    )}

                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setIsAdminOpen(true);
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        <Shield className="h-4 w-4 text-civic-red" /> Panneau Admin
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-civic-red transition-colors hover:bg-civic-red-light"
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <LogIn className="h-4 w-4" /> Connexion
                    </button>
                    <button
                      onClick={() => {
                        setIsRegisterOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      <UserPlus className="h-4 w-4" /> Inscription
                    </button>
                    <button
                      onClick={() => {
                        setIsAdminOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-civic-red/10 px-4 py-2.5 text-sm font-medium text-civic-red"
                    >
                      <Shield className="h-4 w-4" /> Admin
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <AuthModals
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />

      {/* Admin Panel */}
      <AdminPanel isOpen={isAdminOpen} setIsOpen={setIsAdminOpen} />
    </>
  );
};

export default Header;
