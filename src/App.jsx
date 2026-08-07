import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import { mockUsers } from './mockData';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Handle Dark Mode switching
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDarkMode]);

  const handleAuth = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (authModal === 'login') {
      // Validate against mockData
      const user = mockUsers.find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(username);
        setAuthModal(null);
        navigate('/');
      } else {
        alert("Invalid username or password");
      }
    } else if (authModal === 'signup') {
      setCurrentUser(username);
      setAuthModal(null);
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <Link to="/" className="logo">Syncboard</Link>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {currentUser ? (
            <div className="user-controls">
              <div className="user-avatar">{currentUser.charAt(0).toUpperCase()}</div>
              <span className="username-display">{currentUser}</span>
              <button className="btn-logout" onClick={() => setCurrentUser(null)}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-secondary" style={{color: 'black'}} onClick={() => setAuthModal('login')}>Login</button>
              <button className="btn-primary" style={{background: '#3b82f6', color: 'white'}} onClick={() => setAuthModal('signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </header>

      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{authModal === 'login' ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleAuth} className="modal-form">
              <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" required />
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