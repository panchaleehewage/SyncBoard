import { Trophy, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCompleteModal({ board, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
                {/* Gradient background */}
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 text-center">

                    {/* Sparkle decorations */}
                    <div className="absolute top-4 left-6 text-yellow-300 animate-bounce delay-75">✦</div>
                    <div className="absolute top-8 right-8 text-yellow-200 animate-bounce delay-150 text-lg">✦</div>
                    <div className="absolute top-3 right-20 text-white/60 animate-ping text-xs">✦</div>
                    <div className="absolute bottom-32 left-8 text-yellow-300 animate-bounce text-sm">★</div>
                    <div className="absolute bottom-28 right-6 text-white/70 animate-bounce delay-100">★</div>

                    {/* Trophy */}
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-5 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
                        <Trophy size={48} className="text-yellow-300 relative z-10" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                        Board Complete!
                    </h2>
                    <p className="text-emerald-100 text-sm font-medium mb-1">🎉 Every task is done</p>
                    <p className="text-white/80 text-base font-semibold mb-1">{board?.title}</p>

                    {/* Member avatars */}
                    {board?.members?.length > 0 && (
                        <div className="flex justify-center -space-x-2 mt-4 mb-1">
                            {board.members.map(m => (
                                <div
                                    key={m}
                                    title={m}
                                    className="w-9 h-9 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center text-white text-xs font-extrabold"
                                >
                                    {m.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-emerald-100 text-xs mt-2">
                        Great work, {board?.members?.join(', ')}!
                    </p>
                </div>

                {/* Action area */}
                <div className="bg-white dark:bg-slate-800 px-8 py-5 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
                    >
                        <Sparkles size={15} /> Keep going
                    </button>
                    <Link
                        to="/"
                        className="flex-1 py-2.5 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={15} /> Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
