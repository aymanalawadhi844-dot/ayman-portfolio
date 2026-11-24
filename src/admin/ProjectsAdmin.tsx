import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, Check, Loader2 } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';
import { saveItem, deleteItem, reorderItems } from '@/lib/adminDb';
import { ICON_OPTIONS, getIcon } from '@/lib/icons';
import type { Project } from '@/lib/types';
import { Card, Field, inputCls, btnPrimary, btnGhost } from './ui';
import ImageField from './ImageField';

const emptyProject: Omit<Project, 'id'> = {
  title: '', desc: '', tags: [], githubUrl: '', imageUrl: '',
  preview: 'code', icon: 'FileCode2', color: 'text-sky-400',
  accent: 'from-sky-500/20 to-sky-400/5', order: 99,
};

const PREVIEW_OPTIONS = [
  { value: 'code', label: 'كود' },
  { value: 'database', label: 'قاعدة بيانات' },
  { value: 'network', label: 'شبكة' },
  { value: 'web', label: 'واجهة ويب' },
  { value: 'image', label: 'صورة مخصصة' },
];

export default function ProjectsAdmin() {
  const { projects, refresh } = useSiteData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openNew = () => {
    setEditing({ ...emptyProject, id: '', order: projects.length + 1 } as Project);
    setIsNew(true);
    setError('');
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setIsNew(false);
    setError('');
  };

  const save = async () => {
    if (!editing?.title.trim()) { setError('عنوان المشروع مطلوب'); return; }
    setSaving(true);
    setError('');
    try {
      await saveItem('projects', editing);
      setEditing(null);
      await refresh();
    } catch {
      setError('فشل الحفظ، تحقق من صلاحيات Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteItem('projects', id);
      setConfirmId(null);
      await refresh();
    } catch {
      setError('فشل الحذف');
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const ids = projects.map((p) => p.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorderItems('projects', ids);
    await refresh();
  };

  return (
    <div className="space-y-5">
      <Card
        title={`المشاريع (${projects.length})`}
        actions={
          <button onClick={openNew} className={btnPrimary}>
            <Plus className="w-4 h-4" /> مشروع جديد
          </button>
        }
      >
        {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
        <div className="space-y-3">
          {projects.map((p, i) => {
            const Icon = getIcon(p.icon);
            return (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="text-ink-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                </div>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" className="w-14 h-10 rounded-lg object-cover border border-white/10" />
                ) : (
                  <div className="w-14 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Icon className={`w-5 h-5 ${p.color}`} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{p.title}</div>
                  <div className="text-xs text-ink-500 truncate">{p.tags.join(' · ')}</div>
                </div>
                <button onClick={() => openEdit(p)} className="p-2 text-ink-400 hover:text-sky-400 transition-colors" title="تعديل"><Pencil className="w-4 h-4" /></button>
                {confirmId === p.id ? (
                  <button onClick={() => remove(p.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-400">تأكيد</button>
                ) : (
                  <button onClick={() => setConfirmId(p.id)} className="p-2 text-ink-400 hover:text-rose-400 transition-colors" title="حذف"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            );
          })}
          {projects.length === 0 && <p className="text-sm text-ink-500 text-center py-6">لا توجد مشاريع بعد — أضف أول مشروع.</p>}
        </div>
      </Card>

      {editing && (
        <Card title={isNew ? 'مشروع جديد' : `تعديل: ${editing.title}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="عنوان المشروع *">
              <input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="رابط GitHub">
              <input className={inputCls} dir="ltr" value={editing.githubUrl} onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })} placeholder="https://github.com/..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="الوصف">
                <textarea className={`${inputCls} min-h-[80px] resize-y`} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
              </Field>
            </div>
            <Field label="التقنيات (افصل بينها بفاصلة)">
              <input className={inputCls} value={editing.tags.join('، ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(/[،,]/).map((t) => t.trim()).filter(Boolean) })} placeholder="C++، OOP، Flutter" />
            </Field>
            <Field label="نوع المعاينة">
              <select className={inputCls} value={editing.preview} onChange={(e) => setEditing({ ...editing, preview: e.target.value as Project['preview'] })}>
                {PREVIEW_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="الأيقونة">
              <select className={inputCls} value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="لون الأيقونة (Tailwind)">
              <input className={inputCls} dir="ltr" value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} placeholder="text-sky-400" />
            </Field>
            <Field label="تدرج الخلفية (Tailwind)">
              <input className={inputCls} dir="ltr" value={editing.accent} onChange={(e) => setEditing({ ...editing, accent: e.target.value })} placeholder="from-sky-500/20 to-sky-400/5" />
            </Field>
            <div className="sm:col-span-2">
              <ImageField
                label={'صورة المشروع (اختياري — تتجاوز المعاينة)'}
                folder="projects"
                value={editing.imageUrl}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
              />
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
