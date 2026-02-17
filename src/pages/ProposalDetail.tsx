import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Building2, MapPin, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProposal,
  getProposalVotes,
  postProposalVote,
  getProposalComments,
  postProposalComment,
  type ApiPropositionDetail,
  type ApiVotes,
  type ApiComment,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const statutLabel: Record<string, string> = {
  reçue: "En attente",
  en_analyse: "En analyse",
  retenue: "Acceptée",
  en_cours_execution: "En cours d'exécution",
};

const statutColor: Record<string, string> = {
  reçue: "bg-civic-yellow-light text-accent-foreground",
  en_analyse: "bg-civic-blue-light text-civic-blue",
  retenue: "bg-civic-green-light text-civic-green",
  en_cours_execution: "bg-civic-green-light text-civic-green",
};

const ProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token, currentUser } = useAuth();
  const [proposal, setProposal] = useState<ApiPropositionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<ApiVotes | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [lastCommentModeration, setLastCommentModeration] = useState<{ taux: number; a_moderer: boolean } | null>(null);

  const fetchVotes = useCallback(() => {
    if (!id) return;
    getProposalVotes(id, token ?? undefined)
      .then(setVotes)
      .catch(() => setVotes({ likes: 0, dislikes: 0, userVote: null }));
  }, [id, token]);

  const fetchComments = useCallback(() => {
    if (!id) return;
    getProposalComments(id)
      .then(setComments)
      .catch(() => setComments([]));
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getProposal(id)
      .then(setProposal)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchVotes();
  }, [id, fetchVotes]);

  useEffect(() => {
    if (!id) return;
    fetchComments();
  }, [id, fetchComments]);

  if (loading) {
    return (
      <Layout>
        <div className="civic-container civic-section">
          <p className="text-center text-muted-foreground">Chargement de la proposition…</p>
        </div>
      </Layout>
    );
  }

  if (error || !proposal) {
    return (
      <Layout>
        <div className="civic-container civic-section">
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">{error ?? "Proposition introuvable."}</p>
            <Link to="/propositions" className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:underline">
              <ArrowLeft className="h-4 w-4" /> Retour aux propositions
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const dateStr = proposal.cree_le
    ? new Date(proposal.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";
  const entity = proposal.ministeres?.nom ?? proposal.provinces?.nom ?? "—";

  return (
    <Layout>
      <div className="civic-container civic-section max-w-4xl mx-auto px-3 sm:px-4">
        <Link
          to="/propositions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux propositions
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statutColor[proposal.statut] ?? "bg-secondary text-foreground"}`}>
              {statutLabel[proposal.statut] ?? proposal.statut}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {dateStr}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {proposal.ministeres ? (
                <Building2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-civic-green" />
              )}
              {entity}
            </span>
            {proposal.utilisateurs?.nom && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" /> {proposal.utilisateurs.nom}
              </span>
            )}
          </div>

          <h1 className="font-display text-xl font-bold text-foreground md:text-2xl mb-4">
            {proposal.probleme}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" /> Problème décrit
              </h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{proposal.probleme}</p>
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                Solution proposée
              </h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{proposal.solution}</p>
            </div>

            {proposal.impact && (
              <div>
                <h2 className="mb-2 text-sm font-semibold text-foreground">Impact attendu</h2>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{proposal.impact}</p>
              </div>
            )}

            {proposal.reponse_officielle && (
              <div className="rounded-xl border border-civic-green/30 bg-civic-green-light/30 p-4">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-civic-green">
                  <MessageSquare className="h-4 w-4" /> Réponse officielle
                </h2>
                <p className="whitespace-pre-wrap text-sm text-foreground">{proposal.reponse_officielle}</p>
              </div>
            )}

            {/* Votes */}
            <div className="border-t border-border pt-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Votes</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {votes ? `${votes.likes} like(s), ${votes.dislikes} dislike(s)` : "—"}
                </span>
                {voteError && (
                  <p className="text-sm text-civic-red">{voteError}</p>
                )}
                {currentUser && token && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={votes?.userVote === "like" ? "default" : "outline"}
                      size="sm"
                      disabled={voteLoading}
                      onClick={async () => {
                        if (!id || !token) {
                          setVoteError("Connectez-vous pour voter.");
                          return;
                        }
                        setVoteError(null);
                        setVoteLoading(true);
                        try {
                          await postProposalVote(id, "like", token);
                          await fetchVotes();
                        } catch (err) {
                          const msg = err instanceof Error ? err.message : "Impossible d’enregistrer le vote.";
                          setVoteError(msg);
                          console.error("[Vote like]", err);
                        } finally {
                          setVoteLoading(false);
                        }
                      }}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" /> Like
                    </Button>
                    <Button
                      type="button"
                      variant={votes?.userVote === "dislike" ? "default" : "outline"}
                      size="sm"
                      disabled={voteLoading}
                      onClick={async () => {
                        if (!id || !token) {
                          setVoteError("Connectez-vous pour voter.");
                          return;
                        }
                        setVoteError(null);
                        setVoteLoading(true);
                        try {
                          await postProposalVote(id, "dislike", token);
                          await fetchVotes();
                        } catch (err) {
                          const msg = err instanceof Error ? err.message : "Impossible d’enregistrer le vote.";
                          setVoteError(msg);
                          console.error("[Vote dislike]", err);
                        } finally {
                          setVoteLoading(false);
                        }
                      }}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" /> Dislike
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Commentaires */}
            <div className="border-t border-border pt-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Commentaires</h2>
              {comments.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun commentaire pour l’instant.</p>
              )}
              <ul className="mt-3 space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-sm text-foreground">{c.contenu}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.utilisateurs?.nom ?? "Anonyme"} · {c.cree_le ? new Date(c.cree_le).toLocaleString("fr-FR") : ""}
                    </p>
                  </li>
                ))}
              </ul>
              {currentUser && token && (
                <form
                  className="mt-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!id || !commentText.trim()) return;
                    setCommentError(null);
                    setLastCommentModeration(null);
                    setCommentSubmitting(true);
                    try {
                      const data = await postProposalComment(id, commentText.trim(), token);
                      setLastCommentModeration({
                        taux: data.taux_moderation ?? 0,
                        a_moderer: Boolean(data.a_moderer),
                      });
                      setCommentText("");
                      fetchComments();
                    } catch (err) {
                      setCommentError(err instanceof Error ? err.message : "Erreur lors de l’envoi.");
                    } finally {
                      setCommentSubmitting(false);
                    }
                  }}
                >
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px] rounded-xl"
                    required
                  />
                  {commentError && (
                    <p className="mt-1 text-sm text-civic-red">{commentError}</p>
                  )}
                  {lastCommentModeration && (
                    <div className="mt-2 rounded-xl border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-2">
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                        Score modération IA : {lastCommentModeration.taux}/100
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${Math.min(100, lastCommentModeration.taux)}%` }}
                        />
                      </div>
                      {lastCommentModeration.a_moderer && (
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Ce commentaire a été signalé à l&apos;admin (propos possiblement inappropriés). Il peut être publié ou non.
                        </p>
                      )}
                    </div>
                  )}
                  <Button type="submit" className="mt-2" disabled={commentSubmitting}>
                    {commentSubmitting ? "Envoi…" : "Publier"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProposalDetail;
