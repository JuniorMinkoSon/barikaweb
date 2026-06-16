// Page connexion / inscription — simple et fonctionnelle.
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { theme } from '../../theme';
import { ApiError } from '../../lib/api';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, name, phone: phone || undefined });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#FF6B35]';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 font-['DM_Sans']">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          {mode === 'login'
            ? 'Connectez-vous pour accéder à vos services.'
            : 'Rejoignez LocaConnecté en quelques secondes.'}
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input
                className={inputCls}
                style={{ borderColor: theme.colors.gray[200] }}
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className={inputCls}
                style={{ borderColor: theme.colors.gray[200] }}
                placeholder="Téléphone (optionnel)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}
          <input
            className={inputCls}
            style={{ borderColor: theme.colors.gray[200] }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputCls}
            style={{ borderColor: theme.colors.gray[200] }}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-center text-sm font-medium text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-bold"
            style={{ color: theme.colors.primary }}
          >
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
}
