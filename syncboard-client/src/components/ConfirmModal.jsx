import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({ title = 'Are you sure?', message, confirmLabel = 'Confirm', onConfirm, onClose }) {
    return (
        <Modal title={title} onClose={onClose}>
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{message}</p>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
