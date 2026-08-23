import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import Modal from './Modal';

export default function AuthModal() {
    const { authModal, setAuthModal, setCurrentUser } = useApp();
    const [error, setError] = useState('');

    if (!authModal) return null;

    const isLogin = authModal === 'login';

    const handleAuth = (e) => {
        e.preventDefault();
        setError('');
        const username = e.target.username.value.trim();
        const password = e.target.password.value;

        if (isLogin) {
            const user = mockUsers.find(u => u.username === username && u.password === password);
            if (user) {
                setCurrentUser(username);
                setAuthModal(null);
            } else {
                setError('Invalid username or password.');
            }
        } else {
            // Mock sign up — just sets the user directly
            if (!username || username.length < 3) {
                setError('Username must be at least 3 characters.');
                return;
            }
            setCurrentUser(username);
            setAuthModal(null);
        }
    };

    const handleGoogleAuth = () => {
        setCurrentUser('GoogleUser');
        setAuthModal(null);
    };

    return (
        <Modal title={isLogin ? 'Welcome back' : 'Create an account'} onClose={() => setAuthModal(null)}>
            <form onSubmit={handleAuth} className="space-y-4">
                {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                    <input
                        name="username"
                        type="text"
                        placeholder={isLogin ? 'Your username' : 'Choose a username'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-sm"
                >
                    {isLogin ? 'Login' : 'Create Account'}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">or</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    <Globe2 size={18} className="text-brand-500" />
                    Continue with Google
                </button>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        type="button"
                        onClick={() => { setAuthModal(isLogin ? 'signup' : 'login'); setError(''); }}
                        className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </form>
        </Modal>
    );
}
