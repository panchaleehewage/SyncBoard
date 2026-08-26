import { useState, useEffect } from 'react';
import { Plus, X, Check, Search } from 'lucide-react';
import Modal from './Modal';
import { COLOR_OPTIONS, getBgClass } from '../data/colors';
import { apiSearchUsers } from '../api/users.api';
import { useApp } from '../context/AppContext';
import ConfirmModal from './ConfirmModal';

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
export default function BoardSettingsModal({ title, members = [], columns, tags, onSave, onClose }) {
    const { authToken, currentUser } = useApp();
    const [localTitle, setLocalTitle] = useState(title || '');
    const [activeTab, setActiveTab] = useState('general'); // Default to new tab
    const [localCols, setLocalCols] = useState(() => columns.map(c => ({ ...c })));
    const [localTags, setLocalTags] = useState(() => tags.map(t => ({ ...t })));
    const [localMembers, setLocalMembers] = useState(() => [...members]);
    const [confirmSave, setConfirmSave] = useState(false);

    const [colNewLabel, setColNewLabel] = useState('');
    const [colNewColor, setColNewColor] = useState(null); // null = no pre-selection
    const [tagNewLabel, setTagNewLabel] = useState('');
    const [tagNewColor, setTagNewColor] = useState(null); // null = no pre-selection

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const results = await apiSearchUsers(searchQuery, authToken);
                setSearchResults(results);
            } catch (err) {
                console.error("Search failed", err);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, authToken]);

    const addMember = (username) => {
        if (!localMembers.includes(username)) {
            setLocalMembers(prev => [...prev, username]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSave = () => {
        setConfirmSave(true);
    };

    const executeSave = () => {
        onSave(
            localTitle.trim() || title,
            localMembers,
            localCols.filter(c => c.label.trim()),
            localTags.filter(t => t.label.trim())
        );
        onClose();
        setConfirmSave(false);
    };

    const tabs = [
        { id: 'general', label: 'General' },
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

            {/* --- GENERAL TAB --- */}
            {activeTab === 'general' && (
                <div className="space-y-5 min-h-[250px]">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Board Title
                        </label>
                        <input
                            type="text"
                            value={localTitle}
                            onChange={e => setLocalTitle(e.target.value)}
                            placeholder="Board title…"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Manage Teammates
                        </label>

                        {/* Current Members */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {localMembers.map(member => (
                                <div key={member} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{member}</span>
                                    {member !== currentUser && (
                                        <button onClick={() => setLocalMembers(prev => prev.filter(m => m !== member))} className="text-slate-400 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by username..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                            />

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden">
                                    {searchResults.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => addMember(user.username)}
                                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-3 transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            {user.username}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

            {confirmSave && (
                <ConfirmModal
                    title="Save Changes?"
                    message="Are you sure you want to save these changes to the board settings?"
                    confirmLabel="Save"
                    variant="info"
                    onConfirm={executeSave}
                    onClose={() => setConfirmSave(false)}
                />
            )}
        </Modal>
    );
}
