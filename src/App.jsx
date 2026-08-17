import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import { mockUsers } from './data/mockData';
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
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
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