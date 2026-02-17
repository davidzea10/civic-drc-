/**
 * Client API CIVIC-DRC — base URL et appels auth (étape 1).
 */

const getBaseUrl = () => import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  nom: string;
  email: string;
  role: "citoyen" | "responsable_ministere" | "admin";
}

export interface RegisterResponse {
  user: AuthUser & { cree_le?: string };
  token: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const url = `${getBaseUrl().replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...fetchOptions, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const body = data as { error?: string; code?: string; detail?: string };
    let message = body?.error || res.statusText || "Erreur API";
    if (body?.code) message += ` (${body.code})`;
    if (body?.detail) message += ` — ${body.detail}`;
    throw new Error(message);
  }
  return data as T;
}

/** POST /auth/register */
export async function register(body: RegisterBody): Promise<RegisterResponse> {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** POST /auth/login */
export async function login(body: LoginBody): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /auth/me (token requis) */
export async function getMe(token: string): Promise<{ user: AuthUser }> {
  return request<{ user: AuthUser }>("/auth/me", { token });
}

/** Proposition retournée par l'API */
export interface ApiProposition {
  id: string;
  probleme: string;
  solution: string;
  impact?: string;
  statut: string;
  reponse_officielle?: string;
  cree_le?: string;
  ministere_id?: string;
  province_id?: string;
  ministeres?: { nom: string } | null;
  provinces?: { nom: string; gouvernement?: string } | null;
  utilisateurs?: { nom: string } | null;
  taux_moderation?: number;
  a_moderer?: boolean;
}

/** GET /proposals — liste des propositions.
 *  officielles: true = uniquement avec réponse officielle (défaut pour liste publique)
 *  officielles: false = toutes (admin)
 *  mes_en_attente: true + token = mes propositions sans réponse (citoyen)
 */
export async function getProposals(params?: {
  ministere_id?: string;
  province_id?: string;
  statut?: string;
  sort?: string;
  officielles?: boolean;
  mes_en_attente?: boolean;
}, token?: string): Promise<ApiProposition[]> {
  const sp = new URLSearchParams();
  if (params?.ministere_id) sp.set("ministere_id", params.ministere_id);
  if (params?.province_id) sp.set("province_id", params.province_id);
  if (params?.statut) sp.set("statut", params.statut);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.officielles === true) sp.set("officielles", "1");
  if (params?.officielles === false) sp.set("officielles", "0");
  if (params?.mes_en_attente === true) sp.set("mes_en_attente", "1");
  const q = sp.toString();
  return request<ApiProposition[]>(`/proposals${q ? `?${q}` : ""}`, { token });
}

/** Détail proposition (ministeres/provinces peuvent avoir description, attributions) */
export interface ApiPropositionDetail extends ApiProposition {
  ministeres?: { nom: string; description?: string; attributions?: string } | null;
  provinces?: { nom: string; gouvernement?: string } | null;
  utilisateurs?: { nom: string; email?: string } | null;
}

/** GET /proposals/:id — détail d'une proposition */
export async function getProposal(id: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>(`/proposals/${id}`);
}

/** PATCH /proposals/:id — modifier sa propre proposition (citoyen, sans réponse officielle) */
export async function patchProposal(id: string, body: { probleme?: string; solution?: string; impact?: string }, token: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>(`/proposals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

/** DELETE /proposals/:id — supprimer sa propre proposition (citoyen) */
export async function deleteProposal(id: string, token: string): Promise<{ deleted: boolean; id: string }> {
  return request(`/proposals/${id}`, { method: "DELETE", token });
}

/** POST /proposals — créer une proposition (JWT requis) */
export interface PostProposalBody {
  ministere_id?: string;
  province_id?: string;
  probleme: string;
  solution: string;
  impact?: string;
}

export async function postProposal(body: PostProposalBody, token: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>("/proposals", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

/** GET /ministries — liste des ministères */
export interface ApiMinistry {
  id: string;
  nom: string;
  description?: string;
  attributions?: string;
}

export async function getMinistries(): Promise<ApiMinistry[]> {
  return request<ApiMinistry[]>("/ministries");
}

/** GET /provinces — liste des provinces */
export interface ApiProvince {
  id: string;
  nom: string;
  gouvernement?: string;
}

export async function getProvinces(): Promise<ApiProvince[]> {
  return request<ApiProvince[]>("/provinces");
}

/** GET /proposals/:id/votes — likes, dislikes, userVote (si token fourni) */
export interface ApiVotes {
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
}

export async function getProposalVotes(id: string, token?: string): Promise<ApiVotes> {
  return request<ApiVotes>(`/proposals/${id}/votes`, { token });
}

/** POST /proposals/:id/votes — voter like ou dislike */
export async function postProposalVote(id: string, type_vote: "like" | "dislike", token: string): Promise<unknown> {
  return request(`/proposals/${id}/votes`, {
    method: "POST",
    body: JSON.stringify({ type_vote }),
    token,
  });
}

/** GET /proposals/:id/comments — liste des commentaires */
export interface ApiComment {
  id: string;
  contenu: string;
  cree_le: string;
  utilisateurs?: { nom: string } | null;
  taux_moderation?: number;
  a_moderer?: boolean;
}

export async function getProposalComments(id: string): Promise<ApiComment[]> {
  return request<ApiComment[]>(`/proposals/${id}/comments`);
}

/** POST /proposals/:id/comments — ajouter un commentaire (token requis) */
export async function postProposalComment(id: string, contenu: string, token: string): Promise<ApiComment> {
  return request<ApiComment>(`/proposals/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ contenu }),
    token,
  });
}

/** PATCH /admin/proposals/:id/status — changer le statut (admin / responsable_ministere) */
export async function patchAdminProposalStatus(id: string, statut: string, token: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>(`/admin/proposals/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ statut }),
    token,
  });
}

/** POST /admin/proposals/:id/response — publier une réponse officielle (admin / responsable_ministere) */
export async function postAdminProposalResponse(id: string, reponse_officielle: string, token: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>(`/admin/proposals/${id}/response`, {
    method: "POST",
    body: JSON.stringify({ reponse_officielle }),
    token,
  });
}

/** PATCH /admin/proposals/:id/publish — publier sans réponse (visible en liste publique) */
export async function patchAdminProposalPublish(id: string, token: string): Promise<ApiPropositionDetail> {
  return request<ApiPropositionDetail>(`/admin/proposals/${id}/publish`, {
    method: "PATCH",
    token,
  });
}

/** DELETE /admin/proposals/:id — supprimer une proposition (admin / responsable_ministere) */
export async function deleteAdminProposal(id: string, token: string): Promise<{ deleted: boolean; id: string }> {
  return request(`/admin/proposals/${id}`, { method: "DELETE", token });
}

/** GET /admin/proposals/stats — statistiques admin */
export interface AdminStats {
  propositions: { total: number; a_moderer: number; publiees: number; par_statut: Record<string, number> };
  commentaires: { total: number; a_moderer: number };
}
export async function getAdminStats(token: string): Promise<AdminStats> {
  return request<AdminStats>("/admin/proposals/stats", { token });
}

export { getBaseUrl };
