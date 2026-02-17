import Layout from "@/components/Layout";
import { ThumbsUp, ThumbsDown, MessageSquare, Filter, Search, Plus, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import { getProposals, getMinistries, getProvinces, postProposal, type ApiProposition, type ApiMinistry, type ApiProvince } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Proposal {
  id: number | string;
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

const statutToLabel: Record<string, string> = {
  reçue: "En attente",
  en_analyse: "En analyse",
  retenue: "Acceptée",
  en_cours_execution: "En cours",
};

const statusColors: Record<string, string> = {
  "Acceptée": "bg-civic-green-light text-civic-green",
  "En cours": "bg-civic-blue-light text-civic-blue",
  "En analyse": "bg-civic-blue-light text-civic-blue",
  "En attente": "bg-civic-yellow-light text-accent-foreground",
  "Refusée": "bg-civic-red-light text-civic-red",
};

function mapApiToProposal(api: ApiProposition): Proposal {
  const date = api.cree_le
    ? new Date(api.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  return {
    id: api.id,
    title: api.probleme.slice(0, 80) + (api.probleme.length > 80 ? "…" : ""),
    problem: api.probleme,
    solution: api.solution,
    ministry: api.ministeres?.nom ?? "—",
    province: api.provinces?.nom ?? "—",
    author: api.utilisateurs?.nom ?? "Citoyen",
    status: statutToLabel[api.statut] ?? api.statut,
    likes: 0,
    dislikes: 0,
    comments: 0,
    date,
    isLiked: false,
    isDisliked: false,
  };
}

const Propositions = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsEnAttente, setProposalsEnAttente] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [loadingEnAttente, setLoadingEnAttente] = useState(false);
  const [ministries, setMinistries] = useState<ApiMinistry[]>([]);
  const [provinces, setProvinces] = useState<ApiProvince[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastModeration, setLastModeration] = useState<{ taux: number; a_moderer: boolean } | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [likeAnimations, setLikeAnimations] = useState<Record<number | string, boolean>>({});
  const [messagesModal, setMessagesModal] = useState<{
    isOpen: boolean;
    proposalId: number | string;
    proposalTitle: string;
  }>({ isOpen: false, proposalId: 0, proposalTitle: "" });

  const [formData, setFormData] = useState({
    problem: "",
    solution: "",
    impact: "",
    ministere_id: "",
    province_id: "",
  });

  const ministereId = searchParams.get("ministere_id") || undefined;
  const provinceId = searchParams.get("province_id") || undefined;

  // Liste publique : uniquement les propositions avec réponse officielle publiée
  useEffect(() => {
    setLoadingProposals(true);
    getProposals({
      sort: "recent",
      ministere_id: ministereId || undefined,
      province_id: provinceId || undefined,
      officielles: true,
    })
      .then((data) => setProposals((data || []).map(mapApiToProposal)))
      .catch(() => setProposals([]))
      .finally(() => setLoadingProposals(false));
  }, [ministereId, provinceId]);

  useEffect(() => {
    getMinistries().then(setMinistries).catch(() => setMinistries([]));
    getProvinces().then(setProvinces).catch(() => setProvinces([]));
  }, []);

  // Mes propositions en attente (sans réponse officielle) — citoyen connecté
  useEffect(() => {
    if (!token || !currentUser) {
      setProposalsEnAttente([]);
      return;
    }
    setLoadingEnAttente(true);
    getProposals({ mes_en_attente: true }, token)
      .then((data) => setProposalsEnAttente((data || []).map(mapApiToProposal)))
      .catch(() => setProposalsEnAttente([]))
      .finally(() => setLoadingEnAttente(false));
  }, [token, currentUser]);

  useEffect(() => {
    const provinceParam = searchParams.get("province");
    const provinceIdParam = searchParams.get("province_id");
    if (provinceIdParam) {
      setFormData((prev) => ({ ...prev, province_id: provinceIdParam }));
      setIsModalOpen(true);
    } else if (provinceParam && provinces.length) {
      const p = provinces.find((x) => x.nom === provinceParam);
      if (p) setFormData((prev) => ({ ...prev, province_id: p.id }));
      setIsModalOpen(true);
    }
    const ministryIdParam = searchParams.get("ministere_id");
    if (ministryIdParam) {
      setFormData((prev) => ({ ...prev, ministere_id: ministryIdParam }));
      setIsModalOpen(true);
    }
  }, [searchParams, provinces]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!currentUser || !token) {
      setSubmitError("Vous devez être connecté pour soumettre une proposition.");
      return;
    }
    if (!formData.ministere_id && !formData.province_id) {
      setSubmitError("Choisissez un ministère ou une province.");
      return;
    }
    if (!formData.problem?.trim() || !formData.solution?.trim()) {
      setSubmitError("Le problème et la solution sont requis.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    setLastModeration(null);
    setCreatedId(null);
    try {
      const created = await postProposal(
        {
          ministere_id: formData.ministere_id || undefined,
          province_id: formData.province_id || undefined,
          probleme: formData.problem.trim(),
          solution: formData.solution.trim(),
          impact: formData.impact?.trim() || undefined,
        },
        token
      );
      setFormData({ problem: "", solution: "", impact: "", ministere_id: "", province_id: "" });
      const taux = created.taux_moderation ?? 0;
      const aModerer = Boolean(created.a_moderer);
      setLastModeration({ taux, a_moderer: aModerer });
      setCreatedId(created.id);
      if (!aModerer) {
        setIsModalOpen(false);
        navigate(`/propositions/${created.id}`);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
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
                  Soumettre une nouvelle proposition
                </DialogTitle>
                <DialogDescription>
                  Décrivez le problème, proposez une solution et précisez l'impact attendu. Votre voix compte !
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="rounded-xl bg-civic-red-light p-3 text-sm text-civic-red">
                    {submitError}
                  </div>
                )}
                {lastModeration && createdId && (
                  <div className="rounded-xl border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      Proposition enregistrée. Score de modération IA : {lastModeration.taux}/100
                    </p>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${Math.min(100, lastModeration.taux)}%` }}
                      />
                    </div>
                    {lastModeration.a_moderer && (
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Votre texte contient possiblement des propos inappropriés (injures, menaces, etc.). Il a été signalé à l&apos;administrateur qui pourra le publier ou non.
                      </p>
                    )}
                    <Button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setLastModeration(null);
                        setCreatedId(null);
                        navigate(`/propositions/${createdId}`);
                      }}
                      className="w-full"
                    >
                      Voir ma proposition
                    </Button>
                  </div>
                )}

                {/* Ministère ou Province (au moins un requis) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministere_id" className="text-sm font-semibold">Ministère concerné</Label>
                    <select
                      id="ministere_id"
                      value={formData.ministere_id}
                      onChange={(e) => setFormData({ ...formData, ministere_id: e.target.value, province_id: e.target.value ? "" : formData.province_id })}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Aucun</option>
                      {ministries.map((m) => (
                        <option key={m.id} value={m.id}>{m.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province_id" className="text-sm font-semibold">Province concernée</Label>
                    <select
                      id="province_id"
                      value={formData.province_id}
                      onChange={(e) => setFormData({ ...formData, province_id: e.target.value, ministere_id: e.target.value ? "" : formData.ministere_id })}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Aucune</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Choisissez un ministère ou une province.</p>

                {/* Problème */}
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm font-semibold">Description du problème *</Label>
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
                  <Label htmlFor="solution" className="text-sm font-semibold">Solution proposée *</Label>
                  <Textarea
                    id="solution"
                    placeholder="Proposez une solution concrète..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    required
                    className="min-h-[100px] rounded-xl"
                  />
                </div>

                {/* Impact (optionnel) */}
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-sm font-semibold">Impact attendu (optionnel)</Label>
                  <Textarea
                    id="impact"
                    placeholder="Quel impact positif cette proposition aurait-elle ?"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Envoi…" : "Soumettre la proposition"}
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

          {/* Mes propositions en attente (citoyen connecté) */}
          {currentUser && currentUser.role === "citizen" && (
            <div className="mb-8 rounded-2xl border border-civic-yellow/30 bg-civic-yellow-light/30 p-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                Mes propositions en attente
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Ces propositions n’ont pas encore de réponse officielle. Elles apparaîtront dans la liste publique une fois qu’un responsable aura publié une réponse.
              </p>
              {loadingEnAttente ? (
                <p className="text-sm text-muted-foreground">Chargement…</p>
              ) : proposalsEnAttente.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune proposition en attente.</p>
              ) : (
                <ul className="space-y-2">
                  {proposalsEnAttente.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/propositions/${p.id}`}
                        className="block rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                      >
                        <span className="line-clamp-1">{p.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{p.date}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Proposals list */}
          <div className="space-y-4">
            {loadingProposals ? (
              <p className="py-12 text-center text-muted-foreground">Chargement des propositions…</p>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                <p className="font-medium">Aucune proposition pour le moment.</p>
                <p className="mt-1 text-sm">Les données sont chargées depuis la plateforme. Soumettez la première proposition !</p>
              </div>
            ) : (
              filtered.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 civic-card-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[proposal.status] || ""}`}>
                        {proposal.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{proposal.date}</span>
                    </div>
                    <Link to={`/propositions/${proposal.id}`} className="block group/link">
                      <h3 className="mb-1 font-display text-lg font-semibold text-foreground group-hover/link:text-primary group-hover/link:underline">{proposal.title}</h3>
                      <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{proposal.problem}</p>
                    </Link>
                    <p className="text-sm text-foreground/80">
                      <span className="font-medium text-primary">Solution :</span> {proposal.solution}
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
            ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Propositions;
