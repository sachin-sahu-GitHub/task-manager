import { useState } from 'react';

export default function Register({ onRegister, goToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess(''); setBusy(true);
    try { await onRegister({ name, email, password }); setSuccess('Account created. You can now log in.'); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Create Account</h1>
    {error && <p className="message error">{error}</p>}{success && <p className="message success">{success}</p>}
    <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
    <label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <label>Password</label><input type="password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required />
    <button disabled={busy}>{busy ? 'Registering...' : 'Register'}</button>
    <p>Already have an account? <button type="button" className="link-button" onClick={goToLogin}>Login</button></p>
  </form></main>;
}

