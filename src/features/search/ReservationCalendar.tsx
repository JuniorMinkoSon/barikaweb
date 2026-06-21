// Calendrier de réservation côté client : disponibilité capacity-aware
// (🟢 disponible / 🟠 partiel / 🔴 occupé), navigation mensuelle, sélection de
// plage (séjour) ou de date simple selon la catégorie. Tout vient du backend.
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api, type DayAvailability, type MonthAvailability } from '../../lib/api';
import { theme } from '../../theme';

export interface DateRange {
  start?: string;
  end?: string;
}

interface Props {
  sector: string;
  range: DateRange;
  onChange: (range: DateRange) => void;
  /** true = sélection d'une plage (séjour) ; false = date unique. */
  supportsRange: boolean;
  listingId?: string;
}

const WEEKDAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  available: { bg: '#fff', color: '#1a1a1a', dot: theme.colors.success },
  partial: { bg: '#FFF8EC', color: '#92610A', dot: '#F59E0B' },
  occupied: { bg: '#FDECEC', color: '#C0392B', dot: '#E5484D' },
  past: { bg: '#FAFAFA', color: '#C4C4C4', dot: '#E5E5E5' },
};

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function nightsBetween(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export default function ReservationCalendar({
  sector,
  range,
  onChange,
  supportsRange,
  listingId,
}: Props) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [data, setData] = useState<MonthAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .availability(sector, cursor.year, cursor.month, { listingId })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError('Disponibilité indisponible');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sector, cursor.year, cursor.month, listingId]);

  const dayMap = useMemo(() => {
    const m = new Map<string, DayAvailability>();
    data?.days.forEach((d) => m.set(d.date, d));
    return m;
  }, [data]);

  // Grille du mois alignée sur lundi.
  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month - 1, 1);
    const offset = (first.getDay() + 6) % 7; // 0 = lundi
    const daysInMonth = new Date(cursor.year, cursor.month, 0).getDate();
    const out: (string | null)[] = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(iso(new Date(cursor.year, cursor.month - 1, d)));
    return out;
  }, [cursor]);

  function selectable(day: DayAvailability | undefined): boolean {
    return !!day && day.status !== 'past' && day.status !== 'occupied';
  }

  function rangeHasConflict(start: string, end: string): boolean {
    // Refuse la plage si un jour intermédiaire est occupé/passé.
    const cur = new Date(start);
    const last = new Date(end);
    while (cur < last) {
      const info = dayMap.get(iso(cur));
      if (info && !selectable(info)) return true;
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  }

  function handleClick(dateStr: string) {
    const info = dayMap.get(dateStr);
    if (!selectable(info)) return;
    setNotice(null);
    if (!supportsRange) {
      onChange({ start: dateStr });
      return;
    }
    const { start, end } = range;
    if (!start || end) {
      onChange({ start: dateStr });
      return;
    }
    if (dateStr <= start) {
      onChange({ start: dateStr });
      return;
    }
    if (rangeHasConflict(start, dateStr)) {
      onChange({ start: dateStr });
      return;
    }
    const nights = nightsBetween(start, dateStr);
    if (data && nights > data.max_nights) {
      setNotice(`Séjour maximum : ${data.max_nights} nuit(s).`);
      return;
    }
    if (data && nights < data.min_nights) {
      setNotice(`Séjour minimum : ${data.min_nights} nuit(s).`);
      return;
    }
    onChange({ start, end: dateStr });
  }

  function inSelection(dateStr: string): 'start' | 'end' | 'mid' | null {
    if (range.start === dateStr) return 'start';
    if (range.end === dateStr) return 'end';
    if (range.start && range.end && dateStr > range.start && dateStr < range.end) return 'mid';
    return null;
  }

  const monthLabel = new Date(cursor.year, cursor.month - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const prev = () =>
    setCursor((c) => (c.month === 1 ? { year: c.year - 1, month: 12 } : { ...c, month: c.month - 1 }));
  const next = () =>
    setCursor((c) => (c.month === 12 ? { year: c.year + 1, month: 1 } : { ...c, month: c.month + 1 }));

  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: theme.colors.gray[200] }}>
      {/* En-tête mois */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ borderColor: theme.colors.gray[200] }}
          aria-label="Mois précédent"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold capitalize text-slate-800">{monthLabel}</span>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ borderColor: theme.colors.gray[200] }}
          aria-label="Mois suivant"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Grille */}
      <div className="relative grid grid-cols-7 gap-1">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Loader2 size={18} className="animate-spin text-slate-400" />
          </div>
        )}
        {cells.map((dateStr, i) => {
          if (!dateStr) return <span key={`e${i}`} />;
          const info = dayMap.get(dateStr);
          const status = info?.status ?? 'available';
          const sel = inSelection(dateStr);
          const st = STATUS_STYLE[status];
          const isSelectable = selectable(info);
          const dayNum = Number(dateStr.slice(-2));
          const selectedBg = sel ? theme.colors.primary : st.bg;
          const selectedColor = sel ? '#fff' : st.color;
          return (
            <button
              key={dateStr}
              onClick={() => handleClick(dateStr)}
              disabled={!isSelectable}
              title={
                info && info.capacity > 1
                  ? `${info.available}/${info.capacity} disponible(s)`
                  : data?.legend[status]
              }
              className="relative flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: selectedBg,
                color: selectedColor,
                border: `1px solid ${sel ? theme.colors.primary : theme.colors.gray[200]}`,
                cursor: isSelectable ? 'pointer' : 'not-allowed',
                opacity: status === 'past' ? 0.5 : 1,
              }}
            >
              {dayNum}
              {!sel && (
                <span
                  className="mt-0.5 h-1 w-1 rounded-full"
                  style={{ background: st.dot }}
                />
              )}
              {!sel && info && info.capacity > 1 && status !== 'past' && (
                <span className="absolute right-0.5 top-0.5 text-[8px] font-bold" style={{ color: st.dot }}>
                  {info.available}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
        {(['available', 'partial', 'occupied'] as const).map((s) => (
          <span key={s} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_STYLE[s].dot }} />
            {data?.legend[s] ?? s}
          </span>
        ))}
      </div>

      {data && (
        <p className="mt-2 text-[11px] text-slate-400">
          {data.capacity_type === 'single'
            ? `Séjour min. ${data.min_nights} nuit(s), max. ${data.max_nights} nuit(s).`
            : data.capacity_type === 'fleet'
              ? `Flotte de ${data.capacity} unité(s) — le chiffre indique les unités libres.`
              : data.capacity_type === 'teams'
                ? `${data.capacity} équipe(s) disponibles par jour.`
                : `Capacité ${data.capacity} / jour.`}
        </p>
      )}

      {notice && <p className="mt-2 text-[11px] font-semibold text-amber-600">{notice}</p>}

      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
