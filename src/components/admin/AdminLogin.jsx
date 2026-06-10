import { useState } from 'react';
import { sha256 } from '../../utils/crypto';
import { isSupabaseConfigured, signIn } from '../../utils/supabase';

const MASTER_HASH = '44224633aacd52c42bc187876985b0fbcbea3efd00c2d8f7deb975672344541e';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [err,  setErr]    = useState('');
  const [busy, setBusy]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      if (isSupabaseConfigured) {
        await signIn(email.trim(), pass);
        onLogin();
      } else {
        const hash = await sha256(pass);
        if (hash === MASTER_HASH) {
          sessionStorage.setItem('ph_session', '1');
          onLogin();
        } else {
          setErr('Password salah.');
        }
      }
    } catch {
      setErr(isSupabaseConfigured ? 'Email atau password salah.' : 'Password salah.');
    }
    setBusy(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h2>Admin Panel</h2>
          <p>Portfolio Prizuri Hartadi</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isSupabaseConfigured && (
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                autoComplete="username"
                required
              />
            </div>
          )}
          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            {err && <span className="login-error">{err}</span>}
          </div>
          <button type="submit" className="btn-save" disabled={busy} style={{ marginTop: 4 }}>
            {busy ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
