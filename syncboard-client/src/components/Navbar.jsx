import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { currentUser, setCurrentUser, setAuthModal, userAvatar } = useApp();
    const navigate = useNavigate();
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogout = () => {
        setCurrentUser(null);
        setConfirmLogout(false);
        navigate('/');
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                    >
                        <LayoutDashboard size={22} />
                        Syncboard
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {currentUser ? (
                            <div className="flex items-center gap-2">
                                {/* Avatar → profile link — dynamically reflects chosen avatar */}
                                <Link
                                    to={`/profile/${currentUser}`}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${userAvatar?.gradient ?? 'from-brand-500 to-brand-700'} flex items-center justify-center text-white text-sm font-semibold shadow-sm select-none`}
                                    >
                                        {userAvatar?.emoji ?? currentUser.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors hidden sm:block">
                                        {currentUser}
                                    </span>
                                </Link>

                                {/* Logout — shows ConfirmModal before triggering */}
                                <button
                                    onClick={() => setConfirmLogout(true)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    aria-label="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setAuthModal('login')}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setAuthModal('signup')}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout confirmation modal — rendered outside header to sit above all layers */}
            {confirmLogout && (
                <ConfirmModal
                    title="Sign Out?"
                    message="Are you sure you want to sign out of Syncboard?"
                    confirmLabel="Sign Out"
                    onConfirm={handleLogout}
                    onClose={() => setConfirmLogout(false)}
                />
            )}
        </>
    );
}
