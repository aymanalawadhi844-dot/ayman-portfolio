import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, Check, Loader2 } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';
import { saveItem, deleteItem, reorderItems } from '@/lib/adminDb';
import { ICON_OPTIONS, getIcon } from '@/lib/icons';
import type { FeatureCard } from '@/lib/types';
import { Card, Field, inputCls, btnPrimary, btnGhost } from './ui';

const emptyFeature: Omit<FeatureCard, 'id'> = {
  title: '', desc: '', icon: 'Code2', color: 'text-sky-400',
  bg: 'bg-sky-500/10', order: 99,
};

export default function FeaturesAdmin() {
  const { features, refresh } = useSiteData();
  const [editing, setEditing] = useState<FeatureCard | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openNew = () => {
    setEditing({ ...emptyFeature, id: '', order: features.length + 1 } as FeatureCard);
    setIsNew(true);
    setError('');
  };

  const openEdit = (f: FeatureCard) => {
    setEditing({ ...f });
    setIsNew(false);
    setError('');
  };

  const save = async () => {
    if (!editing?.title.trim()) { setError('العنوان مطلوب'); return; }
    setSaving(true);
    setError('');
    try {
      await saveItem('features', editing);
      setEditing(null);
      await refresh();
    } catch {
      setError('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteItem('features', id);
      setConfirmId(null);
      await refresh();
    } catch {
      setError('فشل الحذف');
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const ids = features.map((f) => f.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorderItems('features', ids);
    await refresh();
  };

  return (
    <div className="space-y-5">
      <Card
        title={`بطاقات "من أنا" (${features.length})`}
        actions={<button onClick={openNew} className={btnPrimary}><Plus className="w-4 h-4" /> بطاقة جديدة</button>}
      >
        {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
        <div className="space-y-3">
          {features.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === features.length - 1} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                </div>
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${f.color}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{f.title}</div>
                  <div className="text-xs text-ink-500 truncate">{f.desc}</div>
                </div>
                <button onClick={() => openEdit(f)} className="p-2 text-ink-400 hover:text-sky-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                {confirmId === f.id ? (
                  <button onClick={() => remove(f.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-400">تأكيد</button>
                ) : (
                  <button onClick={() => setConfirmId(f.id)} className="p-2 text-ink-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {editing && (
        <Card title={isNew ? 'بطاقة جديدة' : `تعديل: ${editing.title}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="العنوان *">
              <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="الوصف">
              <input className={inputCls} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
            </Field>
            <Field label="الأيقونة">
              <select className={inputCls} value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="لون الأيقونة (Tailwind)">
              <input className={inputCls} dir="ltr" value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} placeholder="text-sky-400" />
            </Field>
            <Field label="خلفية الأيقونة (Tailwind)">
              <input className={inputCls} dir="ltr" value={editing.bg} onChange={(e) => setEditing({ ...editing, bg: e.target.value })} placeholder="bg-sky-500/10" />
            </Field>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className={btnPrimary}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              حفظ
            </button>
            <button onClick={() => setEditing(null)} className={btnGhost}><X className="w-4 h-4" /> إلغاء</button>
          </div>
        </Card>
      )}
    </div>
  );
}
