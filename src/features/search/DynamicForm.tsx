// Formulaire dynamique : rendu piloté par le schéma renvoyé par le backend
// (Dynamic Forms Engine). Aucune définition de champ codée en dur ici.
import type { FormField, FormSchema } from '../../lib/api';
import { theme } from '../../theme';

export type FormValues = Record<string, unknown>;

interface Props {
  schema: FormSchema;
  values: FormValues;
  errors?: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
}

const inputBase =
  'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#FF6B35]';

function Label({ field }: { field: FormField }) {
  return (
    <label className="mb-1 block text-xs font-semibold text-slate-700">
      {field.label}
      {field.required && <span className="text-[#FF6B35]"> *</span>}
      {field.unit && <span className="text-slate-400"> ({field.unit})</span>}
    </label>
  );
}

export default function DynamicForm({ schema, values, errors, onChange }: Props) {
  const renderField = (field: FormField) => {
    const value = values[field.key];
    const err = errors?.[field.key];
    const borderColor = err ? '#ef4444' : theme.colors.gray[200];

    let control: JSX.Element;
    switch (field.type) {
      case 'textarea':
        control = (
          <textarea
            className={inputBase}
            style={{ borderColor }}
            rows={3}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );
        break;
      case 'select':
      case 'commune':
        control = (
          <select
            className={inputBase}
            style={{ borderColor }}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            <option value="">— Choisir —</option>
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
        break;
      case 'multiselect':
        control = (
          <div className="flex flex-wrap gap-2">
            {(field.options ?? []).map((o) => {
              const arr = Array.isArray(value) ? (value as string[]) : [];
              const active = arr.includes(o);
              return (
                <button
                  type="button"
                  key={o}
                  onClick={() =>
                    onChange(
                      field.key,
                      active ? arr.filter((x) => x !== o) : [...arr, o],
                    )
                  }
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    borderColor: active ? theme.colors.primary : theme.colors.gray[200],
                    backgroundColor: active ? theme.colors.primaryLight : '#fff',
                    color: active ? theme.colors.primary : theme.colors.gray[600],
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>
        );
        break;
      case 'boolean':
        control = (
          <button
            type="button"
            onClick={() => onChange(field.key, !value)}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ backgroundColor: value ? theme.colors.primary : theme.colors.gray[200] }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                style={{ left: value ? 22 : 2 }}
              />
            </span>
            <span className="text-slate-600">{value ? 'Oui' : 'Non'}</span>
          </button>
        );
        break;
      case 'integer':
      case 'number':
      case 'currency':
        control = (
          <input
            type="number"
            className={inputBase}
            style={{ borderColor }}
            value={(value as number | string) ?? ''}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            onChange={(e) =>
              onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))
            }
          />
        );
        break;
      case 'date':
        control = (
          <input
            type="date"
            className={inputBase}
            style={{ borderColor }}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );
        break;
      case 'photos':
        control = (
          <input
            type="text"
            className={inputBase}
            style={{ borderColor }}
            placeholder="URL(s) de photos (séparées par des virgules)"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );
        break;
      default:
        control = (
          <input
            type="text"
            className={inputBase}
            style={{ borderColor }}
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );
    }

    return (
      <div key={field.key} className="mb-4">
        <Label field={field} />
        {control}
        {field.help && <p className="mt-1 text-[11px] text-slate-400">{field.help}</p>}
        {err && <p className="mt-1 text-[11px] font-medium text-red-500">{err}</p>}
      </div>
    );
  };

  return <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">{schema.fields.map(renderField)}</div>;
}
