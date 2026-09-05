import { useState, useEffect } from 'react';
import { Globe2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from './Modal';

export default function AuthModal() {
    const { authModal, setAuthModal, login, register } = useApp();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isLogin = authModal === 'login';

    // Clear error & reset password visibility whenever user switches between Login ↔ Sign Up views
    useEffect(() => { setError(''); setShowPassword(false); }, [isLogin]);

    if (!authModal) return null;

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const username = e.target.username.value.trim();
        const password = e.target.password.value;

        try {
            if (isLogin) {
                await login(username, password);
            } else {
                const email = e.target.email?.value?.trim() || '';
                if (!email) { setError('Email is required.'); setLoading(false); return; }
                await register(username, email, password);
            }
            // On success AppContext closes the modal via setAuthModal(null)
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm";

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
                            required
                            className={inputClass}
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
                        minLength={3}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
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
                    disabled={loading}
                    onClick={() => alert('Google Authentication coming soon!')}
                    className="w-full py-2.5 px-4 flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-60 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
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
