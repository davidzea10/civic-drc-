import Layout from "@/components/Layout";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  ThumbsUp,
  Building2,
  MapPin,
} from "lucide-react";

const overviewStats = [
  { label: "Total propositions", value: "—", icon: FileText, change: "—", color: "text-civic-blue bg-civic-blue-light" },
  { label: "Citoyens actifs", value: "—", icon: Users, change: "—", color: "text-civic-green bg-civic-green-light" },
  { label: "Propositions acceptées", value: "—", icon: CheckCircle2, change: "—", color: "text-civic-green bg-civic-green-light" },
  { label: "En attente", value: "—", icon: Clock, change: "—", color: "text-accent bg-civic-yellow-light" },
];

const topMinistries = [
  { name: "Santé", proposals: 0, resolved: 0 },
  { name: "Infrastructures", proposals: 0, resolved: 0 },
  { name: "Éducation", proposals: 0, resolved: 0 },
  { name: "Eau & Hydraulique", proposals: 0, resolved: 0 },
  { name: "Énergie", proposals: 0, resolved: 0 },
];

const topProvinces = [
  { name: "Kinshasa", proposals: 0 },
  { name: "Nord-Kivu", proposals: 0 },
  { name: "Haut-Katanga", proposals: 0 },
  { name: "Sud-Kivu", proposals: 0 },
  { name: "Ituri", proposals: 0 },
];

const recentActivity: { text: string; time: string }[] = [];

const Dashboard = () => {
  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Tableau de bord
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Vue d'ensemble
            </h1>
            <p className="mt-2 text-muted-foreground">
              Statistiques et indicateurs clés de la plateforme CIVIC-DRC.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="civic-stat-card bg-card">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.change !== "—" && (
                  <span className={`mt-1 inline-block text-xs font-medium ${stat.change.startsWith("+") ? "text-civic-green" : "text-civic-red"}`}>
                    {stat.change} ce mois
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Ministries */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Top Ministères</h3>
              </div>
              <div className="space-y-3">
                {topMinistries.map((m) => (
                  <div key={m.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{m.name}</span>
                      <span className="text-muted-foreground">{m.proposals}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${m.proposals ? (m.resolved / m.proposals) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Provinces */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-civic-green" />
                <h3 className="font-display text-lg font-semibold text-foreground">Top Provinces</h3>
              </div>
              <div className="space-y-3">
                {topProvinces.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{p.proposals}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-card p-6 civic-card-shadow">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-display text-lg font-semibold text-foreground">Activité récente</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">Aucune activité récente. Données en cours de connexion.</p>
                ) : (
                  recentActivity.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm text-foreground">{a.text}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
