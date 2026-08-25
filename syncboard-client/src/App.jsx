import { Routes, Route } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Board from './pages/Board';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  const { authLoading } = useApp();

  // While restoring session from localStorage (GET /api/auth/me in-flight),
  // show a neutral splash so the user never sees a logged-out flash.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      <Navbar />
      <AuthModal />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/board/:boardId"
            element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}