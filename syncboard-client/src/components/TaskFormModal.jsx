import { useState } from 'react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

export default function TaskFormModal({ task, board, columns, onClose, onSave }) {
    const [title, setTitle] = useState(task?.title || '');
    const [dueDate, setDueDate] = useState(task?.dueDate || '');
    const [assignee, setAssignee] = useState(task?.assignee || (board?.members?.[0] || ''));
    const [tags, setTags] = useState(task?.tags || []);
    const [formError, setFormError] = useState('');
    const [confirmSave, setConfirmSave] = useState(false);

    const boardTagLabels = board?.tags?.map(t => t.label ?? t) || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (title.trim().length < 3) {
            setFormError('Title must be at least 3 characters long.');
            return;
        }
        if (!task) {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                setFormError('Due date cannot be in the past.');
                return;
            }
            onSave({ title: title.trim(), dueDate, assignee, tags: tags.length ? tags : ['General'] });
        } else {
            setConfirmSave(true);
        }
    };

    const executeSave = () => {
        onSave({ title: title.trim(), dueDate, assignee, tags: tags.length ? tags : ['General'] });
        setConfirmSave(false);
    };

    const toggleTag = (tag) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const inputClass = "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors text-sm";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    return (
        <Modal title={task ? 'Edit Task' : 'Add New Task'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {formError}
                    </div>
                )}

                <div>
                    <label className={labelClass}>Task Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => { setTitle(e.target.value); setFormError(''); }}
                        placeholder="What needs to be done?"
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => { setDueDate(e.target.value); setFormError(''); }}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Assignee</label>
                    <select value={assignee} onChange={e => setAssignee(e.target.value)} required className={inputClass}>
                        <option value="" disabled>Assign to...</option>
                        {board?.members?.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {boardTagLabels.length > 0 && (
                    <div>
                        <label className={labelClass}>Tags</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {boardTagLabels.map(tag => (
                                <label key={tag} className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={tags.includes(tag)}
                                        onChange={() => toggleTag(tag)}
                                        className="accent-brand-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm">
                        {task ? 'Save Changes' : 'Add Task'}
                    </button>
                </div>
            </form>

            {confirmSave && (
                <ConfirmModal
                    title="Save Changes?"
                    message="Are you sure you want to save these changes to the task?"
                    confirmLabel="Save"
                    variant="info"
                    onConfirm={executeSave}
                    onClose={() => setConfirmSave(false)}
                />
            )}
        </Modal>
    );
}
