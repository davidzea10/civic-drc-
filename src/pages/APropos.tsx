import Layout from "@/components/Layout";
import {
  Users,
  Target,
  Shield,
  Brain,
  Heart,
  Globe,
  Eye,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  MessageSquare,
  Send,
  BarChart3,
  Clock,
  Layers,
  UserCheck,
  Sparkles,
  HandHeart,
  Scale,
} from "lucide-react";
import drcFlag from "@/assets/drc-flag.png";
import presidentImg from "@/assets/Président.jpg";

const values = [
  {
    icon: Eye,
    title: "Transparence",
    description:
      "Les réponses officielles et le suivi des propositions sont accessibles à tous les citoyens.",
    color: "bg-civic-blue-light text-civic-blue",
  },
  {
    icon: Scale,
    title: "Responsabilité",
    description:
      "Chaque acteur de la plateforme est responsable de ses contributions et de ses engagements.",
    color: "bg-civic-red-light text-civic-red",
  },
  {
    icon: Users,
    title: "Inclusion",
    description:
      "La plateforme est conçue pour être accessible à tous les Congolais, sans distinction.",
    color: "bg-civic-green-light text-civic-green",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Nous utilisons les technologies numériques les plus avancées pour moderniser la gouvernance.",
    color: "bg-civic-yellow-light text-accent-foreground",
  },
  {
    icon: HandHeart,
    title: "Respect",
    description:
      "Le dialogue citoyen se fait dans le respect mutuel et la dignité de chaque participant.",
    color: "bg-purple-100 text-purple-600",
  },
];

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Le citoyen soumet une proposition",
    description:
      "Le citoyen décrit un problème, propose une solution et précise l'impact attendu sur sa communauté.",
    color: "bg-civic-blue-light text-civic-blue",
  },
  {
    number: "02",
    icon: Shield,
    title: "La proposition est analysée et modérée",
    description:
      "Des modérateurs vérifient la qualité, la pertinence et le respect des règles de la plateforme.",
    color: "bg-civic-yellow-light text-accent-foreground",
  },
  {
    number: "03",
    icon: Send,
    title: "Elle est transmise au ministère concerné",
    description:
      "La proposition validée est automatiquement dirigée vers le ministère compétent pour traitement.",
    color: "bg-civic-green-light text-civic-green",
  },
  {
    number: "04",
    icon: MessageSquare,
    title: "Le ministère publie une réponse officielle",
    description:
      "Le responsable ministériel consulte la proposition et publie une réponse officielle visible par tous.",
    color: "bg-civic-red-light text-civic-red",
  },
];

const objectives = [
  {
    icon: Globe,
    title: "Digitaliser la communication publique",
    description: "Moderniser les échanges entre citoyens et institutions grâce au numérique.",
  },
  {
    icon: Clock,
    title: "Réduire les délais de réponse",
    description: "Accélérer le traitement des propositions et les réponses officielles.",
  },
  {
    icon: Layers,
    title: "Centraliser les propositions citoyennes",
    description: "Regrouper toutes les propositions sur une plateforme unique et accessible.",
  },
  {
    icon: BarChart3,
    title: "Améliorer la gouvernance participative",
    description: "Renforcer la démocratie en impliquant les citoyens dans les décisions publiques.",
  },
];

const audiences = [
  {
    icon: Users,
    title: "Citoyens",
    description:
      "Tout citoyen congolais souhaitant exprimer ses préoccupations et proposer des solutions pour sa communauté.",
    color: "bg-civic-blue",
  },
  {
    icon: Building2,
    title: "Responsables ministériels",
    description:
      "Les responsables de chaque ministère qui consultent et répondent aux propositions citoyennes.",
    color: "bg-civic-green",
  },
  {
    icon: UserCheck,
    title: "Organisations publiques",
    description:
      "Les organisations et institutions publiques impliquées dans la gouvernance et le développement.",
    color: "bg-accent",
  },
  {
    icon: Shield,
    title: "Institutions de la RDC",
    description:
      "Les institutions nationales et provinciales de la République Démocratique du Congo.",
    color: "bg-civic-red",
  },
];

