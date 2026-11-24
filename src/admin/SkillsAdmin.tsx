import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, Check, Loader2 } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';
import { saveItem, deleteItem, reorderItems } from '@/lib/adminDb';
import { ICON_OPTIONS, getIcon } from '@/lib/icons';
import type { SkillCard, SkillItem } from '@/lib/types';
import { Card, Field, inputCls, btnPrimary, btnGhost } from './ui';

const emptyCard: Omit<SkillCard, 'id'> = {
  title: '', desc: '', icon: 'Globe', color: 'text-sky-400',
  hoverColor: 'hover:border-sky-500/40 hover:bg-sky-500/8 hover:text-sky-300',
  span: 'lg:col-span-1', order: 99, skills: [],
};

const SPAN_OPTIONS = [
  { value: 'lg:col-span-1', label: 'عرض عادي (1)' },
  { value: 'lg:col-span-2', label: 'عرض مزدوج (2)' },
];

export default function SkillsAdmin() {
  const { skills, refresh } = useSiteData();
  const [editing, setEditing] = useState<SkillCard | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openNew = () => {
    setEditing({ ...emptyCard, id: '', order: skills.length + 1, skills: [{ name: '', icon: 'Code2' }] } as SkillCard);
    setIsNew(true);
    setError('');
  };

  const openEdit = (s: SkillCard) => {
    setEditing({ ...s, skills: s.skills.map((x) => ({ ...x })) });
    setIsNew(false);
    setError('');
  };

  const updateSkill = (i: number, patch: Partial<SkillItem>) => {
    if (!editing) return;
    const skillsList = [...editing.skills];
    skillsList[i] = { ...skillsList[i], ...patch };
    setEditing({ ...editing, skills: skillsList });
  };

  const save = async () => {
    if (!editing?.title.trim()) { setError('عنوان البطاقة مطلوب'); return; }
    setSaving(true);
    setError('');
    try {
      await saveItem('skills', { ...editing, skills: editing.skills.filter((s) => s.name.trim()) });
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
      await deleteItem('skills', id);
      setConfirmId(null);
      await refresh();
    } catch {
      setError('فشل الحذف');
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const ids = skills.map((s) => s.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorderItems('skills', ids);
    await refresh();
  };

  return (
    <div className="space-y-5">
      <Card
        title={`بطاقات المهارات (${skills.length})`}
        actions={<button onClick={openNew} className={btnPrimary}><Plus className="w-4 h-4" /> بطاقة جديدة</button>}
      >
        {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
        <div className="space-y-3">
          {skills.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === skills.length - 1} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><Icon className={`w-5 h-5 ${s.color}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{s.title}</div>
                  <div className="text-xs text-ink-500 truncate">{s.skills.map((x) => x.name).join(' · ')}</div>
                </div>
                <button onClick={() => openEdit(s)} className="p-2 text-ink-400 hover:text-sky-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                {confirmId === s.id ? (
                  <button onClick={() => remove(s.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-400">تأكيد</button>
                ) : (
                  <button onClick={() => setConfirmId(s.id)} className="p-2 text-ink-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {editing && (
        <Card title={isNew ? 'بطاقة جديدة' : `تعديل: ${editing.title}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="عنوان البطاقة *">
              <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="الوصف المختصر">
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
            <Field label="لون التمرير (Tailwind)">
              <input className={inputCls} dir="ltr" value={editing.hoverColor} onChange={(e) => setEditing({ ...editing, hoverColor: e.target.value })} placeholder="hover:border-sky-500/40 ..." />
            </Field>
            <Field label="عرض البطاقة">
              <select className={inputCls} value={editing.span} onChange={(e) => setEditing({ ...editing, span: e.target.value })}>
                {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ink-300">المهارات داخل البطاقة</span>
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, skills: [...editing.skills, { name: '', icon: 'Code2' }] })}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> إضافة مهارة
                </button>
              </div>
              <div className="space-y-2">
                {editing.skills.map((sk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      value={sk.name}
                      onChange={(e) => updateSkill(i, { name: e.target.value })}
                      placeholder="اسم المهارة"
                    />
                    <select
                      className={`${inputCls} w-40`}
                      value={sk.icon}
                      onChange={(e) => updateSkill(i, { icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, skills: editing.skills.filter((_, j) => j !== i) })}
                      className="p-2 text-ink-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
