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
import {
  Shield,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface MinistryAccount {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  ministry: string;
  ministryId: number;
  createdAt: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ministries = [
  { id: 1, name: "Ministère de l'Intérieur" },
  { id: 2, name: "Ministère de l'Éducation" },
  { id: 3, name: "Ministère de la Santé" },
  { id: 4, name: "Ministère des Infrastructures" },
  { id: 5, name: "Ministère de l'Agriculture" },
  { id: 6, name: "Ministère des Finances" },
  { id: 7, name: "Ministère de la Justice" },
  { id: 8, name: "Ministère des Ressources Hydrauliques" },
  { id: 9, name: "Ministère de l'Énergie" },
  { id: 10, name: "Ministère des Transports" },
  { id: 11, name: "Ministère de l'Environnement" },
  { id: 12, name: "Ministère du Numérique" },
  { id: 13, name: "Ministère de la Défense" },
  { id: 14, name: "Ministère des Affaires Étrangères" },
  { id: 15, name: "Ministère du Commerce" },
  { id: 16, name: "Ministère du Travail" },
  { id: 17, name: "Ministère de la Culture et des Arts" },
  { id: 18, name: "Ministère des Mines" },
  { id: 19, name: "Ministère du Plan" },
  { id: 20, name: "Ministère de la Communication" },
];

const AdminPanel = ({ isOpen, setIsOpen }: AdminPanelProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [accounts, setAccounts] = useState<MinistryAccount[]>([
    {
      id: 1,
      fullName: "Dr. Jean Mbuyi",
      email: "j.mbuyi@sante.gouv.cd",
      phone: "+243 812 345 678",
      ministry: "Ministère de la Santé",
      ministryId: 3,
      createdAt: "10 Fév 2026",
    },
    {
      id: 2,
      fullName: "Prof. Marie Lukusa",
      email: "m.lukusa@education.gouv.cd",
      phone: "+243 823 456 789",
      ministry: "Ministère de l'Éducation",
      ministryId: 2,
      createdAt: "8 Fév 2026",
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    ministryId: "",
    password: "",
    confirmPassword: "",
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const selectedMinistry = ministries.find(
      (m) => m.id === parseInt(formData.ministryId)
    );
    if (!selectedMinistry) return;

    const newAccount: MinistryAccount = {
      id: accounts.length + 1,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      ministry: selectedMinistry.name,
      ministryId: selectedMinistry.id,
      createdAt: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setAccounts([...accounts, newAccount]);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      ministryId: "",
      password: "",
      confirmPassword: "",
    });
    setSuccessMessage(
      `✅ Compte créé avec succès pour ${newAccount.fullName} (${newAccount.ministry})`
    );
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-civic-red-light">
              <Shield className="h-6 w-6 text-civic-red" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl font-bold text-foreground">
                🔐 Panneau Administrateur
              </DialogTitle>
              <DialogDescription>
                Créez et gérez les comptes des responsables de chaque ministère
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-civic-green-light p-4 text-sm text-civic-green animate-slide-up">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create Account Form */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <UserPlus className="h-5 w-5 text-primary" />
              Créer un compte ministériel
            </h3>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" /> Nom complet du responsable *
                </Label>
                <Input
                  placeholder="Ex: Dr. Jean Mbuyi"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Email officiel *
                </Label>
                <Input
                  type="email"
                  placeholder="responsable@ministere.gouv.cd"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Téléphone
                </Label>
                <Input
                  type="tel"
                  placeholder="+243 XXX XXX XXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Ministère associé (ministere_id) *
                </Label>
                <select
                  value={formData.ministryId}
                  onChange={(e) =>
                    setFormData({ ...formData, ministryId: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Sélectionner un ministère...</option>
                  {ministries.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.id}] {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-primary" /> Mot de passe *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-primary" /> Confirmer *
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-civic-yellow-light p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                <p className="text-xs text-accent-foreground">
                  Le compte sera associé au <strong>ministere_id</strong> sélectionné.
                  Le responsable pourra consulter et répondre aux propositions citoyennes
                  adressées à son ministère.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" /> Créer le compte
              </button>
            </form>
          </div>

          {/* Existing Accounts */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-civic-green" />
              Comptes existants
              <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {accounts.length}
              </span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="mx-auto h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">Aucun compte ministériel créé</p>
                </div>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {account.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {account.fullName}
                          </p>
                          <p className="text-xs text-primary font-medium">
                            {account.ministry}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            📧 {account.email}
                          </p>
                          {account.phone && (
                            <p className="text-xs text-muted-foreground">
                              📱 {account.phone}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-md bg-civic-blue-light px-2 py-0.5 text-[10px] font-semibold text-civic-blue">
                              ID: {account.ministryId}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Créé le {account.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-civic-red-light hover:text-civic-red group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
