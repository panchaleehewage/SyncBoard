import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { X, Calendar, User, AlertTriangle } from 'lucide-react';
import { getBorderClass, getTagClasses } from '../data/colors';
import ConfirmModal from './ConfirmModal';

export default function TaskCard({ task, index, columnIndex, totalColumns, columnColor, tagColorMap, onDelete, onOpenDetail }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOverdue = new Date(task.dueDate) < new Date() && columnIndex !== totalColumns - 1;

  const borderColor = isOverdue ? 'border-l-red-500' : getBorderClass(columnColor);

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => onOpenDetail(task)}
            className={`
              group relative rounded-xl border-l-4 ${borderColor}
              border border-slate-200 dark:border-slate-600/70
              bg-white dark:bg-slate-800/80 p-4 cursor-pointer
              shadow-sm hover:shadow-md transition-all duration-200
              ${snapshot.isDragging ? 'shadow-xl rotate-1 scale-[1.02] opacity-90 dark:bg-slate-700' : ''}
            `}
          >
            {/* Delete X */}
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
              className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-150"
            >
              <X size={14} />
            </button>

            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug pr-6 mb-2">
              {task.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <User size={12} />
              <span>{task.assignee}</span>
              {isOverdue && (
                <span className="flex items-center gap-1 ml-auto text-red-500 dark:text-red-400 font-medium">
                  <AlertTriangle size={11} />
                  Overdue
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-3">
              <Calendar size={12} />
              <span>Due {task.dueDate}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {task.tags.map(tag => {
                const colorClass = tagColorMap?.[tag]
                  ? getTagClasses(tagColorMap[tag])
                  : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300';
                return (
                  <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </Draggable>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Task?"
          message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => onDelete(task.id)}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}