const APropos = () => {
  return (
    <Layout>
      {/* 1️⃣ Présentation générale */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="mx-auto max-w-4xl text-center">
            <img
              src={drcFlag}
              alt="Drapeau RDC"
              className="mx-auto mb-6 h-16 w-28 rounded-lg object-cover shadow-lg"
            />
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              🏛 À propos de CIVIC-DRC
            </span>
            <h1 className="mb-6 font-display text-3xl font-bold text-foreground md:text-5xl">
              À propos de <span className="text-primary">CIVIC-DRC</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              <strong className="text-foreground">CIVIC-DRC</strong> est une plateforme numérique innovante conçue pour
              renforcer la communication entre les citoyens et les institutions gouvernementales de la{" "}
              <strong className="text-foreground">République Démocratique du Congo</strong>.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Elle permet aux citoyens d'exprimer leurs préoccupations, de soumettre des propositions et de suivre
              les réponses officielles des ministères.
            </p>
          </div>
        </div>
      </section>

      {/* 2️⃣ Notre Mission & 3️⃣ Notre Vision */}
      <section className="civic-section bg-secondary/50">
        <div className="civic-container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-3xl border border-border bg-card p-8 civic-card-shadow">
              <div className="mb-5 inline-flex rounded-xl bg-civic-blue-light p-3">
                <Target className="h-7 w-7 text-civic-blue" />
              </div>
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground md:text-3xl">
                🎯 Notre Mission
              </h2>
              <ul className="space-y-3">
                {[
                  "Faciliter la participation citoyenne",
                  "Promouvoir la transparence gouvernementale",
                  "Renforcer le dialogue entre l'État et la population",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-civic-green" />
                    <span className="text-base text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-border bg-card p-8 civic-card-shadow">
              <div className="mb-5 inline-flex rounded-xl bg-civic-yellow-light p-3">
                <Lightbulb className="h-7 w-7 text-accent-foreground" />
              </div>
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground md:text-3xl">
                🌍 Notre Vision
              </h2>
              <p className="text-base leading-relaxed text-foreground/80">
                Construire une <strong className="text-foreground">RDC</strong> où chaque citoyen peut s'exprimer
                librement et participer activement aux décisions publiques grâce aux technologies numériques.
              </p>
              <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-4 border border-primary/10">
                <p className="text-sm italic text-muted-foreground">
                  « Une nation forte se construit avec la voix de chaque citoyen. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Comment fonctionne la plateforme ? */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              ⚙ Fonctionnement
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Comment fonctionne la plateforme ?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Un processus simple et transparent en 4 étapes pour faire entendre votre voix.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="group relative">
                <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:civic-elevated-shadow h-full">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-display text-3xl font-extrabold text-primary/20">
                      {step.number}
                    </span>
                    <div className={`inline-flex rounded-xl p-2.5 ${step.color}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Nos Valeurs */}
      <section className="civic-section bg-secondary/50">
        <div className="civic-container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              🔐 Nos Valeurs
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Les valeurs qui nous guident
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:civic-elevated-shadow"
              >
                <div
                  className={`mx-auto mb-4 inline-flex rounded-xl p-3 ${v.color}`}
                >
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Objectifs du projet */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              📊 Objectifs
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Objectifs du projet
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {objectives.map((obj, i) => (
              <div
                key={obj.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 civic-card-shadow"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <obj.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
                    {obj.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7️⃣ À qui s'adresse CIVIC-DRC ? */}
      <section className="civic-section bg-secondary/50">
        <div className="civic-container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              👥 Public cible
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              À qui s'adresse CIVIC-DRC ?
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((aud) => (
              <div
                key={aud.title}
                className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:civic-elevated-shadow"
              >
                <div className={`h-2 ${aud.color}`} />
                <div className="p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <aud.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    {aud.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {aud.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les acteurs du système */}
      <section className="civic-section">
        <div className="civic-container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                🔧 Acteurs
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Les acteurs du système
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  role: "Citoyen",
                  desc: "Soumet des propositions, vote et commente les propositions des autres citoyens.",
                  emoji: "👤",
                  color: "border-l-civic-blue",
                },
                {
                  role: "Modérateur",
                  desc: "Vérifie et valide les propositions avant leur publication sur la plateforme.",
                  emoji: "🛡️",
                  color: "border-l-accent",
                },
                {
                  role: "Responsable ministériel",
                  desc: "Consulte les propositions adressées à son ministère et publie des réponses officielles.",
                  emoji: "🏛️",
                  color: "border-l-civic-green",
                },
                {
                  role: "Administrateur système",
                  desc: "Gère la plateforme, crée les comptes ministériels et supervise les configurations.",
                  emoji: "⚙️",
                  color: "border-l-civic-red",
                },
              ].map((actor) => (
                <div
                  key={actor.role}
                  className={`rounded-xl border border-border border-l-4 ${actor.color} bg-card p-5 civic-card-shadow transition-all hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{actor.emoji}</span>
                    <div>
                      <h4 className="font-display font-semibold text-foreground">
                        {actor.role}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {actor.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default APropos;
