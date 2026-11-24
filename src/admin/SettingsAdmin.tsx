import { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';
import { saveSettings } from '@/lib/adminDb';
import type { SiteSettings } from '@/lib/types';
import { Card, Field, inputCls, btnPrimary } from './ui';
import ImageField from './ImageField';

export default function SettingsAdmin() {
  const { settings, refresh } = useSiteData();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const data = form ?? settings;
  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm({ ...data, [key]: value });

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveSettings(data);
      await refresh();
      setForm(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('فشل الحفظ، تحقق من صلاحيات Firebase.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <Check className="w-4 h-4" /> تم حفظ الإعدادات بنجاح
        </p>
      )}

      <Card title="الهوية والصورة">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم الموقع (الشريط العلوي والفوتر)">
            <input className={inputCls} value={data.siteName} onChange={(e) => set('siteName', e.target.value)} />
          </Field>
          <Field label="الاسم الأول (قسم البطل)">
            <input className={inputCls} value={data.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </Field>
          <Field label="الاسم الثاني / العائلة">
            <input className={inputCls} value={data.fullNameEn} onChange={(e) => set('fullNameEn', e.target.value)} />
          </Field>
          <Field label="اسم حقوق النشر">
            <input className={inputCls} value={data.copyrightName} onChange={(e) => set('copyrightName', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              label="صورة البروفايل"
              folder="profile"
              value={data.profileImageUrl}
              onChange={(url) => set('profileImageUrl', url)}
            />
          </div>
        </div>
      </Card>

      <Card title="روابط التواصل">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="البريد الإلكتروني">
            <input className={inputCls} dir="ltr" value={data.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="رقم واتساب (مع رمز الدولة، بدون +)">
            <input className={inputCls} dir="ltr" value={data.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="9677XXXXXXX" />
          </Field>
          <Field label="رابط GitHub">
            <input className={inputCls} dir="ltr" value={data.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} />
          </Field>
          <Field label="رابط LinkedIn (اختياري)">
            <input className={inputCls} dir="ltr" value={data.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </Field>
        </div>
      </Card>

      <Card title="نصوص قسم البطل (Hero)">
        <div className="space-y-4">
          <Field label="الشارة العلوية">
            <input className={inputCls} value={data.heroBadge} onChange={(e) => set('heroBadge', e.target.value)} />
          </Field>
          <Field label="العناوين المتحركة (سطر لكل عنوان)">
            <textarea
              className={`${inputCls} min-h-[110px] resize-y`}
              dir="rtl"
              value={data.heroTitles.join('\n')}
              onChange={(e) => set('heroTitles', e.target.value.split('\n').map((t) => t.trim()).filter(Boolean))}
            />
          </Field>
          <Field label="النص التعريفي">
            <textarea className={`${inputCls} min-h-[90px] resize-y`} value={data.heroBio} onChange={(e) => set('heroBio', e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="إحصائية المشاريع">
              <input className={inputCls} value={data.statsProjects} onChange={(e) => set('statsProjects', e.target.value)} />
            </Field>
            <Field label="إحصائية المهارات">
              <input className={inputCls} value={data.statsSkills} onChange={(e) => set('statsSkills', e.target.value)} />
            </Field>
            <Field label="إحصائية التخصص">
              <input className={inputCls} value={data.statsField} onChange={(e) => set('statsField', e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title={'نصوص قسم "من أنا"'}>
        <div className="space-y-4">
          <Field label="العنوان الرئيسي" hint="آخر كلمة تُعرض بتدرج لوني تلقائياً">
            <input className={inputCls} value={data.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} />
          </Field>
          <Field label="العنوان الفرعي">
            <textarea className={`${inputCls} min-h-[70px] resize-y`} value={data.aboutSubtitle} onChange={(e) => set('aboutSubtitle', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="نصوص الفوتر">
        <div className="space-y-4">
          <Field label="وصف الفوتر">
            <input className={inputCls} value={data.footerDescription} onChange={(e) => set('footerDescription', e.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ كل الإعدادات
        </button>
      </div>
    </div>
  );
}
