import { useEffect, useState } from 'react';
import { Menu, X, MessageCircle, Copy, Check, Settings } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من أنا' },
  { href: '#skills', label: 'المهارات' },
  { href: '#projects', label: 'المشاريع' },
  { href: '#contact', label: 'تواصل معي' },
];

export default function Navbar() {
  const { settings } = useSiteData();
  const WHATSAPP = `https://wa.me/${settings.whatsapp}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(settings.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${settings.email}`;
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-2xl shadow-black/40' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group shrink-0">
          <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-gold-500 text-ink-950 font-extrabold shadow-lg shadow-sky-500/20 group-hover:shadow-gold-500/30 transition-all duration-300 group-hover:scale-110">
            <span className="text-sm">أ</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-gold-400 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
          </span>
          <span className="text-lg font-bold text-white tracking-tight">
            {settings.siteName}
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-ink-400 hover:text-white transition-all duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-sky-400 to-gold-400 group-hover:w-3/4 transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Quick actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={copyEmail}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-ink-300 hover:text-white glass rounded-xl hover:bg-white/5 transition-all duration-300"
          >
            {copied ? <Check className="w-4 h-4 text-gold-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'تم النسخ' : 'نسخ البريد'}
          </button>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-950 bg-gradient-to-r from-sky-400 to-gold-400 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 hover:scale-105 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            واتساب
          </a>
          <a
            href="#/admin"
            className="flex items-center justify-center w-10 h-10 glass rounded-xl text-ink-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="لوحة التحكم"
            title="لوحة التحكم"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg glass text-white"
          aria-label="القائمة"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="glass-strong px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-ink-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { copyEmail(); setOpen(false); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-ink-200 glass rounded-xl"
            >
              {copied ? <Check className="w-4 h-4 text-gold-400" /> : <Copy className="w-4 h-4" />}
              نسخ البريد
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-ink-950 bg-gradient-to-r from-sky-400 to-gold-400 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
