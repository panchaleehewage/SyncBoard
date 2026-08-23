import { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { COLOR_OPTIONS, getBgClass, getTagClasses } from '../data/colors';
import Modal from './Modal';

function ColorSwatch({ selected, onSelect }) {
    return (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
            {COLOR_OPTIONS.map(c => (
                <button
                    key={c.key}
                    type="button"
                    onClick={() => onSelect(c.key)}
                    className={`w-6 h-6 rounded-full ${c.swatch} transition-transform hover:scale-110 ring-offset-2 dark:ring-offset-slate-800 ${selected === c.key ? 'ring-2 ring-slate-600 dark:ring-slate-300 scale-110' : ''}`}
                    title={c.label}
                />
            ))}
        </div>
    );
}

function ItemRow({ item, onChange, onRemove, label }) {
    const [showColors, setShowColors] = useState(false);

    return (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-2">
            <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getBgClass(item.color)}`} />
                <input
                    type="text"
                    value={item.label}
                    onChange={e => onChange({ ...item, label: e.target.value })}
                    placeholder={label}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={() => setShowColors(s => !s)}
                    className="p-1.5 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    title="Change colour"
                >
                    <Settings size={14} />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
            {showColors && (
                <ColorSwatch selected={item.color} onSelect={color => onChange({ ...item, color })} />
            )}
        </div>
    );
}

export default function BoardSettingsModal({ columns, setColumns, tags, setTags, dispatch, onClose }) {
    const [localCols, setLocalCols] = useState(columns.map(c => ({ ...c })));
    const [localTags, setLocalTags] = useState(tags.map(t => ({ ...t })));
    const [newColLabel, setNewColLabel] = useState('');
    const [newColColor, setNewColColor] = useState('blue');
    const [newTagLabel, setNewTagLabel] = useState('');
    const [newTagColor, setNewTagColor] = useState('teal');
    const [activeTab, setActiveTab] = useState('columns');

    const handleSave = () => {
        // Propagate column renames to tasks
        localCols.forEach((newCol, i) => {
            const oldCol = columns[i];
            if (oldCol && oldCol.label !== newCol.label && newCol.label.trim()) {
                dispatch({ type: 'RENAME_COLUMN', payload: { oldName: oldCol.label, newName: newCol.label.trim() } });
            }
        });
        setColumns(localCols.filter(c => c.label.trim()));
        setTags(localTags.filter(t => t.label.trim()));
        onClose();
    };

    const addCol = () => {
        if (!newColLabel.trim()) return;
        setLocalCols(prev => [...prev, { label: newColLabel.trim(), color: newColColor }]);
        setNewColLabel('');
    };

    const addTag = () => {
        if (!newTagLabel.trim()) return;
        setLocalTags(prev => [...prev, { label: newTagLabel.trim(), color: newTagColor }]);
        setNewTagLabel('');
    };

    const inputClass = "flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

    return (
        <Modal title="Board Settings" onClose={onClose}>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg mb-5">
                {['columns', 'tags'].map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'columns' && (
                <div className="space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Renamed columns will automatically update all tasks.</p>
                    {localCols.map((col, i) => (
                        <ItemRow
                            key={i}
                            item={col}
                            label="Column name"
                            onChange={updated => setLocalCols(prev => prev.map((c, idx) => idx === i ? updated : c))}
                            onRemove={() => setLocalCols(prev => prev.filter((_, idx) => idx !== i))}
                        />
                    ))}
                    {/* Add new column */}
                    <div className="space-y-2 pt-1">
                        <div className="flex gap-2">
                            <input value={newColLabel} onChange={e => setNewColLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCol())} placeholder="New column name" className={inputClass} />
                            <button type="button" onClick={addCol} className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <ColorSwatch selected={newColColor} onSelect={setNewColColor} />
                    </div>
                </div>
            )}

            {activeTab === 'tags' && (
                <div className="space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Board-level tags available when creating tasks.</p>
                    {localTags.map((tag, i) => (
                        <ItemRow
                            key={i}
                            item={tag}
                            label="Tag name"
                            onChange={updated => setLocalTags(prev => prev.map((t, idx) => idx === i ? updated : t))}
                            onRemove={() => setLocalTags(prev => prev.filter((_, idx) => idx !== i))}
                        />
                    ))}
                    <div className="space-y-2 pt-1">
                        <div className="flex gap-2">
                            <input value={newTagLabel} onChange={e => setNewTagLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="New tag name" className={inputClass} />
                            <button type="button" onClick={addTag} className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <ColorSwatch selected={newTagColor} onSelect={setNewTagColor} />

                        {/* Tag preview */}
                        {localTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                                {localTags.map(tag => (
                                    <span key={tag.label} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagClasses(tag.color)}`}>{tag.label}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-700 mt-5">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm">
                    Save Settings
                </button>
            </div>
        </Modal>
    );
}
