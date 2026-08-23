import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}