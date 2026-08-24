import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import Modal from './Modal';
import { COLOR_OPTIONS, getBgClass } from '../data/colors';

// ─── Colour swatch picker ──────────────────────────────────────────────────────
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

// ─── Single editable item row ──────────────────────────────────────────────────
function ItemRow({ item, onChange, onRemove }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOpen(p => !p)} className="flex-shrink-0">
                    <span className={`block w-4 h-4 rounded-full ${getBgClass(item.color)} hover:scale-110 transition-transform`} />
                </button>
                <input
                    value={item.label}
                    onChange={e => onChange({ ...item, label: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <X size={15} />
                </button>
            </div>
            {open && (
                <div className="pl-6">
                    <SwatchPicker selected={item.color} onSelect={color => { onChange({ ...item, color }); setOpen(false); }} />
                </div>
            )}
        </div>
    );
}

// ─── Tab panel for columns or tags ────────────────────────────────────────────
// Input text and color are lifted to the parent so they survive tab switches.
function ItemsPanel({ items, setItems, placeholder, defaultColorKey, newLabel, setNewLabel, newColor, setNewColor }) {
    const addItem = () => {
        if (!newLabel.trim()) return;
        const colorToUse = newColor ?? defaultColorKey;
        setItems(prev => [...prev, { label: newLabel.trim(), color: colorToUse }]);
        setNewLabel('');
        setNewColor(null); // clear — user must re-pick for next item
    };

    return (
        <div className="space-y-3">
            {/* Existing items */}
            <div className="space-y-2">
                {items.map((item, i) => (
                    <ItemRow
                        key={i}
                        item={item}
                        onChange={updated => setItems(prev => prev.map((c, idx) => idx === i ? updated : c))}
                        onRemove={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                    />
                ))}
            </div>

            {/* Add new */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex gap-2">
                    <input
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={addItem}
                        className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                    >
                        <Plus size={15} />
                    </button>
                </div>
                <SwatchPicker selected={newColor} onSelect={setNewColor} />
            </div>
        </div>
    );
}

// ─── Main BoardSettingsModal ───────────────────────────────────────────────────
export default function BoardSettingsModal({ columns, tags, onSave, onClose }) {
    const [activeTab, setActiveTab] = useState('columns');
    const [localCols, setLocalCols] = useState(() => columns.map(c => ({ ...c })));
    const [localTags, setLocalTags] = useState(() => tags.map(t => ({ ...t })));

    // Input state for both tabs lives here so tab switching doesn't wipe unsaved text/color
    const [colNewLabel, setColNewLabel] = useState('');
    const [colNewColor, setColNewColor] = useState(null); // null = no pre-selection
    const [tagNewLabel, setTagNewLabel] = useState('');
    const [tagNewColor, setTagNewColor] = useState(null); // null = no pre-selection

    const handleSave = () => {
        onSave(
            localCols.filter(c => c.label.trim()),
            localTags.filter(t => t.label.trim())
        );
        onClose();
    };

    const tabs = [
        { id: 'columns', label: 'Columns' },
        { id: 'tags', label: 'Tags' },
    ];

    return (
        <Modal title="Board Settings" onClose={onClose}>
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1 mb-5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'columns' && (
                <ItemsPanel
                    items={localCols}
                    setItems={setLocalCols}
                    placeholder="New column name…"
                    defaultColorKey="violet"
                    newLabel={colNewLabel}
                    setNewLabel={setColNewLabel}
                    newColor={colNewColor}
                    setNewColor={setColNewColor}
                />
            )}
            {activeTab === 'tags' && (
                <ItemsPanel
                    items={localTags}
                    setItems={setLocalTags}
                    placeholder="New tag name…"
                    defaultColorKey="brand"
                    newLabel={tagNewLabel}
                    setNewLabel={setTagNewLabel}
                    newColor={tagNewColor}
                    setNewColor={setTagNewColor}
                />
            )}

            <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm">
                    <Check size={15} /> Save Settings
                </button>
            </div>
        </Modal>
    );
}
