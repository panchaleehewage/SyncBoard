import { Calendar, User, Tag, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { getTagClasses } from '../data/colors';
import Modal from './Modal';

export default function TaskDetailModal({ task, tagColorMap, onClose, onEdit, onDelete }) {
    if (!task) return null;

    // Use a minimal overdue check: past due and not in "Done" status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = task.dueDate && new Date(task.dueDate) < today && task.status !== 'Done';

    return (
        <Modal title="Task Details" onClose={onClose}>
            <div className="space-y-5">
                {/* Title + status badge */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                            {task.status}
                        </span>
                        {isOverdue && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                <AlertTriangle size={11} />
                                Overdue
                            </span>
                        )}
                    </div>
                </div>

                {/* Meta */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <User size={15} className="text-slate-400 flex-shrink-0" />
                        <span><span className="font-medium text-slate-800 dark:text-slate-200">Assignee:</span> {task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                        <span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">Due Date:</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            }) : 'No due date'}
                        </span>
                    </div>
                    {task.tags?.length > 0 && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Tag size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <div className="flex flex-wrap gap-1.5">
                                {task.tags.map(tag => {
                                    const colorClass = tagColorMap?.[tag]
                                        ? getTagClasses(tagColorMap[tag])
                                        : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400';
                                    return (
                                        <span key={tag} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    {onDelete && (
                        <button
                            onClick={() => { onDelete(task.id); onClose(); }}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    )}
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => { onEdit(task); onClose(); }}
                            className="px-4 py-2 text-sm font-semibold flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Edit2 size={14} />
                            Edit Task
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
