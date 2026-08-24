// Shared avatar option definitions used by Profile.jsx, AppContext, and Navbar.
// All gradient strings are written as full Tailwind literals for JIT safety.
export const AVATAR_OPTIONS = [
    { id: 'default', gradient: 'from-brand-500 to-brand-700', emoji: null, label: 'Indigo' },
    { id: 'rose', gradient: 'from-rose-500 to-pink-700', emoji: '🌸', label: 'Rose' },
    { id: 'amber', gradient: 'from-amber-500 to-orange-600', emoji: '🔥', label: 'Amber' },
    { id: 'emerald', gradient: 'from-emerald-500 to-teal-600', emoji: '🌿', label: 'Emerald' },
    { id: 'cyan', gradient: 'from-cyan-500 to-blue-600', emoji: '💎', label: 'Cyan' },
    { id: 'violet', gradient: 'from-violet-500 to-purple-700', emoji: '⚡', label: 'Violet' },
    { id: 'slate', gradient: 'from-slate-500 to-slate-700', emoji: '🤖', label: 'Slate' },
    { id: 'red', gradient: 'from-red-500 to-rose-700', emoji: '🚀', label: 'Red' },
];
