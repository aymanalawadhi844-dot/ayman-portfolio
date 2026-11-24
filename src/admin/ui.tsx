import type { ReactNode } from 'react';

export const inputCls =
  'w-full px-4 py-2.5 text-sm text-white bg-ink-950/60 border border-white/10 rounded-xl focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/15 transition-all placeholder:text-ink-600';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-ink-950 bg-gradient-to-r from-sky-400 to-gold-400 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

export const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-ink-200 glass rounded-xl hover:bg-white/5 transition-all disabled:opacity-50';

export const btnDanger =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl hover:bg-rose-500/20 transition-all disabled:opacity-50';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-ink-600 mt-1">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="glass-strong lux-border rounded-2xl p-5">
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-base font-bold text-white">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-rose-300">تأكيد الحذف؟</span>
      <button onClick={onConfirm} className="text-xs font-bold text-white bg-rose-500 px-2.5 py-1 rounded-lg hover:bg-rose-400 transition-colors">
        نعم، احذف
      </button>
    </span>
  );
}
