import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Building2,
  MapPin,
  AlertCircle,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Send,
  XCircle,
  LogOut,
} from "lucide-react";
import {
  getMinistryById,
  getProposalsByMinistry,
  allProposals,
  type Proposal,
} from "@/data/ministries";
import MessagesModal from "@/components/MessagesModal";

const statusColors: Record<string, string> = {
  "Acceptée": "bg-civic-green-light text-civic-green",
  "En cours": "bg-civic-blue-light text-civic-blue",
  "En attente": "bg-civic-yellow-light text-accent-foreground",
  "Refusée": "bg-civic-red-light text-civic-red",
};

const MinistryDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [responseText, setResponseText] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [messagesModal, setMessagesModal] = useState<{
    isOpen: boolean;
    proposalId: number;
    proposalTitle: string;
  }>({ isOpen: false, proposalId: 0, proposalTitle: "" });

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ministry") {
      navigate("/");
      return;
    }
    const ministryProposals = getProposalsByMinistry(currentUser.ministryName || "");
    setProposals(ministryProposals);
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "ministry") {
    return null;
  }

  const ministry = currentUser.ministryId
    ? getMinistryById(currentUser.ministryId)
    : undefined;

  // Stats calculations
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === "Acceptée").length;
  const pendingProposals = proposals.filter((p) => p.status === "En attente").length;
  const inProgressProposals = proposals.filter((p) => p.status === "En cours").length;
  const totalLikes = proposals.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = proposals.reduce((sum, p) => sum + p.comments, 0);
  const avgSatisfaction = totalProposals > 0
    ? Math.round(
        (proposals.reduce((sum, p) => sum + p.likes, 0) /
          (proposals.reduce((sum, p) => sum + p.likes + p.dislikes, 0) || 1)) *
          100
      )
    : 0;

  // Province distribution
  const provinceDistribution = proposals.reduce((acc, p) => {
    acc[p.province] = (acc[p.province] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedProvinces = Object.entries(provinceDistribution)
    .sort(([, a], [, b]) => b - a);

  // Filtered proposals
  const filteredProposals =
    filterStatus === "Tous"
      ? proposals
      : proposals.filter((p) => p.status === filterStatus);

  const handleStatusChange = (proposalId: number, newStatus: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: newStatus } : p))
    );
  };

  const handleSendResponse = () => {
    if (selectedProposal && responseText.trim()) {
      // In a real app, this would send to backend
      alert(`✅ Réponse envoyée pour : "${selectedProposal.title}"\n\n${responseText}`);
      setResponseText("");
      setShowResponseModal(false);
      setSelectedProposal(null);
    }
  };

  const stats = [
    {
      label: "Total propositions",
      value: totalProposals.toString(),
      icon: FileText,
      change: `+${Math.floor(Math.random() * 5) + 1} ce mois`,
      color: "text-civic-blue bg-civic-blue-light",
      positive: true,
    },
    {
      label: "Acceptées",
      value: acceptedProposals.toString(),
      icon: CheckCircle2,
      change: `${Math.round((acceptedProposals / (totalProposals || 1)) * 100)}%`,
      color: "text-civic-green bg-civic-green-light",
      positive: true,
    },
    {
      label: "En attente",
      value: pendingProposals.toString(),
      icon: Clock,
      change: "À traiter",
      color: "text-accent bg-civic-yellow-light",
      positive: false,
    },
    {
      label: "Satisfaction",
      value: `${avgSatisfaction}%`,
      icon: ThumbsUp,
      change: `${totalLikes} votes positifs`,
      color: "text-primary bg-primary/10",
      positive: true,
    },
  ];

  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-4xl">{ministry?.icon || "🏛️"}</span>
                  <div>
                    <span className="mb-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      Tableau de bord ministériel
                    </span>
                    <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                      {currentUser.ministryName}
                    </h1>
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ministry?.description || "Gestion des propositions citoyennes"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-border bg-card px-4 py-2 text-right">
                  <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                  <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-primary">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="civic-stat-card bg-card">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                    stat.positive ? "text-civic-green" : "text-accent-foreground"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Province Distribution */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-civic-green" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Répartition par province
                </h3>
              </div>
              {sortedProvinces.length > 0 ? (
                <div className="space-y-3">
                  {sortedProvinces.map(([province, count], i) => (
                    <div key={province}>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {i + 1}
                          </span>
                          {province}
                        </span>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                      <div className="mt-1 ml-8 h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${(count / (sortedProvinces[0]?.[1] || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <MapPin className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">Aucune donnée disponible</p>
                </div>
              )}
            </div>

            {/* Status Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Répartition par statut
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Acceptées", count: acceptedProposals, color: "bg-civic-green", bgColor: "bg-civic-green-light", textColor: "text-civic-green" },
                  { label: "En cours", count: inProgressProposals, color: "bg-civic-blue", bgColor: "bg-civic-blue-light", textColor: "text-civic-blue" },
                  { label: "En attente", count: pendingProposals, color: "bg-accent", bgColor: "bg-civic-yellow-light", textColor: "text-accent-foreground" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-foreground">{item.label}</span>
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.bgColor} ${item.textColor}`}>
                        {item.count}
                      </span>
                    </div>
                    <div className="mt-1 h-3 rounded-full bg-secondary">
                      <div
                        className={`h-3 rounded-full ${item.color} transition-all`}
                        style={{
                          width: `${(item.count / (totalProposals || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux de résolution</span>
                  <span className="text-lg font-bold text-primary">
                    {totalProposals > 0
                      ? Math.round((acceptedProposals / totalProposals) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-civic-green transition-all"
                    style={{
                      width: `${
                        totalProposals > 0
                          ? (acceptedProposals / totalProposals) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Engagement Summary */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Engagement citoyen
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-civic-green-light/50 p-4">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-5 w-5 text-civic-green" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Votes positifs</p>
                      <p className="text-xs text-muted-foreground">Total des likes</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-civic-green">{totalLikes}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-civic-red-light/50 p-4">
                  <div className="flex items-center gap-3">
                    <ThumbsDown className="h-5 w-5 text-civic-red" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Votes négatifs</p>
                      <p className="text-xs text-muted-foreground">Total des dislikes</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-civic-red">
                    {proposals.reduce((sum, p) => sum + p.dislikes, 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-civic-blue-light/50 p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-civic-blue" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Commentaires</p>
                      <p className="text-xs text-muted-foreground">Discussions actives</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-civic-blue">{totalComments}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals Table */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 civic-card-shadow">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Propositions citoyennes
                </h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {totalProposals}
                </span>
              </div>
              <div className="flex gap-2">
                {["Tous", "En attente", "En cours", "Acceptée"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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

            {filteredProposals.length > 0 ? (
              <div className="space-y-4">
                {filteredProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              statusColors[proposal.status] || ""
                            }`}
                          >
                            {proposal.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {proposal.date}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            📍 {proposal.province}
                          </span>
                        </div>
                        <h4 className="mb-1 font-display text-base font-semibold text-foreground">
                          {proposal.title}
                        </h4>
                        <p className="mb-2 text-sm text-muted-foreground">
                          {proposal.problem}
                        </p>
                        <p className="text-sm text-foreground/80">
                          <span className="font-medium text-primary">💡 Solution :</span>{" "}
                          {proposal.solution}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {proposal.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" /> {proposal.dislikes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {proposal.comments}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5">
                            Par {proposal.author}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                        {/* Status change buttons */}
                        <select
                          value={proposal.status}
                          onChange={(e) =>
                            handleStatusChange(proposal.id, e.target.value)
                          }
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Acceptée">Acceptée</option>
                          <option value="Refusée">Refusée</option>
                        </select>

                        <button
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowResponseModal(true);
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90"
                        >
                          <Send className="h-3 w-3" /> Répondre
                        </button>

                        <button
                          onClick={() =>
                            setMessagesModal({
                              isOpen: true,
                              proposalId: proposal.id,
                              proposalTitle: proposal.title,
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          <Eye className="h-3 w-3" /> Messages
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">Aucune proposition trouvée</p>
                <p className="text-sm">
                  {filterStatus !== "Tous"
                    ? `Aucune proposition avec le statut "${filterStatus}"`
                    : "Aucune proposition citoyenne pour votre ministère"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Response Modal */}
      {showResponseModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                📨 Répondre à la proposition
              </h3>
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedProposal(null);
                  setResponseText("");
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-xl bg-secondary/50 p-3">
              <p className="text-sm font-medium text-foreground">
                {selectedProposal.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Par {selectedProposal.author} • {selectedProposal.province}
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Votre réponse officielle
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Rédigez votre réponse officielle au citoyen..."
                className="min-h-[120px] w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedProposal(null);
                  setResponseText("");
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleSendResponse}
                disabled={!responseText.trim()}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      <MessagesModal
        isOpen={messagesModal.isOpen}
        setIsOpen={(open) => setMessagesModal({ ...messagesModal, isOpen: open })}
        proposalTitle={messagesModal.proposalTitle}
        proposalId={messagesModal.proposalId}
      />
    </Layout>
  );
};

export default MinistryDashboard;
