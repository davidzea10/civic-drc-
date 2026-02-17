import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import {
  getProposals,
  getAdminStats,
  patchAdminProposalStatus,
  patchAdminProposalPublish,
  postAdminProposalResponse,
  type ApiProposition,
  type AdminStats,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BarChart3, AlertTriangle } from "lucide-react";

const STATUT_OPTIONS = [
  { value: "reçue", label: "Reçue" },
  { value: "en_analyse", label: "En analyse" },
  { value: "retenue", label: "Retenue" },
  { value: "en_cours_execution", label: "En cours d'exécution" },
];

const AdminProposals = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ApiProposition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statutFilter, setStatutFilter] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [responseById, setResponseById] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const isAllowed = currentUser?.role === "admin" || currentUser?.role === "ministry";

  const fetchProposals = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, statsData] = await Promise.all([
        getProposals(
          statutFilter
            ? { statut: statutFilter, officielles: false }
            : { officielles: false },
          token
        ),
        getAdminStats(token).catch(() => null),
      ]);
      setProposals(list);
      setStats(statsData ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, [token, statutFilter]);

  useEffect(() => {
    if (!isAllowed || !token) {
      navigate("/accueil");
      return;
    }
    fetchProposals();
  }, [isAllowed, token, navigate, fetchProposals]);

  const handleStatusChange = async (id: string, statut: string) => {
    if (!token) return;
    setUpdatingId(id);
    try {
      await patchAdminProposalStatus(id, statut, token);
      await fetchProposals();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResponseSubmit = async (id: string) => {
    const reponse_officielle = responseById[id]?.trim();
    if (!token || !reponse_officielle) return;
    setUpdatingId(id);
    try {
      await postAdminProposalResponse(id, reponse_officielle, token);
      setResponseById((prev) => ({ ...prev, [id]: "" }));
      await fetchProposals();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePublishWithoutResponse = async (id: string) => {
    if (!token) return;
    setPublishingId(id);
    try {
      await patchAdminProposalPublish(id, token);
      await fetchProposals();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingId(null);
    }
  };

  if (!isAllowed) {
    return null;
  }

  return (
    <Layout>
      <div className="civic-container civic-section max-w-6xl mx-auto px-3 sm:px-4">
        <Link
          to="/accueil"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Gestion des propositions
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Modifiez le statut, publiez avec ou sans réponse officielle. Consultez le score de modération IA.
        </p>

        {stats && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Propositions</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.propositions.total}</p>
              <p className="text-xs text-muted-foreground">dont {stats.propositions.publiees} publiées</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">À modérer</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.propositions.a_moderer}</p>
              <p className="text-xs text-muted-foreground">propositions signalées IA</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Commentaires</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.commentaires.total}</p>
              <p className="text-xs text-muted-foreground">dont {stats.commentaires.a_moderer} à modérer</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="text-xs font-medium text-muted-foreground">Par statut</span>
              <ul className="mt-1 text-xs text-foreground space-y-0.5">
                {Object.entries(stats.propositions.par_statut || {}).map(([s, n]) => (
                  <li key={s}>{s}: {n}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-foreground">Filtrer par statut :</label>
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Tous</option>
            {STATUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-civic-red-light p-3 text-sm text-civic-red">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted-foreground">Chargement…</p>
        ) : proposals.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Aucune proposition à afficher.
          </div>
        ) : (
          <div className="space-y-6 overflow-x-hidden">
            {proposals.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-6"
              >
                <div className="mb-4">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    {p.statut}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.cree_le
                      ? new Date(p.cree_le).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {p.probleme}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {p.solution}
                </p>
                <div className="flex flex-wrap gap-2 mb-2 items-center">
                  {p.ministeres?.nom && (
                    <span className="text-xs text-primary">{p.ministeres.nom}</span>
                  )}
                  {p.provinces?.nom && (
                    <span className="text-xs text-civic-green">{p.provinces.nom}</span>
                  )}
                  {(p.a_moderer != null || p.taux_moderation != null) && (
                    <span className="text-xs text-amber-600 font-medium">
                      Modération IA : {p.taux_moderation ?? 0}/100
                      {p.a_moderer && " — Signalé"}
                    </span>
                  )}
                </div>

                <div className="border-t border-border pt-4 mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Statut
                    </label>
                    <select
                      value={p.statut}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      disabled={updatingId === p.id}
                      className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      {STATUT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {p.reponse_officielle && (
                    <div className="rounded-xl border border-civic-green/30 bg-civic-green-light/20 p-3">
                      <p className="text-xs font-semibold text-civic-green mb-1">
                        Réponse officielle actuelle
                      </p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {p.reponse_officielle}
                      </p>
                    </div>
                  )}

                  {!p.reponse_officielle && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={publishingId === p.id}
                        onClick={() => handlePublishWithoutResponse(p.id)}
                      >
                        {publishingId === p.id ? "Publication…" : "Publier sans réponse"}
                      </Button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {p.reponse_officielle ? "Modifier la réponse officielle" : "Réponse officielle"}
                    </label>
                    <Textarea
                      placeholder="Saisir ou modifier la réponse officielle..."
                      value={responseById[p.id] ?? ""}
                      onChange={(e) =>
                        setResponseById((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      className="min-h-[100px] rounded-xl"
                    />
                    <Button
                      type="button"
                      className="mt-2"
                      disabled={
                        updatingId === p.id ||
                        !(responseById[p.id]?.trim())
                      }
                      onClick={() => handleResponseSubmit(p.id)}
                    >
                      {updatingId === p.id ? "Envoi…" : "Publier la réponse"}
                    </Button>
                  </div>
                </div>

                <Link
                  to={`/propositions/${p.id}`}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Voir la proposition en détail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProposals;
