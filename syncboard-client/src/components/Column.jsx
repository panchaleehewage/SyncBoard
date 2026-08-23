import { Droppable } from '@hello-pangea/dnd';
import { getBgClass } from '../data/colors';

export default function Column({ title, count, color, children }) {
  const dotClass = getBgClass(color);

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotClass} flex-shrink-0`} />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 flex flex-col gap-3 p-3 rounded-xl min-h-[200px] border
              transition-colors duration-200
              ${snapshot.isDraggingOver
                ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700'
                : 'bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }
            `}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}