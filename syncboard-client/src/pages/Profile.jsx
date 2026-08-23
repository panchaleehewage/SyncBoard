import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockUsers, mockTasks } from '../data/mockData';
import { User, Mail, FileText, Calendar, Layout, CheckCircle, X, Edit2, Save, Camera } from 'lucide-react';

// ─── Avatar options: all gradients written as full literal strings ─────────────
const AVATAR_OPTIONS = [
    { id: 'default', gradient: 'from-brand-500 to-brand-700', emoji: null, label: 'Indigo' },
    { id: 'rose', gradient: 'from-rose-500 to-pink-700', emoji: '🌸', label: 'Rose' },
    { id: 'amber', gradient: 'from-amber-500 to-orange-600', emoji: '🔥', label: 'Amber' },
    { id: 'emerald', gradient: 'from-emerald-500 to-teal-600', emoji: '🌿', label: 'Emerald' },
    { id: 'cyan', gradient: 'from-cyan-500 to-blue-600', emoji: '💎', label: 'Cyan' },
    { id: 'violet', gradient: 'from-violet-500 to-purple-700', emoji: '⚡', label: 'Violet' },
    { id: 'slate', gradient: 'from-slate-500 to-slate-700', emoji: '🤖', label: 'Slate' },
    { id: 'red', gradient: 'from-red-500 to-rose-700', emoji: '🚀', label: 'Red' },
];

export default function Profile() {
    const { username } = useParams();
    const { currentUser, boards, pendingInvites, setPendingInvites, setBoards } = useApp();

    const isOwnProfile = currentUser === username;
    const profileData = mockUsers.find(u => u.username === username);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(profileData?.username || username);
    const [email, setEmail] = useState(profileData?.email || '');
    const [bio, setBio] = useState(profileData?.bio || '');
    const [saved, setSaved] = useState(false);

    // Avatar state
    const [chosenAvatar, setChosenAvatar] = useState(AVATAR_OPTIONS[0]);
    const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

    const userBoards = boards.filter(b => b.members.includes(username));
    const upcomingTasks = mockTasks.filter(
        t => t.assignee === username && t.status !== 'Done'
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

    const handleSave = () => {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleAcceptInvite = (invite) => {
        setBoards(prev => prev.map(b =>
            b.id === invite.boardId && !b.members.includes(currentUser)
                ? { ...b, members: [...b.members, currentUser] }
                : b
        ));
        setPendingInvites(prev => prev.filter(i => i.boardId !== invite.boardId));
    };

    const handleDeclineInvite = (invite) => {
        setPendingInvites(prev => prev.filter(i => i.boardId !== invite.boardId));
    };

    if (!profileData && !username) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">User not found.</p>
            </div>
        );
    }

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm";
    const sectionClass = "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

                {/* Profile Card */}
                <div className={sectionClass}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-5">

                            {/* Editable Avatar */}
                            <div className="relative group">
                                <div
                                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${chosenAvatar.gradient} flex items-center justify-center text-white shadow-lg select-none`}
                                    style={{ fontSize: chosenAvatar.emoji ? '2rem' : '1.875rem', fontWeight: 800 }}
                                >
                                    {chosenAvatar.emoji ?? username.charAt(0).toUpperCase()}
                                </div>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => setAvatarPickerOpen(p => !p)}
                                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Change avatar"
                                    >
                                        <Camera size={20} className="text-white" />
                                    </button>
                                )}

                                {/* Avatar picker dropdown */}
                                {avatarPickerOpen && (
                                    <div className="absolute left-0 top-[calc(100%+8px)] z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 w-52">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">Choose an avatar</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {AVATAR_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => { setChosenAvatar(opt); setAvatarPickerOpen(false); }}
                                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center text-white transition-transform hover:scale-110 ring-offset-2 dark:ring-offset-slate-800 ${chosenAvatar.id === opt.id ? 'ring-2 ring-brand-500 scale-105' : ''}`}
                                                    title={opt.label}
                                                    style={{ fontSize: opt.emoji ? '1.25rem' : '1rem', fontWeight: 800 }}
                                                >
                                                    {opt.emoji ?? username.charAt(0).toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                {editing ? (
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className={`${inputClass} text-lg font-bold mb-2`}
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h1>
                                )}
                                <p className="text-brand-600 dark:text-brand-400 text-sm font-medium">@{username}</p>
                            </div>
                        </div>

                        {isOwnProfile && (
                            <div className="flex gap-2">
                                {editing ? (
                                    <>
                                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg transition-colors">
                                            <Save size={15} /> Save
                                        </button>
                                        <button onClick={() => setEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm rounded-lg transition-colors">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm rounded-lg transition-colors">
                                        <Edit2 size={15} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {saved && (
                        <div className="mt-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle size={15} /> Profile saved successfully!
                        </div>
                    )}

                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <Mail size={12} /> Email
                            </label>
                            {editing ? (
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className={inputClass} placeholder="your@email.com" />
                            ) : (
                                <p className="text-sm text-slate-700 dark:text-slate-300">{email || '—'}</p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <FileText size={12} /> Bio
                            </label>
                            {editing ? (
                                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Tell your team about yourself..." />
                            ) : (
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{bio || 'No bio yet.'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Invites (own profile only, sourced from AppContext) */}
                {isOwnProfile && pendingInvites.length > 0 && (
                    <div className={sectionClass}>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Layout size={16} className="text-brand-500" />
                            Pending Board Invites
                            <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-xs font-semibold">{pendingInvites.length}</span>
                        </h2>
                        <div className="space-y-3">
                            {pendingInvites.map(invite => (
                                <div key={invite.boardId} className="flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{invite.boardTitle}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Invited by <strong>{invite.invitedBy}</strong></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAcceptInvite(invite)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                            <CheckCircle size={13} /> Accept
                                        </button>
                                        <button onClick={() => handleDeclineInvite(invite)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors">
                                            <X size={13} /> Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Boards */}
                    <div className={sectionClass}>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Layout size={16} className="text-brand-500" />
                            Boards
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold ml-auto">{userBoards.length}</span>
                        </h2>
                        {userBoards.length === 0 ? (
                            <p className="text-sm text-slate-400">No boards yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {userBoards.map(board => (
                                    <Link key={board.id} to={`/board/${board.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {board.title.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{board.title}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{board.members.length} members · {board.leader === username ? 'Leader' : 'Member'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Tasks */}
                    <div className={sectionClass}>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-amber-500" />
                            Upcoming Tasks
                        </h2>
                        {upcomingTasks.length === 0 ? (
                            <p className="text-sm text-slate-400">No upcoming tasks.</p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingTasks.map(task => {
                                    const isOverdue = new Date(task.dueDate) < new Date();
                                    return (
                                        <div key={task.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{task.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    Due {task.dueDate}{isOverdue ? ' · Overdue' : ''}
                                                </span>
                                                <span className="ml-auto text-xs px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-slate-500 dark:text-slate-400">{task.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
