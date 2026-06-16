// Expérience de recherche unique : « Que recherchez-vous ? »
// query -> détection d'intention -> formulaire dynamique -> devis instantané.
// Tout est connecté au backend (zéro mock).
import { useEffect, useState } from 'react';
import { Search, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import {
  api,
  ApiError,
  type FormSchema,
  type IntentResult,
  type Quote,
  type SectorSummary,
} from '../../lib/api';
import { theme } from '../../theme';
import DynamicForm, { type FormValues } from './DynamicForm';

type Step = 'search' | 'form' | 'quote';

function prefillFromEntities(entities: Record<string, unknown>): FormValues {
  const v: FormValues = {};
  if (typeof entities.budget === 'number') v.budget = entities.budget;
  if (typeof entities.quantity === 'number') v.quantite = entities.quantity;
  if (typeof entities.urgence === 'string') v.urgence = entities.urgence;
  return v;
}

export default function SearchExperience() {
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    api.sectors().then(setSectors).catch(() => setSectors([]));
  }, []);

  async function loadForm(sector: string, entities: Record<string, unknown> = {}) {
    setLoading(true);
    setError(null);
    try {
      const s = await api.form(sector, 'client');
      setSchema(s);
      setValues(prefillFromEntities(entities));
      setFieldErrors({});
      setQuote(null);
      setStep('form');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur de chargement du formulaire');
    } finally {
      setLoading(false);
    }
  }

  async function onSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await api.intent(query);
      setIntent(r);
      if (r.sector) {
        await loadForm(r.sector, r.entities);
      } else {
        setStep('search'); // pas de secteur détecté -> on garde les familles
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Service indisponible');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitForm() {
    if (!schema) return;
    setLoading(true);
    setError(null);
    try {
      const q = await api.quotation(schema.sector, values, true);
      if (!q.ok && q.errors) {
        setFieldErrors(q.errors);
        return;
      }
      setQuote(q);
      setStep('quote');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur lors du devis');
    } finally {
      setLoading(false);
    }
  }

  // ---- Rendu ---------------------------------------------------------------
  return (
    <div className="px-4 pt-5 font-['DM_Sans']">
      {/* Barre de recherche unique */}
      {step === 'search' && (
        <div>
          <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Que recherchez-vous ?
          </h1>
          <p className="mb-4 text-sm text-slate-500">
            Décrivez votre besoin, on s'occupe du reste.
          </p>

          <div
            className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm"
            style={{ borderColor: theme.colors.gray[200] }}
          >
            <Search size={20} color={theme.colors.gray[400]} />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Ex : Je veux louer une villa à Cocody, déménager, livrer 500 poulets…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            <button
              onClick={onSearch}
              disabled={loading}
              className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Trouver
            </button>
          </div>

          {intent && !intent.sector && (
            <p className="mt-3 text-sm text-amber-600">
              Je n'ai pas reconnu le service. Choisissez ci-dessous 👇
            </p>
          )}

          {/* Accès direct par secteur */}
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold text-slate-700">Services populaires</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sectors.map((s) => (
                <button
                  key={s.key}
                  onClick={() => loadForm(s.key)}
                  className="rounded-xl border bg-white px-3 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-[#FF6B35]"
                  style={{ borderColor: theme.colors.gray[200] }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulaire dynamique */}
      {step === 'form' && schema && (
        <div>
          <button
            onClick={() => setStep('search')}
            className="mb-3 flex items-center gap-1 text-sm font-medium text-slate-500"
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <h1 className="mb-1 text-xl font-extrabold text-slate-900">{schema.label}</h1>
          <p className="mb-4 text-sm text-slate-500">
            Renseignez votre demande pour obtenir une estimation immédiate.
          </p>

          <DynamicForm schema={schema} values={values} errors={fieldErrors} onChange={(k, v) =>
            setValues((prev) => ({ ...prev, [k]: v }))
          } />

          <button
            onClick={onSubmitForm}
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Obtenir mon devis
          </button>
        </div>
      )}

      {/* Devis */}
      {step === 'quote' && quote && schema && (
        <div>
          <button
            onClick={() => setStep('form')}
            className="mb-3 flex items-center gap-1 text-sm font-medium text-slate-500"
          >
            <ArrowLeft size={16} /> Modifier ma demande
          </button>

          <div
            className="rounded-3xl p-6 text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Estimation {schema.label}
            </p>
            {quote.confidence === 'indisponible' ? (
              <p className="mt-2 text-lg font-bold">Devis sur mesure</p>
            ) : (
              <p className="mt-2 text-3xl font-extrabold">
                {quote.price_min.toLocaleString('fr-FR')} – {quote.price_max.toLocaleString('fr-FR')}{' '}
                <span className="text-base font-bold opacity-80">{quote.currency}</span>
              </p>
            )}
            {Object.keys(quote.estimated).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {quote.breakdown.map((b) => (
                  <span key={b.label} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    {b.label} : {b.value}
                  </span>
                ))}
              </div>
            )}
          </div>

          {quote.assumptions.length > 0 && (
            <ul className="mt-4 space-y-1 text-xs text-slate-500">
              {quote.assumptions.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          )}

          {/* Top prestataires : activé avec la base prestataires (phase suivante) */}
          <div
            className="mt-6 rounded-2xl border border-dashed p-5 text-center text-sm text-slate-400"
            style={{ borderColor: theme.colors.gray[200] }}
          >
            Top 3 prestataires recommandés — disponible dès l'activation de la base
            prestataires (matching IA déjà opérationnel côté API).
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
