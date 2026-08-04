import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    if (username) {
      setCurrentUser(username);
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <Link to="/" className="logo">Syncboard</Link>
        {currentUser ? (
          <div className="user-controls">
            <span>Logged in as: <strong>{currentUser}</strong></span>
            <button onClick={() => setCurrentUser(null)}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <input name="username" placeholder="Enter any username..." required />
            <button type="submit">Login</button>
          </form>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/board/:boardId" element={<Board currentUser={currentUser} />} />
      </Routes>
    </div>
  );
}