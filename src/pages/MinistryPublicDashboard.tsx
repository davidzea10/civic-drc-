import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  FileText, CheckCircle2, Clock, TrendingUp, ThumbsUp, ThumbsDown,
  MapPin, BarChart3, ArrowUpRight, AlertCircle, MessageSquare,
  ArrowLeft, Eye,
} from "lucide-react";
import { getMinistryBySlug, getProposalsByMinistry, type Proposal } from "@/data/ministries";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "Acceptée": "bg-civic-green-light text-civic-green",
  "En cours": "bg-civic-blue-light text-civic-blue",
  "En attente": "bg-civic-yellow-light text-accent-foreground",
  "Refusée": "bg-civic-red-light text-civic-red",
};

const MinistryPublicDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const ministry = slug ? getMinistryBySlug(slug) : undefined;
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [expandedProposal, setExpandedProposal] = useState<number | null>(null);

  if (!ministry) {
    return (
      <Layout>
        <section className="civic-section">
          <div className="civic-container text-center py-20">
            <p className="text-2xl font-bold text-foreground mb-4">Ministère introuvable</p>
            <Link to="/ministeres" className="text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour aux ministères
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const proposals = getProposalsByMinistry(ministry.name);
  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === "Acceptée").length;
  const pendingProposals = proposals.filter((p) => p.status === "En attente").length;
  const inProgressProposals = proposals.filter((p) => p.status === "En cours").length;
  const totalLikes = proposals.reduce((sum, p) => sum + p.likes, 0);
  const totalDislikes = proposals.reduce((sum, p) => sum + p.dislikes, 0);
  const totalComments = proposals.reduce((sum, p) => sum + p.comments, 0);
  const avgSatisfaction = totalLikes + totalDislikes > 0
    ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100)
    : 0;

  const provinceDistribution = proposals.reduce((acc, p) => {
    acc[p.province] = (acc[p.province] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedProvinces = Object.entries(provinceDistribution).sort(([, a], [, b]) => b - a);

  const filteredProposals = filterStatus === "Tous"
    ? proposals
    : proposals.filter((p) => p.status === filterStatus);

  const stats = [
    { label: "Total propositions", value: totalProposals, icon: FileText, color: "text-civic-blue bg-civic-blue-light", positive: true, sub: `${inProgressProposals} en cours` },
    { label: "Acceptées", value: acceptedProposals, icon: CheckCircle2, color: "text-civic-green bg-civic-green-light", positive: true, sub: `${totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0}% du total` },
    { label: "En attente", value: pendingProposals, icon: Clock, color: "text-accent bg-civic-yellow-light", positive: false, sub: "À traiter" },
    { label: "Satisfaction", value: `${avgSatisfaction}%`, icon: ThumbsUp, color: "text-primary bg-primary/10", positive: true, sub: `${totalLikes} votes positifs` },
  ];

  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          {/* Back link */}
          <Link
            to="/ministeres"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux ministères
          </Link>

          {/* Header */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 civic-card-shadow">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{ministry.icon}</span>
              <div>
                <span className="mb-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Tableau de bord public
                </span>
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {ministry.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{ministry.description}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="civic-stat-card bg-card">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${stat.positive ? "text-civic-green" : "text-accent-foreground"}`}>
                  {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Province Distribution */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-civic-green" />
                <h3 className="font-display text-lg font-semibold text-foreground">Répartition par province</h3>
              </div>
              {sortedProvinces.length > 0 ? (
                <div className="space-y-3">
                  {sortedProvinces.map(([province, count], i) => (
                    <div key={province}>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                          {province}
                        </span>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                      <div className="mt-1 ml-8 h-2 rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(count / (sortedProvinces[0]?.[1] || 1)) * 100}%` }} />
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
                <h3 className="font-display text-lg font-semibold text-foreground">Répartition par statut</h3>
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
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.bgColor} ${item.textColor}`}>{item.count}</span>
                    </div>
                    <div className="mt-1 h-3 rounded-full bg-secondary">
                      <div className={`h-3 rounded-full ${item.color} transition-all`} style={{ width: `${(item.count / (totalProposals || 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux de résolution</span>
                  <span className="text-lg font-bold text-primary">
                    {totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-civic-green transition-all" style={{ width: `${totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-semibold text-foreground">Engagement citoyen</h3>
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
                  <span className="text-xl font-bold text-civic-red">{totalDislikes}</span>
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

          {/* Proposals List */}
          <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Propositions citoyennes</h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{totalProposals}</span>
              </div>
              <div className="flex flex-wrap gap-2">
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
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[proposal.status] || ""}`}>
                          {proposal.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{proposal.date}</span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">📍 {proposal.province}</span>
                      </div>
                      <h4 className="font-display text-base font-semibold text-foreground">{proposal.title}</h4>
                      <p className="text-sm text-muted-foreground">{proposal.problem}</p>

                      {expandedProposal === proposal.id && (
                        <div className="mt-2 space-y-3 rounded-lg bg-secondary/30 p-4 animate-fade-in">
                          <div>
                            <p className="text-xs font-semibold text-primary mb-1">💡 Solution proposée</p>
                            <p className="text-sm text-foreground/80">{proposal.solution}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-primary mb-1">👤 Auteur</p>
                            <p className="text-sm text-foreground/80">{proposal.author}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5 text-civic-green" /> {proposal.likes}</span>
                          <span className="flex items-center gap-1"><ThumbsDown className="h-3.5 w-3.5 text-civic-red" /> {proposal.dislikes}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5 text-civic-blue" /> {proposal.comments}</span>
                        </div>
                        <button
                          onClick={() => setExpandedProposal(expandedProposal === proposal.id ? null : proposal.id)}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {expandedProposal === proposal.id ? "Moins" : "Détails"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">Aucune proposition pour ce filtre</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinistryPublicDashboard;
