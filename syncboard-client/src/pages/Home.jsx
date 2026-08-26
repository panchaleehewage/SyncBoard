import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';
import { apiSearchUsers } from '../api/users.api';
import { useEffect } from 'react';
import { COLOR_OPTIONS, DEFAULT_COL_COLORS, DEFAULT_TAG_COLORS, getTagClasses, getBgClass } from '../data/colors';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import {
  Plus, Layers, ArrowRight, Users, CheckCircle2, BarChart3,
  Zap, X, Search, ChevronRight
} from 'lucide-react';

// ─── Colour picker swatch used inside create-board modal ───────────────────────
function SwatchPicker({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {COLOR_OPTIONS.map(c => (
        <button
          key={c.key}
          type="button"
          onClick={() => onSelect(c.key)}
          title={c.label}
          className={`w-5 h-5 rounded-full ${c.swatch} hover:scale-110 transition-transform ${selected === c.key ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-slate-800' : ''}`}
        />
      ))}
    </div>
  );
}

// ─── Granular item builder (columns / tags) ────────────────────────────────────
function ItemBuilder({ items, setItems, placeholder, defaultColors, label }) {
  const [inputVal, setInputVal] = useState('');
  const [inputColor, setInputColor] = useState(null);

  const add = () => {
    if (!inputVal.trim()) return;
    const colorToUse = inputColor ?? defaultColors[0];
    const newItems = [...items, { label: inputVal.trim(), color: colorToUse }];
    setItems(newItems);
    setInputColor(null); // clear selection — user must explicitly pick for the next item
    setInputVal('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>

      {/* Existing items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300`}
            >
              <span className={`w-2 h-2 rounded-full ${getBgClass(item.color)}`} />
              {item.label}
              <button
                type="button"
                onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                className="ml-0.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add-item row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Colour picker for next item */}
      <SwatchPicker selected={inputColor} onSelect={setInputColor} />
    </div>
  );
}

// ─── Create Board Modal ────────────────────────────────────────────────────────
function CreateBoardModal({ onClose, onCreate }) {
  const { currentUser, authToken } = useApp();
  const [title, setTitle] = useState('');
  const [columns, setColumns] = useState([
    { label: 'To Do', color: 'violet' },
    { label: 'In Progress', color: 'amber' },
    { label: 'Done', color: 'emerald' },
  ]);
  const [boardTags, setBoardTags] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([currentUser]);
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (memberInput.trim().length < 2) {
      setMemberSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await apiSearchUsers(memberInput, authToken);
        setMemberSuggestions(results.filter(u => !members.includes(u.username)));
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [memberInput, authToken, members]);

  const handleMemberSearch = (val) => {
    setMemberInput(val);
  };

  const addMember = (username) => {
    setMembers(prev => [...prev, username]);
    setMemberInput('');
    setMemberSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) { setFormError('Board title is required.'); return; }
    if (columns.filter(c => c.label).length === 0) { setFormError('Add at least one column.'); return; }
    onCreate({ title: title.trim(), columns: columns.filter(c => c.label), tags: boardTags.filter(t => t.label), members });
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm";

  return (
    <Modal title="Create New Board" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Board Title</label>
          <input type="text" value={title} onChange={e => { setTitle(e.target.value); setFormError(''); }} placeholder="e.g. Product Launch 2027" className={inputClass} required />
        </div>

        {/* Columns builder */}
        <ItemBuilder
          items={columns}
          setItems={setColumns}
          placeholder="Column name (press Enter)"
          defaultColors={DEFAULT_COL_COLORS}
          label="Columns"
        />

        {/* Tags builder */}
        <ItemBuilder
          items={boardTags}
          setItems={setBoardTags}
          placeholder="Tag name (press Enter)"
          defaultColors={DEFAULT_TAG_COLORS}
          label="Tags (optional)"
        />

        {/* Teammates */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Invite Teammates</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={memberInput}
              onChange={e => handleMemberSearch(e.target.value)}
              placeholder="Search by username..."
              className={`${inputClass} pl-8`}
            />
            {memberSuggestions.length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden">
                {memberSuggestions.map(u => (
                  <button key={u.username} type="button" onClick={() => addMember(u.username)}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-3 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    {u.username}
                  </button>
                ))}
              </div>
            )}
          </div>
          {members.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {members.map(m => (
                <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium">
                  {m}
                  {m !== currentUser && (
                    <button type="button" onClick={() => setMembers(prev => prev.filter(x => x !== m))} className="text-brand-400 hover:text-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm">
            Create Board
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Home Component ───────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const { currentUser, authToken, boards, setBoards, pendingInvites, setPendingInvites, setAuthModal, userAvatar } = useApp();

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const userBoards = boards.filter(b => b.members.includes(currentUser));

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

  const handleCreateBoard = async (data) => {
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: data.title,
          columns: data.columns,
          tags: data.tags,
          members: data.members,
        }),
      });
      if (!res.ok) throw new Error('Server error creating board');
      const { data: savedBoard } = await res.json();
      setBoards(prev => [...prev, savedBoard]);
      setCreateBoardOpen(false);
      navigate(`/board/${savedBoard.id}`);
    } catch (err) {
      console.error('Failed to create board', err);
      alert('Could not create board. Please try again.');
    }
  };

  const handleDeleteBoard = (boardId) => {
    setBoards(prev => prev.filter(b => b.id !== boardId));
    setConfirmDeleteId(null);
  };

  // ── Landing (not logged in) ──────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-slate-950 transition-colors duration-300">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.brand.100/40%),_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,_theme(colors.brand.900/30%),_transparent_60%)] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              {/* Copy */}
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide uppercase">
                  <Zap size={12} /> Visual project management
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                  Your team's work,{' '}
                  <span className="bg-gradient-to-r from-brand-500 to-cyan-500 bg-clip-text text-transparent">
                    finally in sync.
                  </span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                  Syncboard gives every project a clear visual home — with intuitive boards, effortless team collaboration, and at-a-glance progress tracking that actually makes sense.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setAuthModal('signup')}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                  >
                    Start for free <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => setAuthModal('login')}
                    className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                  >
                    Sign in
                  </button>
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-600">Free to use · No credit card required</p>
              </div>

              {/* Mock Board Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                {/* Fake browser bar */}
                <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2.5 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-600 rounded px-3 py-0.5 flex-1 text-center">syncboard.app · Workshop Planning</span>
                </div>

                <div className="p-4 flex gap-3 overflow-x-auto bg-slate-100 dark:bg-slate-800">
                  {[
                    {
                      title: 'To Do',
                      color: 'blue',
                      tasks: ['Book Conference Venue', 'Order Catering', 'Arrange Transport'],
                      tags: ['Logistics', 'Logistics', 'Logistics'],
                    },
                    {
                      title: 'In Progress',
                      color: 'orange',
                      tasks: ['Design Event Poster', 'Social Media Campaign'],
                      tags: ['Marketing', 'Marketing'],
                    },
                    {
                      title: 'Done',
                      color: 'emerald',
                      tasks: ['Set Guest List'],
                      tags: ['Planning'],
                    },
                  ].map(col => (
                    <div key={col.title} className="w-44 flex-shrink-0">
                      <div className="flex items-center gap-1.5 mb-2 px-1">
                        <span className={`w-2 h-2 rounded-full ${getBgClass(col.color)}`} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{col.title}</span>
                        <span className="ml-auto text-xs text-slate-400 font-semibold">{col.tasks.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {col.tasks.map((task, i) => (
                          <div key={i} className={`bg-white dark:bg-slate-700 rounded-lg border-l-[3px] ${col.color === 'blue' ? 'border-l-blue-500' : col.color === 'orange' ? 'border-l-orange-500' : 'border-l-emerald-500'} border border-slate-200 dark:border-slate-600 p-2 shadow-sm`}>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight mb-1">{task}</p>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${col.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : col.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                              {col.tags[i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Everything your team needs</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">Simple enough to start in minutes. Powerful enough to scale with your whole organisation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Layers size={22} className="text-brand-500" />,
                title: 'Plan visually',
                desc: 'Drag-and-drop Kanban boards that adapt to any workflow. Create custom columns and colour-coded tags that map to how your team actually thinks.',
                color: 'bg-brand-50 dark:bg-brand-900/20',
              },
              {
                icon: <Users size={22} className="text-cyan-500" />,
                title: 'Collaborate effortlessly',
                desc: `Keep your whole team aligned. Invite teammates, assign tasks, and see who's working on what — without the back-and-forth emails.`,
                color: 'bg-cyan-50 dark:bg-cyan-900/20',
              },
              {
                icon: <BarChart3 size={22} className="text-emerald-500" />,
                title: 'Track with clarity',
                desc: `Progress bars, overdue highlights, and per-board filters give you instant clarity on what's on track and what needs attention.`,
                color: 'bg-emerald-50 dark:bg-emerald-900/20',
              },
            ].map(f => (
              <div key={f.title} className="group p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 dark:from-brand-900 dark:to-slate-900 py-16">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get organised?</h2>
            <p className="text-brand-100 dark:text-brand-300 mb-8 text-base">Join teams who use Syncboard to move faster together.</p>
            <button
              onClick={() => setAuthModal('signup')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-sm"
            >
              Create your free board <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ── Dashboard (logged in) ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Dashboard header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome, <span className="text-brand-600 dark:text-brand-400">{currentUser}</span> 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening across your workspaces.</p>
          </div>
          <button
            onClick={() => setCreateBoardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={16} /> New Board
          </button>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              Pending Invites
              <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold">{pendingInvites.length}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingInvites.map(invite => (
                <div key={invite.boardId} className="bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-800/60 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{invite.boardTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">From <strong>{invite.invitedBy}</strong></p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleAcceptInvite(invite)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      <CheckCircle2 size={12} /> Accept
                    </button>
                    <button onClick={() => handleDeclineInvite(invite)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boards grid */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Your Workspaces</h2>
          {userBoards.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                <Layers size={22} className="text-brand-500" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No boards yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">Create your first board and start organising work visually.</p>
              <button onClick={() => setCreateBoardOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-colors">
                <Plus size={15} /> Create Board
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBoards.map(board => {
                const isLeader = board.leader === currentUser;
                const gradients = [
                  'from-brand-500 to-cyan-600',
                  'from-violet-500 to-purple-700',
                  'from-amber-500 to-orange-600',
                  'from-emerald-500 to-teal-600',
                  'from-rose-500 to-pink-700',
                  'from-blue-500 to-indigo-700',
                ];
                const gradient = gradients[board.id % gradients.length];

                return (
                  <div
                    key={board.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Leader delete btn */}
                    {isLeader && (
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmDeleteId(board.id); }}
                        className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 text-white/70 hover:text-white hover:bg-white/20 rounded-md transition-all z-10"
                      >
                        <X size={14} />
                      </button>
                    )}

                    <Link to={`/board/${board.id}`} className="block p-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-extrabold shadow-md mb-4`}>
                        {board.title.charAt(0)}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1">{board.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{isLeader ? 'You lead this board' : `Leader: ${board.leader}`}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {board.tags.slice(0, 3).map(t => {
                          const tagLabel = t.label ?? t;
                          const tagColor = t.color;
                          return (
                            <span key={tagLabel} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tagColor ? getTagClasses(tagColor) : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                              {tagLabel}
                            </span>
                          );
                        })}
                        {board.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                            +{board.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Members */}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {board.members.slice(0, 4).map(m => (
                            <div
                              key={m}
                              className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold ${m === currentUser ? `bg-gradient-to-br ${userAvatar.gradient}` : 'bg-gradient-to-br from-brand-400 to-brand-700'}`}
                              title={m}
                            >
                              {m === currentUser
                                ? <span style={{ fontSize: userAvatar.emoji ? '0.8rem' : '0.65rem' }}>{userAvatar.emoji ?? m.charAt(0).toUpperCase()}</span>
                                : m.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {createBoardOpen && (
        <CreateBoardModal
          onClose={() => setCreateBoardOpen(false)}
          onCreate={handleCreateBoard}
        />
      )}

      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Board?"
          message="This will permanently remove the board. This cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDeleteBoard(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}