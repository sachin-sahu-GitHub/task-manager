import { useEffect, useState } from 'react';

const emptyNote = { title: '', content: '' };

export default function NoteForm({ noteToEdit, onSave, onCancel, busy }) {
  const [note, setNote] = useState(emptyNote);

  useEffect(() => {
    setNote(noteToEdit ? { title: noteToEdit.title, content: noteToEdit.content } : emptyNote);
  }, [noteToEdit]);

  function submit(event) {
    event.preventDefault();
    onSave(note, () => setNote(emptyNote));
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <h2>{noteToEdit ? 'Edit Note' : 'Create Note'}</h2>
      <label>Title</label>
      <input value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} placeholder="A short title" />
      <label>Content</label>
      <textarea value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} placeholder="Write your note here" rows="5" />
      <div className="form-actions">
        <button disabled={busy}>{busy ? 'Saving...' : noteToEdit ? 'Save Changes' : 'Add Note'}</button>
        {noteToEdit && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

