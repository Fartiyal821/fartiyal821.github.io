import { useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { LogOut, ShieldAlert } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import { useAppContext } from '../../context/AppContext';
import { AUTHORIZED_ADMIN_EMAIL, auth, googleProvider } from '../../lib/firebase';
import { DEFAULT_LOGO_URL, resolvePublicAssetUrl } from '../../types';

export function AdminLogin() {
  const { user, isAdmin, logout, settings } = useAppContext();
  const [mode, setMode] = useState<'google' | 'password'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete Google sign-in.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setErrorMsg(
          'Email/Password sign-in is not enabled in Firebase Authentication Console yet. Use Google Sign-In above or enable Email/Password in Firebase Console.'
        );
      } else {
        setErrorMsg('Invalid email or password, or account does not exist.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Admin Sign In – Short Study"
        description="Protected administrator portal."
        noIndex
      />

      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-7 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={resolvePublicAssetUrl(settings.logoUrl || DEFAULT_LOGO_URL)}
                alt={settings.siteName}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/15"
              />
              <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                {settings.siteName} Admin
              </h1>
            </div>
            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              Sign in with an authorized administrator account to manage Coding Notes, Affiliate
              Products, Media Library, and Website Settings.
            </p>
          </div>

          {user && !isAdmin ? (
            <div className="space-y-4 rounded-lg border border-rose-500/30 bg-rose-950/20 p-4">
              <div className="flex items-start gap-2.5 text-rose-200">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-sm text-white">Access Denied</p>
                  <p>
                    Signed in as <span className="font-mono">{user.email || 'unknown'}</span>, which
                    does not hold verified administrator privileges.
                  </p>
                  <p className="text-[#9CA3AF]">
                    Authorized owner: <span className="font-mono">{AUTHORIZED_ADMIN_EMAIL}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#090F1C] px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out &amp; Switch Account</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#090F1C] p-1 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('google');
                    setErrorMsg('');
                  }}
                  className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                    mode === 'google' ? 'bg-[#6366F1] text-white' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  Google Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('password');
                    setErrorMsg('');
                  }}
                  className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                    mode === 'password'
                      ? 'bg-[#6366F1] text-white'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  Email &amp; Password
                </button>
              </div>

              {mode === 'google' ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="w-full rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Continue with Google'}
                  </button>
                  <p className="text-[11px] text-[#9CA3AF] text-center">
                    Only verified administrator accounts are granted write access.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label htmlFor="admin-email" className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Admin Email
                    </label>
                    <input
                      id="admin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-password" className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-200"
                >
                  {errorMsg}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
