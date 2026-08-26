import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useApp } from '../context/AppContext';
import { useBoardReducer } from '../hooks/useTaskReducer';
import { getTasks } from '../api/tasks';
import Column from '../components/Column';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import TaskDetailModal from '../components/TaskDetailModal';
import BoardSettingsModal from '../components/BoardSettingsModal';
import ConfirmModal from '../components/ConfirmModal';
import ProjectCompleteModal from '../components/ProjectCompleteModal';
import { ArrowLeft, Plus, Settings, Trash2, Search, AlertTriangle, Filter, ShieldX } from 'lucide-react';

export default function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { currentUser, authToken, boards, setBoards, userAvatar } = useApp();

  const board = boards.find(b => b.id === parseInt(boardId));

  // ── Single reducer manages tasks, columns, and tags ─────────────────────────
  const [boardState, dispatch] = useBoardReducer({
    tasks: [],
    columns: board?.columns || [
      { label: 'To Do', color: 'violet' },
      { label: 'In Progress', color: 'amber' },
      { label: 'Done', color: 'emerald' },
    ],
    tags: board?.tags || [],
  });
  const { tasks, columns, tags: boardTags } = boardState;

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [projectComplete, setProjectComplete] = useState(false);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState(null);

  const isLeader = currentUser === board?.leader;

  // Tag color map: { "Frontend": "blue", "Backend": "violet", ... }
  const tagColorMap = Object.fromEntries(boardTags.map(t => [t.label, t.color]));

  useEffect(() => {
    getTasks(authToken)
      .then(all => {
        dispatch({ type: 'SET_TASKS', payload: all.data.filter(t => t.boardId === parseInt(boardId)) });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tasks', err);
        setLoading(false);
      });
  }, [boardId, authToken]);

  // ── Board not found ─────────────────────────────────────────────────────────
  if (!board) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Board not found.</p>
          <Link to="/" className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  // ── Board membership check (403) ────────────────────────────────────────────
  if (!board.members.includes(currentUser)) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <ShieldX size={28} className="text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">403 — Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            You are not a member of <strong className="text-slate-700 dark:text-slate-300">{board.title}</strong>. Ask the board leader to invite you.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm">
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Progress
  const doneLabel = columns[columns.length - 1]?.label;
  const doneCount = tasks.filter(t => t.status === doneLabel).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  // Filtered tasks
  const today = new Date();
  const filteredTasks = tasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (assigneeFilter && t.assignee !== assigneeFilter) return false;
    if (overdueOnly) {
      if (!(new Date(t.dueDate) < today && t.status !== doneLabel)) return false;
    }
    return true;
  });

  // ── Drag end with project completion check ──────────────────────────────────
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const movedId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    dispatch({ type: 'MOVE_TASK', payload: { id: movedId, newStatus } });

    // Simulate the updated state (tasks hasn't re-rendered yet)
    const simulatedTasks = tasks.map(t => t.id === movedId ? { ...t, status: newStatus } : t);
    if (doneLabel && simulatedTasks.length > 0 && simulatedTasks.every(t => t.status === doneLabel)) {
      setProjectComplete(true);
    }

    try {
      await fetch(`/api/tasks/${movedId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update task status on server", err);
    }
  };

  const handleAddTask = async (taskData) => {
    const newTask = {
      id: Date.now(),
      boardId: board.id,
      status: columns[0]?.label || 'To Do',
      ...taskData
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    setTaskModal(false);

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newTask)
      });
    } catch (err) {
      console.error("Failed to save task to database", err);
      alert("Warning: Task was not saved to the server.");
    }
  };

  const handleEditTask = async (taskData) => {
    const backupId = editingTask.id;
    dispatch({ type: 'EDIT_TASK', payload: { ...editingTask, ...taskData } });
    setEditingTask(null);

    try {
      await fetch(`/api/tasks/${backupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(taskData)
      });
    } catch (err) {
      console.error("Failed to update task on server", err);
    }
  };

  // Ask for confirmation before deleting a task
  const handleDeleteTask = (id) => {
    setConfirmDeleteTaskId(id);
  };

  // Called when the user confirms deletion in the modal
  const executeDeleteTask = async (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    setDetailTask(null);
    setConfirmDeleteTaskId(null);
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
    } catch (err) {
      console.error('Failed to delete task on server', err);
    }
  };

  const handleDeleteBoard = () => {
    setBoards(prev => prev.filter(b => b.id !== board.id));
    navigate('/');
  };

  // Columns and tags now go through the reducer — no stale closure risk
  const handleSaveSettings = async (newTitle, newMembers, newCols, newTags) => {
    dispatch({ type: 'SET_COLUMNS', payload: newCols });
    dispatch({ type: 'SET_TAGS', payload: newTags });
    setBoards(prev => prev.map(b =>
      b.id === board.id ? { ...b, title: newTitle, members: newMembers, columns: newCols, tags: newTags } : b
    ));
    try {
      await fetch(`/api/boards/${board.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newTitle,
          members: newMembers,
          columns: newCols,
          tags: newTags
        })
      });
    } catch (err) {
      console.error("Failed to save board settings to database", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Board Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{board.title}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {board.members.length} member{board.members.length !== 1 ? 's' : ''} · Leader: {board.leader}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex -space-x-2">
                {board.members.slice(0, 4).map(m => (
                  <div
                    key={m}
                    className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold ${m === currentUser ? `bg-gradient-to-br ${userAvatar.gradient}` : 'bg-gradient-to-br from-brand-400 to-brand-700'}`}
                    title={m}
                  >
                    {m === currentUser
                      ? <span style={{ fontSize: userAvatar.emoji ? '0.85rem' : '0.7rem' }}>{userAvatar.emoji ?? m.charAt(0).toUpperCase()}</span>
                      : m.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>

              <button onClick={() => setTaskModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                <Plus size={16} /> Add Task
              </button>

              {isLeader && (
                <>
                  <button onClick={() => setSettingsModal(true)} className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors">
                    <Settings size={15} /> Settings
                  </button>
                  <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors">
                    <Trash2 size={15} /> Delete Board
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{doneCount} of {tasks.length} tasks complete</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
            </div>
            <div className="relative min-w-[130px]">
              <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)}
                className="pl-7 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none">
                <option value="">All members</option>
                {board.members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input type="checkbox" checked={overdueOnly} onChange={e => setOverdueOnly(e.target.checked)} className="accent-red-500" />
              <AlertTriangle size={13} className="text-red-400" /> Overdue only
            </label>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-5 items-start pb-4 min-w-max">
              {columns.map((col, colIndex) => {
                const colTasks = filteredTasks.filter(t => t.status === col.label);
                return (
                  <Column key={col.label} title={col.label} count={colTasks.length} color={col.color}>
                    {colTasks.map((task, taskIndex) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={taskIndex}
                        columnIndex={colIndex}
                        totalColumns={columns.length}
                        columnColor={col.color}
                        tagColorMap={tagColorMap}
                        onDelete={handleDeleteTask}
                        onOpenDetail={setDetailTask}
                      />
                    ))}
                  </Column>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
      {taskModal && <TaskFormModal board={{ ...board, tags: boardTags }} columns={columns} onClose={() => setTaskModal(false)} onSave={handleAddTask} />}
      {editingTask && <TaskFormModal task={editingTask} board={{ ...board, tags: boardTags }} columns={columns} onClose={() => setEditingTask(null)} onSave={handleEditTask} />}
      {detailTask && <TaskDetailModal task={detailTask} tagColorMap={tagColorMap} onClose={() => setDetailTask(null)} onEdit={(t) => { setDetailTask(null); setEditingTask(t); }} onDelete={handleDeleteTask} />}
      {settingsModal && <BoardSettingsModal title={board.title} members={board.members} columns={columns} tags={boardTags} onSave={handleSaveSettings} onClose={() => setSettingsModal(false)} />}
      {confirmDelete && <ConfirmModal title="Delete Board?" message={`Permanently delete "${board.title}"? This cannot be undone.`} confirmLabel="Delete Board" onConfirm={handleDeleteBoard} onClose={() => setConfirmDelete(false)} />}
      {confirmDeleteTaskId && <ConfirmModal title="Delete Task?" message="This task will be permanently removed. This cannot be undone." confirmLabel="Delete Task" onConfirm={() => executeDeleteTask(confirmDeleteTaskId)} onClose={() => setConfirmDeleteTaskId(null)} />}
      {projectComplete && <ProjectCompleteModal board={board} onClose={() => setProjectComplete(false)} />}
    </div>
  );
}