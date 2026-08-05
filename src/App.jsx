import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // 'login', 'signup', or null
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (username && password) {
      setCurrentUser(username);
      setAuthModal(null); // Close the modal on success
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <Link to="/" className="logo">Syncboard</Link>
        {currentUser ? (
          <div className="user-controls">
            <span className="user-badge">Logged in as: <strong>{currentUser}</strong></span>
            <button className="btn-logout" onClick={() => setCurrentUser(null)}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn-secondary" onClick={() => setAuthModal('login')}>Login</button>
            <button className="btn-primary" onClick={() => setAuthModal('signup')}>Sign Up</button>
          </div>
        )}
      </header>

      {/* Auth Modal Popup */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{authModal === 'login' ? 'Login to Syncboard' : 'Create an Account'}</h2>
            <form onSubmit={handleAuth} className="modal-form">
              <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" required placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" required placeholder="Enter password" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setAuthModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">{authModal === 'login' ? 'Login' : 'Sign Up'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/board/:boardId" element={<Board currentUser={currentUser} />} />
      </Routes>
    </div>
  );
}