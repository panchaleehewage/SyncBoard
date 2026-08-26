import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({ title = 'Are you sure?', message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onClose }) {
    const config = {
        danger: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            btnText: 'text-white',
            btnBg: 'bg-red-600 hover:bg-red-700',
            Icon: AlertTriangle
        },
        success: {
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            text: 'text-emerald-600 dark:text-emerald-400',
            btnText: 'text-white',
            btnBg: 'bg-emerald-600 hover:bg-emerald-700',
            Icon: CheckCircle
        },
        info: {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            btnText: 'text-white',
            btnBg: 'bg-brand-600 hover:bg-brand-700',
            Icon: Info
        }
    };
    const c = config[variant] || config.danger;
    const { Icon } = c;

    return (
        <Modal title={title} onClose={onClose}>
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}>
                        <Icon size={20} className={c.text} />
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
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ${c.btnBg} ${c.btnText}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
