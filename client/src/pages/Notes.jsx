import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import NoteForm from '../components/NoteForm.jsx';
import NoteCard from '../components/NoteCard.jsx';
import { notesApi } from '../services/api.js';

export default function Notes({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadNotes() {
    try { setNotes(await notesApi.getAll()); }
    catch (error) { setError(error.message); if (error.message.includes('Unauthorized')) onLogout(); }
  }
  useEffect(() => { loadNotes(); }, []);

  async function saveNote(note, clearForm) {
    setError(''); setMessage(''); setBusy(true);
    try {
      if (editingNote) { await notesApi.update(editingNote._id, note); setMessage('Note updated'); }
      else { await notesApi.create(note); setMessage('Note created'); clearForm(); }
      setEditingNote(null); await loadNotes();
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  async function deleteNote(id) {
    if (!window.confirm('Delete this note?')) return;
    setError(''); setMessage('');
    try { await notesApi.remove(id); setMessage('Note deleted'); await loadNotes(); }
    catch (error) { setError(error.message); }
  }

  return <><Navbar user={user} onLogout={onLogout} /><main className="dashboard">
    <h1>Welcome, {user.name}</h1>
    {error && <p className="message error">{error}</p>}{message && <p className="message success">{message}</p>}
    <NoteForm noteToEdit={editingNote} onSave={saveNote} onCancel={() => setEditingNote(null)} busy={busy} />
    <section><h2>Your Notes</h2>
      {notes.length === 0 ? <p>No notes yet. Create your first one above.</p> : <div className="notes-grid">{notes.map((note) => <NoteCard key={note._id} note={note} onEdit={setEditingNote} onDelete={deleteNote} />)}</div>}
    </section>
  </main></>;
}

