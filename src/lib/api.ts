// Client API centralisé LocaConnecté.
// Toutes les requêtes passent par ici (base URL configurable, gestion d'erreurs,
// types partagés). Zéro donnée mockée : tout vient du backend FastAPI.

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) || `HTTP ${res.status}`;
    throw new ApiError(res.status, String(message), data);
  }
  return data as T;
}

// ---- Types partagés avec le backend ----------------------------------------
export interface Family {
  key: string;
  label: string;
  emoji: string;
  icon: string;
  sectors: string[];
}

export interface SectorSummary {
  key: string;
  label: string;
  icon: string;
  family: string | null;
  pricing_model: string;
  urgency_enabled: boolean;
}

export interface FormField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  help?: string;
  depends_on?: string;
  feature?: boolean;
  feature_role?: string;
}

export interface FormSchema {
  sector: string;
  family: string | null;
  label: string;
  pricing_model: string;
  urgency_enabled: boolean;
  audience: string;
  fields: FormField[];
}

export interface IntentCandidate {
  sector: string;
  family: string | null;
  score: number;
}

export interface IntentResult {
  query: string;
  sector: string | null;
  family: string | null;
  confidence: number;
  candidates: IntentCandidate[];
  entities: Record<string, unknown>;
}

export interface Quote {
  ok: boolean;
  sector: string;
  price_min: number;
  price_max: number;
  currency: string;
  estimated: Record<string, unknown>;
  breakdown: { label: string; value: string }[];
  assumptions: string[];
  confidence: string;
  errors?: Record<string, string>;
}

export interface ProviderInput {
  provider_id: number;
  price?: number;
  distance_km?: number;
  note?: number;
  nombre_avis?: number;
  temps_moyen_reponse_min?: number;
  taux_acceptation?: number;
  historique?: number;
  disponibilite?: boolean;
  meta?: Record<string, unknown>;
}

export interface ProviderScore {
  provider_id: number;
  score: number;
  rank: number;
  breakdown: Record<string, number>;
  meta: Record<string, unknown>;
  price: number | null;
  note: number | null;
}

export interface MatchResult {
  ranked: ProviderScore[];
  top3: ProviderScore[];
  cheapest: ProviderScore | null;
  best_value: ProviderScore | null;
  premium: ProviderScore | null;
}

// ---- Endpoints --------------------------------------------------------------
export const api = {
  health: () => request<{ status: string }>('/api/health'),

  families: () => request<Family[]>('/api/catalog/families'),

  sectors: (family?: string) =>
    request<SectorSummary[]>(
      `/api/catalog/sectors${family ? `?family=${encodeURIComponent(family)}` : ''}`,
    ),

  form: (sector: string, audience: 'client' | 'provider' = 'client') =>
    request<FormSchema>(
      `/api/catalog/sectors/${encodeURIComponent(sector)}/form?audience=${audience}`,
    ),

  intent: (query: string) =>
    request<IntentResult>('/api/search/intent', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),

  quotation: (sector: string, payload: Record<string, unknown>, validate = false) =>
    request<Quote>('/api/quotation', {
      method: 'POST',
      body: JSON.stringify({ sector, payload, validate_fields: validate }),
    }),

  matching: (providers: ProviderInput[], weights?: Record<string, number>) =>
    request<MatchResult>('/api/matching', {
      method: 'POST',
      body: JSON.stringify({ providers, weights: weights ?? null }),
    }),
};
