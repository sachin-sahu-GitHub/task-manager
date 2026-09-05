import { useState } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Notes from './pages/Notes.jsx';
import { authApi, clearSession, getSavedUser, saveSession } from './services/api.js';

export default function App() {
  const [user, setUser] = useState(getSavedUser());
  const [page, setPage] = useState('login');

  async function login(formData) {
    const data = await authApi.login(formData);
    saveSession(data.token, data.user);
    setUser(data.user);
  }
  function logout() { clearSession(); setUser(null); setPage('login'); }

  if (user) return <Notes user={user} onLogout={logout} />;
  if (page === 'register') return <Register onRegister={authApi.register} goToLogin={() => setPage('login')} />;
  return <Login onLogin={login} goToRegister={() => setPage('register')} />;
}

