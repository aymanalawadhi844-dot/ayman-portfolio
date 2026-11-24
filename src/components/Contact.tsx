import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, Github, User, AlertCircle, MessageCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useSiteData } from '@/context/SiteDataContext';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const { settings } = useSiteData();
  const EMAIL = settings.email;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp}`;
  const GITHUB_URL = settings.githubUrl;
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      if (db && isFirebaseConfigured) {
        await addDoc(collection(db, 'messages'), {
          name: form.name,
          email: form.email,
          message: form.message,
          createdAt: serverTimestamp(),
        });
      } else {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: 'c3bf82d5-7ba8-4f9b-804f-34db21e272c5',
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `رسالة جديدة من موقعك الشخصي - ${form.name}`,
          }),
        });
        const result = await response.json();
        if (!result.success) {
          setStatus('error');
          setErrorMsg(result.message || 'حدث خطأ أثناء الإرسال، حاول مرة أخرى.');
          return;
        }
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('تعذر الاتصال بالخادم، تأكد من اتصالك بالإنترنت.');
    }
  };
  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/6 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-gold-400 font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            تواصل معي
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            لنعمل <span className="text-gradient">معاً</span>
          </h2>
          <p className="text-ink-400 max-w-2xl mx-auto text-lg">
            هل لديك مشروع أو فكرة؟ تواصل معي وسأرد عليك في أقرب وقت ممكن.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info + quick actions */}
          <div className="lg:col-span-2 space-y-4 reveal">
            <h3 className="text-xl font-bold text-white mb-2">روابط التواصل</h3>
            <p className="text-sm text-ink-400 mb-6">
              يمكنك التواصل معي مباشرة عبر أي من هذه القنوات.
            </p>

            <div className="space-y-3">
              {/* WhatsApp — prominent */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-400/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-500/20 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">تواصل سريع عبر واتساب</div>
                  <div className="text-xs text-ink-500">اضغط لإرسال رسالة مباشرة</div>
                </div>
                <Send className="w-4 h-4 text-emerald-400 group-hover:translate-x-[-3px] transition-transform" />
              </a>

              {/* GitHub */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl glass border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5 text-ink-200" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink-100">GitHub</div>
                  <div className="text-xs text-ink-500">{GITHUB_URL.split('/').filter(Boolean).pop()}</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-white/8 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300 hover:scale-[1.02] group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-sky-500/10 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-sky-400" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink-100">البريد الإلكتروني</div>
                  <div className="text-xs text-ink-500">{EMAIL}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact form — centered glass card */}
          <div className="lg:col-span-3 reveal reveal-delay-1 flex items-start justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl glass-strong lux-border rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name — right in RTL */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink-200 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="اسمك الكامل"
                      className="w-full pr-10 pl-4 py-3 text-sm text-white bg-ink-950/60 border border-white/8 rounded-xl focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/15 transition-all placeholder:text-ink-600"
                    />
                  </div>
                </div>

                {/* Email — left in RTL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink-200 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full pr-10 pl-4 py-3 text-sm text-white bg-ink-950/60 border border-white/8 rounded-xl focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/15 transition-all placeholder:text-ink-600"
                    />
                  </div>
                </div>
              </div>

              {/* Message — full width */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink-200 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-3 text-sm text-white bg-ink-950/60 border border-white/8 rounded-xl focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/15 transition-all placeholder:text-ink-600 resize-none"
                />
              </div>

              {/* Centered standalone button */}
              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-ink-950 bg-gradient-to-r from-sky-400 to-gold-400 rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-gold-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                >
                  {status === 'loading' && (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تم إرسال الرسالة بنجاح!
                    </>
                  )}
                  {(status === 'idle' || status === 'error') && (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>شكراً لك! تم استلام رسالتك وسأرد عليك قريباً.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
