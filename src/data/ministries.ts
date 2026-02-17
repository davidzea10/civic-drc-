export interface Ministry {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface MinistryAccount {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  ministry: string;
  ministryId: number;
  password: string;
  createdAt: string;
}

export interface Proposal {
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

export const ministries: Ministry[] = [
  { id: 1, name: "Ministère de l'Intérieur", slug: "interieur", icon: "🏛️", description: "Sécurité intérieure, administration territoriale et décentralisation", color: "bg-blue-500" },
  { id: 2, name: "Ministère de l'Éducation", slug: "education", icon: "📚", description: "Enseignement primaire, secondaire et professionnel", color: "bg-indigo-500" },
  { id: 3, name: "Ministère de la Santé", slug: "sante", icon: "🏥", description: "Santé publique, hôpitaux et programmes de vaccination", color: "bg-red-500" },
  { id: 4, name: "Ministère des Infrastructures", slug: "infrastructures", icon: "🛣️", description: "Routes, ponts et bâtiments publics", color: "bg-orange-500" },
  { id: 5, name: "Ministère de l'Agriculture", slug: "agriculture", icon: "🌾", description: "Agriculture, élevage et sécurité alimentaire", color: "bg-green-500" },
  { id: 6, name: "Ministère des Finances", slug: "finances", icon: "💰", description: "Budget national, fiscalité et trésor public", color: "bg-yellow-500" },
  { id: 7, name: "Ministère de la Justice", slug: "justice", icon: "⚖️", description: "Système judiciaire, droits humains et réformes légales", color: "bg-purple-500" },
  { id: 8, name: "Ministère des Ressources Hydrauliques", slug: "hydrauliques", icon: "💧", description: "Accès à l'eau potable et gestion des ressources en eau", color: "bg-cyan-500" },
  { id: 9, name: "Ministère de l'Énergie", slug: "energie", icon: "⚡", description: "Électrification, énergie renouvelable et distribution", color: "bg-amber-500" },
  { id: 10, name: "Ministère des Transports", slug: "transports", icon: "🚌", description: "Transport public, aviation civile et navigation", color: "bg-teal-500" },
  { id: 11, name: "Ministère de l'Environnement", slug: "environnement", icon: "🌿", description: "Protection de l'environnement et développement durable", color: "bg-emerald-500" },
  { id: 12, name: "Ministère du Numérique", slug: "numerique", icon: "💻", description: "Transformation digitale et télécommunications", color: "bg-violet-500" },
  { id: 13, name: "Ministère de la Défense", slug: "defense", icon: "🛡️", description: "Forces armées et défense nationale", color: "bg-slate-500" },
  { id: 14, name: "Ministère des Affaires Étrangères", slug: "affaires-etrangeres", icon: "🌍", description: "Diplomatie et coopération internationale", color: "bg-sky-500" },
  { id: 15, name: "Ministère du Commerce", slug: "commerce", icon: "🏪", description: "Commerce intérieur et extérieur", color: "bg-rose-500" },
  { id: 16, name: "Ministère du Travail", slug: "travail", icon: "👷", description: "Emploi, droit du travail et protection sociale", color: "bg-lime-500" },
  { id: 17, name: "Ministère de la Culture et des Arts", slug: "culture", icon: "🎭", description: "Patrimoine culturel, arts et tourisme", color: "bg-fuchsia-500" },
  { id: 18, name: "Ministère des Mines", slug: "mines", icon: "⛏️", description: "Exploitation minière et ressources naturelles", color: "bg-stone-500" },
  { id: 19, name: "Ministère du Plan", slug: "plan", icon: "📋", description: "Planification nationale et statistiques", color: "bg-zinc-500" },
  { id: 20, name: "Ministère de la Communication", slug: "communication", icon: "📡", description: "Médias, presse et communication gouvernementale", color: "bg-pink-500" },
];

// Données chargées depuis l'API (plus de données simulées)
export const allProposals: Proposal[] = [
];

// Default ministry accounts (pre-created)
export const defaultMinistryAccounts: MinistryAccount[] = [
  {
    id: 1,
    fullName: "Dr. Jean Mbuyi",
    email: "j.mbuyi@sante.gouv.cd",
    phone: "+243 812 345 678",
    ministry: "Ministère de la Santé",
    ministryId: 3,
    password: "sante2026",
    createdAt: "10 Fév 2026",
  },
  {
    id: 2,
    fullName: "Prof. Marie Lukusa",
    email: "m.lukusa@education.gouv.cd",
    phone: "+243 823 456 789",
    ministry: "Ministère de l'Éducation",
    ministryId: 2,
    password: "education2026",
    createdAt: "8 Fév 2026",
  },
  {
    id: 3,
    fullName: "Ing. Pierre Kabongo",
    email: "p.kabongo@infrastructures.gouv.cd",
    phone: "+243 834 567 890",
    ministry: "Ministère des Infrastructures",
    ministryId: 4,
    password: "infra2026",
    createdAt: "6 Fév 2026",
  },
  {
    id: 4,
    fullName: "Dr. Sarah Mutombo",
    email: "s.mutombo@energie.gouv.cd",
    phone: "+243 845 678 901",
    ministry: "Ministère de l'Énergie",
    ministryId: 9,
    password: "energie2026",
    createdAt: "4 Fév 2026",
  },
  {
    id: 5,
    fullName: "Col. André Tshisekedi",
    email: "a.tshisekedi@interieur.gouv.cd",
    phone: "+243 856 789 012",
    ministry: "Ministère de l'Intérieur",
    ministryId: 1,
    password: "interieur2026",
    createdAt: "2 Fév 2026",
  },
];

// Helper to get proposals for a specific ministry
export function getProposalsByMinistry(ministryName: string): Proposal[] {
  return allProposals.filter((p) => p.ministry === ministryName);
}

// Helper to get ministry by ID
export function getMinistryById(id: number): Ministry | undefined {
  return ministries.find((m) => m.id === id);
}

// Helper to get ministry by slug
export function getMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}
