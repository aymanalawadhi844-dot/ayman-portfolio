import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactMessage } from '@/lib/types';
import { Card, btnGhost } from './ui';
import { Inbox, Trash2, Mail, RefreshCw } from 'lucide-react';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    if (!db) { setLoading(false); return; }
    setLoading(true);
    setError('');
    try {
      const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage));
    } catch {
      setError('تعذر تحميل الرسائل.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db!, 'messages', id));
      setMessages((m) => m.filter((x) => x.id !== id));
    } catch {
      setError('فشل الحذف');
    }
  };

  const formatDate = (m: ContactMessage) => {
    const ts = m.createdAt as { toDate?: () => Date } | undefined;
    const d = ts?.toDate?.() ?? (typeof m.createdAt === 'string' ? new Date(m.createdAt) : null);
    return d ? d.toLocaleString('ar') : '';
  };

  return (
    <Card
      title={`رسائل الزوار (${messages.length})`}
      actions={<button onClick={load} className={btnGhost}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> تحديث</button>}
    >
      {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
      {loading ? (
        <p className="text-sm text-ink-500 text-center py-8">جاري التحميل...</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-10 text-ink-500">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">لا توجد رسائل بعد. رسائل نموذج التواصل تظهر هنا.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-sm font-bold text-white">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="text-xs text-sky-400 hover:underline inline-flex items-center gap-1" dir="ltr">
                    <Mail className="w-3 h-3" /> {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-600">{formatDate(m)}</span>
                  <button onClick={() => remove(m.id)} className="p-1.5 text-ink-500 hover:text-rose-400 transition-colors" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
