import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Building2,
  MapPin,
  MessageSquare,
  ThumbsUp,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
} from "lucide-react";
import drcFlag from "@/assets/drc-flag.png";
import heroBg from "@/assets/hero-bg.jpg";
import presidentImg from "@/assets/president.jpg";
import PresidentSlider from "@/components/PresidentSlider";

const stats = [
  { label: "Citoyens inscrits", value: "12,450+", icon: Users },
  { label: "Propositions soumises", value: "3,200+", icon: FileText },
  { label: "Problèmes résolus", value: "890+", icon: CheckCircle2 },
  { label: "Ministères connectés", value: "26", icon: Building2 },
];

const features = [
  {
    icon: MessageSquare,
    title: "Soumettez vos propositions",
    description: "Décrivez un problème, proposez une solution et mesurez l'impact attendu sur votre communauté.",
    color: "bg-civic-blue-light text-civic-blue",
  },
  {
    icon: Building2,
    title: "Ministères & Provinces",
    description: "Naviguez par ministère national ou gouvernement provincial pour cibler vos propositions.",
    color: "bg-civic-yellow-light text-civic-yellow",
  },
  {
    icon: ThumbsUp,
    title: "Votez & Commentez",
    description: "Soutenez les meilleures propositions, commentez et participez au débat citoyen.",
    color: "bg-civic-green-light text-civic-green",
  },
  {
    icon: Shield,
    title: "Modération & Transparence",
    description: "Chaque proposition est vérifiée par des modérateurs pour garantir la qualité du contenu.",
    color: "bg-civic-red-light text-civic-red",
  },
  {
    icon: TrendingUp,
    title: "Suivi en temps réel",
    description: "Suivez le statut de vos propositions : en attente, acceptée, en cours de traitement.",
    color: "bg-civic-blue-light text-civic-blue",
  },
  {
    icon: MapPin,
    title: "Impact local",
    description: "Les réponses officielles des autorités sont publiées directement sur la plateforme.",
    color: "bg-civic-yellow-light text-civic-yellow",
  },
];

const recentProposals = [
  {
    title: "Amélioration de l'accès à l'eau potable à Lubumbashi",
    ministry: "Ministère des Ressources Hydrauliques",
    status: "En cours",
    votes: 342,
    comments: 56,
  },
  {
    title: "Réhabilitation des routes nationales RN1 et RN4",
    ministry: "Ministère des Infrastructures",
    status: "Acceptée",
    votes: 891,
    comments: 123,
  },
  {
    title: "Programme de bourses pour les étudiants du Sud-Kivu",
    ministry: "Ministère de l'Éducation",
    status: "En attente",
    votes: 215,
    comments: 38,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with President Photo */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="civic-hero-overlay absolute inset-0" />
        <div className="civic-container relative z-10 py-24 md:py-36">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="max-w-3xl flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 backdrop-blur-sm">
                <img src={drcFlag} alt="RDC" className="h-5 w-7 rounded-sm object-cover" />
                <span className="text-sm font-medium text-primary-foreground">
                  République Démocratique du Congo
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
                Votre voix,{" "}
                <span className="text-accent">notre avenir</span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
                CIVIC-DRC est la plateforme citoyenne qui facilite la communication entre la population
                et le gouvernement. Soumettez vos propositions, votez et participez à construire un Congo meilleur.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/propositions"
                  className="civic-gradient-bg inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                >
                  Soumettre une proposition
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3.5 font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
                >
                  En savoir plus
                </Link>
              </div>
            </div>

            {/* President Photo in Hero */}
            <div className="hidden md:block relative animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                  <img
                    src={presidentImg}
                    alt="S.E. Félix Tshisekedi"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-accent px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold text-accent-foreground">S.E. Félix Tshisekedi</p>
                  <p className="text-[10px] text-accent-foreground/70">Président de la RDC</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-3 -left-3 h-20 w-20 rounded-xl border-2 border-accent/40 -z-10" />
                <div className="absolute -bottom-3 -right-8 h-16 w-16 rounded-full border-2 border-white/20 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-12 relative z-20">
        <div className="civic-container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="civic-stat-card bg-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <stat.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="font-display text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* President Slider Section */}
      <PresidentSlider />

      {/* Features Section */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Fonctionnalités
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              CIVIC-DRC offre un espace où chaque citoyen peut participer activement à la gouvernance de son pays.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:civic-elevated-shadow"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Proposals */}
      <section className="civic-section bg-secondary/50">
        <div className="civic-container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Dernières propositions
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Ce que disent les citoyens
              </h2>
            </div>
            <Link
              to="/propositions"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Voir toutes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recentProposals.map((proposal) => (
              <div
                key={proposal.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 civic-card-shadow"
              >
                <span
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    proposal.status === "Acceptée"
                      ? "bg-civic-green-light text-civic-green"
                      : proposal.status === "En cours"
                      ? "bg-civic-blue-light text-civic-blue"
                      : "bg-civic-yellow-light text-accent-foreground"
                  }`}
                >
                  {proposal.status}
                </span>
                <h3 className="mb-2 font-display text-base font-semibold leading-snug text-foreground">
                  {proposal.title}
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">{proposal.ministry}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {proposal.votes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> {proposal.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/propositions"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
          >
            Voir toutes les propositions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="civic-gradient-bg relative overflow-hidden rounded-3xl p-8 text-center md:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent" />
            </div>
            <div className="relative z-10">
              <img src={drcFlag} alt="RDC" className="mx-auto mb-6 h-12 w-20 rounded-md object-cover shadow-lg" />
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Rejoignez le mouvement citoyen
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
                Ensemble, construisons une RDC où chaque voix compte. Inscrivez-vous et commencez à soumettre vos propositions dès aujourd'hui.
              </p>
              <Link
                to="/propositions"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground shadow-lg transition-all hover:brightness-110"
              >
                Commencer maintenant
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
