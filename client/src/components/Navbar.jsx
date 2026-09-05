export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <strong>Notes App</strong>
      <div>
        <span className="user-name">{user.name}</span>
        <button className="secondary-button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

