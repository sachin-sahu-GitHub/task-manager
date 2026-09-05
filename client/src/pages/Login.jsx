import { useState } from 'react';

export default function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try { await onLogin({ email, password }); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Notes App</h1><h2>Login</h2>
    {error && <p className="message error">{error}</p>}
    <label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    <button disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
    <p>Don't have an account? <button type="button" className="link-button" onClick={goToRegister}>Register</button></p>
  </form></main>;
}

