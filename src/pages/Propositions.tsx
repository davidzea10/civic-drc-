import Layout from "@/components/Layout";
import { ThumbsUp, ThumbsDown, MessageSquare, Filter, Search, Plus, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MessagesModal from "@/components/MessagesModal";

interface Proposal {
  id: number;
  title: string;
  problem: string;
  solution: string;
  ministry: string;
  province: string;
  author: string;
  status: string;
  likes: number;
  dislikes: number;
  comments: number;
  date: string;
  isLiked: boolean;
  isDisliked: boolean;
}

const initialProposals: Proposal[] = [
  {
    id: 1,
    title: "Amélioration de l'accès à l'eau potable à Lubumbashi",
    problem: "Plus de 60% de la population de Lubumbashi n'a pas accès à l'eau potable de manière régulière.",
    solution: "Construction de 50 nouveaux forages et réhabilitation du réseau de distribution existant.",
    ministry: "Ministère des Ressources Hydrauliques",
    province: "Haut-Katanga",
    author: "Jean M.",
    status: "En cours",
    likes: 342,
    dislikes: 12,
    comments: 56,
    date: "12 Fév 2026",
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 2,
    title: "Réhabilitation des routes nationales RN1 et RN4",
    problem: "Les routes nationales sont dans un état de dégradation avancé, rendant le transport difficile.",
    solution: "Lancement d'un programme de réhabilitation avec des matériaux durables et un système de maintenance.",
    ministry: "Ministère des Infrastructures",
    province: "Kinshasa",
    author: "Marie K.",
    status: "Acceptée",
    likes: 891,
    dislikes: 23,
    comments: 123,
    date: "10 Fév 2026",
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 3,
    title: "Programme de bourses pour les étudiants du Sud-Kivu",
    problem: "De nombreux étudiants méritants ne peuvent pas poursuivre leurs études faute de moyens financiers.",
    solution: "Création d'un fonds provincial de bourses d'études pour 500 étudiants par an.",
    ministry: "Ministère de l'Éducation",
    province: "Sud-Kivu",
    author: "Patrick B.",
    status: "En attente",
    likes: 215,
    dislikes: 5,
    comments: 38,
    date: "8 Fév 2026",
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 4,
    title: "Électrification rurale dans le Kasaï Central",
    problem: "90% des zones rurales du Kasaï Central n'ont aucun accès à l'électricité.",
    solution: "Installation de panneaux solaires communautaires dans 200 villages prioritaires.",
    ministry: "Ministère de l'Énergie",
    province: "Kasaï Central",
    author: "Alice N.",
    status: "En cours",
    likes: 567,
    dislikes: 8,
    comments: 89,
    date: "5 Fév 2026",
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 5,
    title: "Centre de santé moderne à Goma",
    problem: "L'hôpital général de Goma est saturé et manque d'équipements modernes.",
    solution: "Construction d'un nouveau centre hospitalier avec équipements de pointe et formation du personnel.",
    ministry: "Ministère de la Santé",
    province: "Nord-Kivu",
    author: "David L.",
    status: "Acceptée",
    likes: 1023,
    dislikes: 15,
    comments: 201,
    date: "3 Fév 2026",
    isLiked: false,
    isDisliked: false,
  },
];

const statusColors: Record<string, string> = {
  "Acceptée": "bg-civic-green-light text-civic-green",
  "En cours": "bg-civic-blue-light text-civic-blue",
  "En attente": "bg-civic-yellow-light text-accent-foreground",
  "Refusée": "bg-civic-red-light text-civic-red",
};

const provinces = [
  "Kinshasa", "Haut-Katanga", "Nord-Kivu", "Sud-Kivu", "Kasaï Central",
  "Équateur", "Tshopo", "Ituri", "Lualaba", "Kongo-Central",
];

const ministries = [
  "Ministère de la Santé", "Ministère de l'Éducation", "Ministère des Infrastructures",
  "Ministère de l'Énergie", "Ministère des Ressources Hydrauliques", "Ministère de l'Agriculture",
  "Ministère de la Justice", "Ministère de l'Intérieur",
];

const Propositions = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [likeAnimations, setLikeAnimations] = useState<Record<number, boolean>>({});
  const [messagesModal, setMessagesModal] = useState<{
    isOpen: boolean;
    proposalId: number;
    proposalTitle: string;
  }>({ isOpen: false, proposalId: 0, proposalTitle: "" });

  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    solution: "",
    impact: "",
    keywords: "",
    ministry: "",
    province: "",
  });

  useEffect(() => {
    const provinceParam = searchParams.get("province");
    if (provinceParam) {
      setFormData((prev) => ({ ...prev, province: provinceParam }));
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const filtered = proposals.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleLike = (id: number) => {
    setProposals(
      proposals.map((p) => {
        if (p.id === id) {
          if (p.isLiked) {
            return { ...p, likes: p.likes - 1, isLiked: false };
          } else {
            return {
              ...p,
              likes: p.likes + 1,
              isLiked: true,
              dislikes: p.isDisliked ? p.dislikes - 1 : p.dislikes,
              isDisliked: false,
            };
          }
        }
        return p;
      })
    );
    // Trigger animation
    setLikeAnimations({ ...likeAnimations, [id]: true });
    setTimeout(() => {
      setLikeAnimations((prev) => ({ ...prev, [id]: false }));
    }, 300);
  };

  const handleDislike = (id: number) => {
    setProposals(
      proposals.map((p) => {
        if (p.id === id) {
          if (p.isDisliked) {
            return { ...p, dislikes: p.dislikes - 1, isDisliked: false };
          } else {
            return {
              ...p,
              dislikes: p.dislikes + 1,
              isDisliked: true,
              likes: p.isLiked ? p.likes - 1 : p.likes,
              isLiked: false,
            };
          }
        }
        return p;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProposal: Proposal = {
      id: proposals.length + 1,
      title: formData.title,
      problem: formData.problem,
      solution: formData.solution,
      ministry: formData.ministry,
      province: formData.province,
      author: "Vous",
      status: "En attente",
      likes: 0,
      dislikes: 0,
      comments: 0,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isLiked: false,
      isDisliked: false,
    };
    setProposals([newProposal, ...proposals]);
    setFormData({ title: "", problem: "", solution: "", impact: "", keywords: "", ministry: "", province: "" });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Propositions citoyennes
              </span>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Toutes les propositions
              </h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Nouvelle proposition
            </button>
          </div>

          {/* Modal de nouvelle proposition */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold text-foreground">
                  📝 Soumettre une nouvelle proposition
                </DialogTitle>
                <DialogDescription>
                  Décrivez le problème, proposez une solution et précisez l'impact attendu. Votre voix compte !
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Titre de la proposition *</Label>
                  <Input
                    id="title"
                    placeholder="Ex : Amélioration de l'accès à l'eau potable..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                {/* Problème */}
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm font-semibold">🔴 Description du problème *</Label>
                  <Textarea
                    id="problem"
                    placeholder="Décrivez le problème que vous avez observé..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    required
                    className="min-h-[100px] rounded-xl"
                  />
                </div>

                {/* Solution */}
                <div className="space-y-2">
                  <Label htmlFor="solution" className="text-sm font-semibold">💡 Solution proposée *</Label>
                  <Textarea
                    id="solution"
                    placeholder="Proposez une solution concrète..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    required
                    className="min-h-[100px] rounded-xl"
                  />
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-sm font-semibold">📊 Impact attendu *</Label>
                  <Textarea
                    id="impact"
                    placeholder="Quel impact positif cette proposition aurait-elle ?"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    required
                    className="min-h-[80px] rounded-xl"
                  />
                </div>

                {/* Ministère & Province */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry" className="text-sm font-semibold">🏛 Ministère concerné *</Label>
                    <select
                      id="ministry"
                      value={formData.ministry}
                      onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionner...</option>
                      {ministries.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-semibold">📍 Province *</Label>
                    <select
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      required
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionner...</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mots-clés */}
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-sm font-semibold">🏷 Mots-clés</Label>
                  <Input
                    id="keywords"
                    placeholder="eau, santé, éducation... (séparés par des virgules)"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                {/* Pièces jointes */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">📎 Pièces jointes (optionnel)</Label>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary/40">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Glissez vos fichiers ici ou cliquez pour parcourir</span>
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
                  >
                    Soumettre la proposition
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Messages Modal */}
          <MessagesModal
            isOpen={messagesModal.isOpen}
            setIsOpen={(open) =>
              setMessagesModal({ ...messagesModal, isOpen: open })
            }
            proposalTitle={messagesModal.proposalTitle}
            proposalId={messagesModal.proposalId}
          />

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une proposition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              {["Tous", "En attente", "En cours", "Acceptée"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Proposals list */}
          <div className="space-y-4">
            {filtered.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 civic-card-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[proposal.status] || ""}`}>
                        {proposal.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{proposal.date}</span>
                    </div>
                    <h3 className="mb-1 font-display text-lg font-semibold text-foreground">{proposal.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">{proposal.problem}</p>
                    <p className="text-sm text-foreground/80">
                      <span className="font-medium text-primary">💡 Solution :</span> {proposal.solution}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-md bg-secondary px-2 py-1">{proposal.ministry}</span>
                      <span className="rounded-md bg-secondary px-2 py-1">{proposal.province}</span>
                      <span className="rounded-md bg-secondary px-2 py-1">Par {proposal.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground sm:flex-col sm:items-end">
                    <button
                      onClick={() => handleLike(proposal.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all ${
                        proposal.isLiked
                          ? "bg-civic-green-light text-civic-green font-semibold shadow-sm"
                          : "hover:bg-civic-green-light hover:text-civic-green"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 transition-all ${
                          likeAnimations[proposal.id] ? "animate-like-pop" : ""
                        } ${proposal.isLiked ? "fill-current" : ""}`}
                      />
                      <span
                        className={`tabular-nums transition-all ${
                          likeAnimations[proposal.id] ? "animate-counter-up" : ""
                        }`}
                      >
                        {proposal.likes}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDislike(proposal.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all ${
                        proposal.isDisliked
                          ? "bg-civic-red-light text-civic-red font-semibold shadow-sm"
                          : "hover:bg-civic-red-light hover:text-civic-red"
                      }`}
                    >
                      <ThumbsDown
                        className={`h-4 w-4 ${proposal.isDisliked ? "fill-current" : ""}`}
                      />
                      {proposal.dislikes}
                    </button>
                    <button
                      onClick={() =>
                        setMessagesModal({
                          isOpen: true,
                          proposalId: proposal.id,
                          proposalTitle: proposal.title,
                        })
                      }
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all hover:bg-civic-blue-light hover:text-civic-blue cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{proposal.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Propositions;
