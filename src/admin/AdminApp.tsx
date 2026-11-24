import { useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { seedDefaults } from '@/lib/adminDb';
import { SiteDataProvider, useSiteData } from '@/context/SiteDataContext';
import ProjectsAdmin from './ProjectsAdmin';
import SkillsAdmin from './SkillsAdmin';
import FeaturesAdmin from './FeaturesAdmin';
import SettingsAdmin from './SettingsAdmin';
import MessagesAdmin from './MessagesAdmin';
import { Card, Field, inputCls, btnPrimary, btnGhost } from './ui';
import {
  LayoutDashboard, FolderGit2, Layers, User as UserIcon, Settings, Inbox,
  LogOut, Eye, Database, Loader2, Check, X,
} from 'lucide-react';

type Tab = 'overview' | 'projects' | 'skills' | 'features' | 'settings' | 'messages';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'projects', label: 'المشاريع', icon: FolderGit2 },
  { id: 'skills', label: 'بطاقات المهارات', icon: Layers },
  { id: 'features', label: 'بطاقات "من أنا"', icon: UserIcon },
  { id: 'settings', label: 'إعدادات الموقع', icon: Settings },
  { id: 'messages', label: 'رسائل الزوار', icon: Inbox },
];

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('الإيميل أو كلمة المرور غير صحيحة، أو الحساب غير موجود.');
      } else if (code === 'auth/too-many-requests') {
        setError('محاولات كثيرة — انتظر قليلاً ثم حاول مجدداً.');
      } else if (code === 'auth/network-request-failed') {
        setError('تعذر الاتصال بـ Firebase — تحقق من الإنترنت.');
      } else {
        setError(`فشل تسجيل الدخول (${code || 'خطأ غير معروف'}). تأكد من تفعيل Email/Password في Firebase.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-950 text-ink-200 flex items-center justify-center p-4">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
        className="absolute top-5 left-5 flex items-center justify-center w-10 h-10 rounded-xl glass text-ink-400 hover:text-white hover:bg-white/5 transition-all"
        aria-label="إغلاق والعودة للموقع"
        title="العودة للموقع"
      >
        <X className="w-5 h-5" />
      </a>
      <div className="w-full max-w-md glass-strong lux-border rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-gold-500 text-ink-950 font-extrabold text-xl mb-3">أ</div>
          <h1 className="text-xl font-bold text-white">لوحة تحكم الموقع</h1>
          <p className="text-sm text-ink-500 mt-1">سجّل دخولك للمتابعة</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="البريد الإلكتروني">
            <input className={inputCls} dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
          </Field>
          <Field label="كلمة المرور">
            <input className={inputCls} dir="ltr" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}

function Overview() {
  const { projects, skills, features, settings, firebaseReady } = useSiteData();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const stats = [
    { label: 'المشاريع', value: projects.length },
    { label: 'بطاقات المهارات', value: skills.length },
    { label: 'بطاقات "من أنا"', value: features.length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-3xl font-extrabold text-white">{s.value}</div>
            <div className="text-sm text-ink-500 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card title="حالة Firebase">
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${firebaseReady ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span className="text-ink-200">
            {firebaseReady ? 'متصل بـ Firebase بنجاح' : 'إعدادات Firebase غير موجودة — أضفها في ملف .env'}
          </span>
        </div>
        <p className="text-xs text-ink-500 mt-2">
          الموقع الحالي: {settings.siteName} — {settings.email}
        </p>
      </Card>

      <Card title="تهيئة قاعدة البيانات">
        <p className="text-sm text-ink-400 mb-4">
          إذا كانت المجموعات فارغة، اضغط الزر لملء Firestore بالمحتوى الحالي للموقع
          (المشاريع، المهارات، البطاقات، والإعدادات) لتبدأ التعديل من اللوحة.
        </p>
        <button
          onClick={async () => {
            setSeeding(true);
            try {
              await seedDefaults();
              setSeeded(true);
            } finally {
              setSeeding(false);
            }
          }}
          disabled={seeding || !firebaseReady}
          className={btnPrimary}
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : seeded ? <Check className="w-4 h-4" /> : <Database className="w-4 h-4" />}
          {seeded ? 'تمت التهيئة' : 'استيراد المحتوى الحالي إلى Firebase'}
        </button>
      </Card>
    </div>
  );
}

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-ink-950 text-ink-200">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-gold-500 text-ink-950 font-extrabold text-sm">أ</span>
            <div>
              <div className="text-sm font-bold text-white">لوحة التحكم</div>
              <div className="text-[11px] text-ink-500" dir="ltr">{user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={btnGhost}>
              <Eye className="w-4 h-4" /> معاينة الموقع
            </a>
            <button onClick={onLogout} className={btnGhost}>
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    tab === t.id
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-ink-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main>
            {tab === 'overview' && <Overview />}
            {tab === 'projects' && <ProjectsAdmin />}
            {tab === 'skills' && <SkillsAdmin />}
            {tab === 'features' && <FeaturesAdmin />}
            {tab === 'settings' && <SettingsAdmin />}
            {tab === 'messages' && <MessagesAdmin />}
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminInner() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!auth) { setChecking(false); return; }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-ink-950 text-ink-200 flex items-center justify-center p-4">
        <Card title="Firebase غير مهيأ">
          <p className="text-sm text-ink-400">
            أضف إعدادات Firebase في ملف <code className="text-sky-400" dir="ltr">.env</code> ثم أعد تشغيل التطبيق.
            راجع ملف <code className="text-sky-400" dir="ltr">FIREBASE_SETUP.md</code> للتعليمات.
          </p>
        </Card>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <SiteDataProvider>
      <Dashboard
        user={user}
        onLogout={() => auth && signOut(auth)}
      />
    </SiteDataProvider>
  );
}

export default function AdminApp() {
  return <AdminInner />;
}
