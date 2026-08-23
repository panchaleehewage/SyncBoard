// All Tailwind class strings must appear as complete literals for JIT purge to include them.

export const COLOR_OPTIONS = [
    {
        key: 'violet',
        bg: 'bg-violet-500',
        border: 'border-l-violet-500',
        tagLight: 'bg-violet-100 text-violet-700',
        tagDark: 'dark:bg-violet-900/30 dark:text-violet-300',
        swatch: 'bg-violet-500',
        label: 'Violet',
    },
    {
        key: 'amber',
        bg: 'bg-amber-500',
        border: 'border-l-amber-500',
        tagLight: 'bg-amber-100 text-amber-700',
        tagDark: 'dark:bg-amber-900/30 dark:text-amber-300',
        swatch: 'bg-amber-500',
        label: 'Amber',
    },
    {
        key: 'emerald',
        bg: 'bg-emerald-500',
        border: 'border-l-emerald-500',
        tagLight: 'bg-emerald-100 text-emerald-700',
        tagDark: 'dark:bg-emerald-900/30 dark:text-emerald-300',
        swatch: 'bg-emerald-500',
        label: 'Emerald',
    },
    {
        key: 'blue',
        bg: 'bg-blue-500',
        border: 'border-l-blue-500',
        tagLight: 'bg-blue-100 text-blue-700',
        tagDark: 'dark:bg-blue-900/30 dark:text-blue-300',
        swatch: 'bg-blue-500',
        label: 'Blue',
    },
    {
        key: 'rose',
        bg: 'bg-rose-500',
        border: 'border-l-rose-500',
        tagLight: 'bg-rose-100 text-rose-700',
        tagDark: 'dark:bg-rose-900/30 dark:text-rose-300',
        swatch: 'bg-rose-500',
        label: 'Rose',
    },
    {
        key: 'cyan',
        bg: 'bg-cyan-500',
        border: 'border-l-cyan-500',
        tagLight: 'bg-cyan-100 text-cyan-700',
        tagDark: 'dark:bg-cyan-900/30 dark:text-cyan-300',
        swatch: 'bg-cyan-500',
        label: 'Cyan',
    },
    {
        key: 'orange',
        bg: 'bg-orange-500',
        border: 'border-l-orange-500',
        tagLight: 'bg-orange-100 text-orange-700',
        tagDark: 'dark:bg-orange-900/30 dark:text-orange-300',
        swatch: 'bg-orange-500',
        label: 'Orange',
    },
    {
        key: 'teal',
        bg: 'bg-teal-500',
        border: 'border-l-teal-500',
        tagLight: 'bg-teal-100 text-teal-700',
        tagDark: 'dark:bg-teal-900/30 dark:text-teal-300',
        swatch: 'bg-teal-500',
        label: 'Teal',
    },
];

/** Get the full border-left Tailwind class for a color key (falls back to violet). */
export function getBorderClass(colorKey) {
    return COLOR_OPTIONS.find(c => c.key === colorKey)?.border ?? 'border-l-violet-500';
}

/** Get the bg dot class for column headers. */
export function getBgClass(colorKey) {
    return COLOR_OPTIONS.find(c => c.key === colorKey)?.bg ?? 'bg-violet-500';
}

/** Get tag pill classes (light + dark combined). */
export function getTagClasses(colorKey) {
    const opt = COLOR_OPTIONS.find(c => c.key === colorKey);
    if (!opt) return 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300';
    return `${opt.tagLight} ${opt.tagDark}`;
}

/** Default ordered colors for brand-new boards (cycles through). */
export const DEFAULT_COL_COLORS = ['violet', 'amber', 'emerald', 'blue'];
export const DEFAULT_TAG_COLORS = ['blue', 'teal', 'rose', 'cyan', 'orange', 'violet', 'emerald', 'amber'];
