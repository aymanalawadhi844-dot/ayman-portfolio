import { Github, Mail, ArrowUp, MessageCircle } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

const QUICK_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من أنا' },
  { href: '#skills', label: 'المهارات' },
  { href: '#projects', label: 'المشاريع' },
  { href: '#contact', label: 'تواصل معي' },
];

export default function Footer() {
  const { settings } = useSiteData();
  return (
    <footer className="relative border-t border-white/5 bg-ink-950 mt-16">
      <div className="absolute inset-0 bg-grid-lux bg-grid-lux opacity-20" />
      {/* Top shimmer line */}
      <div className="h-px shimmer-line" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center sm:text-right">
            <div className="flex items-center gap-2.5 justify-center sm:justify-start mb-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-gold-500 text-ink-950 font-extrabold text-sm">
                أ
              </span>
              <span className="text-lg font-bold text-white">{settings.siteName}</span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed max-w-xs mx-auto sm:mx-0">
              {settings.footerDescription}
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center">
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-500 hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white mb-4">تابعني</h4>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg glass text-ink-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg glass text-ink-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                aria-label="واتساب"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center justify-center w-10 h-10 rounded-lg glass text-ink-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                aria-label="البريد الإلكتروني"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-600 text-center">
            جميع الحقوق محفوظة © 2026 {settings.copyrightName}
          </p>

          <a
            href="#home"
            className="flex items-center gap-2 text-sm text-ink-500 hover:text-sky-400 transition-colors group"
          >
            <span>العودة للأعلى</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg glass group-hover:bg-sky-500/10 transition-colors">
              <ArrowUp className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
