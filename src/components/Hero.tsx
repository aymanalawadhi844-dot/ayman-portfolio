import { useEffect, useState, useRef } from 'react';
import { ArrowDown, FolderGit2, Send, Code2, Terminal } from 'lucide-react';
import { useSiteData } from '@/context/SiteDataContext';

function useTypingEffect(texts: string[], typeSpeed = 80, deleteSpeed = 40, pauseTime = 1800) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index % texts.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timer = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timer = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, deleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index, texts, typeSpeed, deleteSpeed, pauseTime]);

  return text;
}

export default function Hero() {
  const { settings } = useSiteData();
  const typed = useTypingEffect(settings.heroTitles.length ? settings.heroTitles : ['مطور']);
  const imgRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMousePos({ x: (e.clientX - cx) / 30, y: (e.clientY - cy) / 30 });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-lux bg-grid-lux opacity-60" />
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gold-500/8 rounded-full blur-3xl animate-glow-pulse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Right column — text */}
          <div className="text-center lg:text-right space-y-6 animate-fade-up">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm text-ink-200 font-medium">{settings.heroBadge}</span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15]">
              <span className="text-white">{settings.fullName}</span>{' '}
              <span className="text-gradient">{settings.fullNameEn}</span>
            </h1>
            <p className="text-xs font-mono text-ink-500 tracking-widest" dir="ltr">
              Ayman Saeed Al-Awadhi
            </p>

            {/* Typing effect */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-lg sm:text-xl">
              <span className="text-ink-300 font-medium min-h-[1.8em] flex items-center">
                {typed}
                <span className="inline-block w-0.5 h-6 bg-sky-400 animate-blink mr-1" />
              </span>
            </div>

            {/* Bio */}
            <p className="text-base sm:text-lg text-ink-400 leading-relaxed max-w-xl mx-auto lg:mx-0 lg:ml-auto">
              {settings.heroBio}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-ink-950 bg-gradient-to-r from-sky-400 to-gold-400 rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-gold-500/20 hover:scale-105 transition-all duration-300"
              >
                <FolderGit2 className="w-5 h-5" />
                استكشف مشاريعي
              </a>
              <a
                href="#contact"
                className="group flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-ink-100 glass lux-border rounded-xl hover:bg-white/5 hover:scale-105 transition-all duration-300"
              >
                <Send className="w-5 h-5 text-sky-400" />
                تواصل معي
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-white">{settings.statsProjects}</div>
                <div className="text-xs text-ink-500 mt-1">مشاريع</div>
              </div>
              <div className="w-px h-12 bg-ink-700" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-gradient-sky">{settings.statsSkills}</div>
                <div className="text-xs text-ink-500 mt-1">مهارة تقنية</div>
              </div>
              <div className="w-px h-12 bg-ink-700" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-gradient-gold">{settings.statsField}</div>
                <div className="text-xs text-ink-500 mt-1">تخصص</div>
              </div>
            </div>
          </div>

          {/* Left column — Profile with glow ring */}
          <div
            ref={imgRef}
            className="flex justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div
              className="relative animate-float overflow-visible"
              style={{
                transform: `perspective(800px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              {/* Outer rotating gradient ring */}
              <div className="absolute inset-0 -m-6 rounded-full animate-ring-rotate">
                <div className="w-full h-full rounded-full border-2 border-transparent" style={{
                  background: 'linear-gradient(135deg, rgba(56,189,248,0.4), rgba(251,191,36,0.3), transparent, rgba(56,189,248,0.2)) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }} />
              </div>

              {/* Glow halo */}
              <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-sky-500/20 to-gold-500/15 blur-2xl animate-glow-pulse" />

              {/* Profile circle */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-white/10 bg-gradient-to-br from-sky-500/10 via-ink-900/20 to-gold-500/10 animate-frame-glow overflow-hidden">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400/15 to-gold-400/10 blur-xl" />
                  <img
                    src={settings.profileImageUrl}
                    alt="أيمن سعيد العواضي"
                    className="relative z-10 h-full w-full object-cover scale-[1.18] translate-y-6 -translate-x-2 bg-[#0b1020]"
                    loading="eager"
                    style={{ objectPosition: '70% 75%' }}
                  />
                </div>
              </div>

              {/* Floating tech badge */}
              <div className="absolute -bottom-2 -left-4 sm:-left-8 flex items-center gap-2 px-4 py-2.5 glass-strong rounded-2xl shadow-xl z-20">
                <Terminal className="w-5 h-5 text-sky-400" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white">Software Engineer</div>
                  <div className="text-[10px] text-ink-500 font-mono">developer.js</div>
                </div>
              </div>

              {/* Floating code badge */}
              <div className="absolute -top-2 -right-2 sm:-right-6 flex items-center gap-2 px-3.5 py-2 glass-strong rounded-xl shadow-xl animate-float z-20" style={{ animationDelay: '1s' }}>
                <Code2 className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-mono text-ink-300">&lt;/&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-600 hover:text-sky-400 transition-colors animate-float"
        aria-label="تمرير للأسفل"
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
}
