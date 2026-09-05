export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <small>Last updated: {new Date(note.updatedAt).toLocaleString()}</small>
      <div className="card-actions">
        <button className="secondary-button" onClick={() => onEdit(note)}>Edit</button>
        <button className="danger-button" onClick={() => onDelete(note._id)}>Delete</button>
      </div>
    </article>
  );
}

