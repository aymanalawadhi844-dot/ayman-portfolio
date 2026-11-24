import { useEffect, useState, useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useSiteData } from '@/context/SiteDataContext';
import { getIcon } from '@/lib/icons';

const CODE_LINES = [
  { text: 'const developer = {', indent: 0, color: '' },
  { text: 'name: "أيمن سعيد العواضي",', indent: 1, color: 'text-sky-400' },
  { text: 'role: "Software & Web Developer",', indent: 1, color: 'text-gold-400' },
  { text: 'field: "Information Technology",', indent: 1, color: 'text-emerald-400' },
  { text: 'skills: {', indent: 1, color: 'text-ink-300' },
  { text: 'web: ["HTML5", "CSS3", "JS", "PHP"],', indent: 2, color: 'text-sky-300' },
  { text: 'mobile: ["C++", "C#", "Flutter"],', indent: 2, color: 'text-violet-400' },
  { text: 'db: ["SQL Server", "SQLite"],', indent: 2, color: 'text-emerald-300' },
  { text: 'security: ["Network Security", "Cisco"]', indent: 2, color: 'text-gold-300' },
  { text: '},', indent: 1, color: 'text-ink-300' },
  { text: 'available: true,', indent: 1, color: 'text-rose-400' },
  { text: '};', indent: 0, color: '' },
];

export default function About() {
  const ref = useReveal<HTMLElement>();
  const { settings, features } = useSiteData();
  const [typedLines, setTypedLines] = useState(0);
  const codeRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!codeRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(codeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || typedLines >= CODE_LINES.length) return;
    const timer = setTimeout(() => setTypedLines((n) => n + 1), 200);
    return () => clearTimeout(timer);
  }, [typedLines, started]);

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-sky-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-sky-400 font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            من أنا
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {settings.aboutTitle.split(' ').map((w, i, arr) =>
              i === arr.length - 2 ? (
                <span key={i}>{w} </span>
              ) : i === arr.length - 1 ? (
                <span key={i} className="text-gradient">{w}</span>
              ) : (
                <span key={i}>{w} </span>
              )
            )}
          </h2>
          <p className="text-ink-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {settings.aboutSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Code card — LTR only */}
          <div ref={codeRef} className="reveal reveal-delay-1 order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-gold-500/15 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

              <div className="relative glass-strong rounded-2xl overflow-hidden shadow-2xl lux-border">
                {/* macOS title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-ink-950/60" dir="ltr">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-xs font-mono text-ink-500">developer.js</span>
                  <span className="ml-auto text-xs font-mono text-ink-600">UTF-8</span>
                </div>

                {/* Code body */}
                <div className="p-5 font-mono text-sm leading-relaxed bg-ink-950/40 min-h-[340px]" dir="ltr">
                  <pre className="whitespace-pre text-left">
                    {CODE_LINES.slice(0, typedLines).map((line, i) => (
                      <div key={i} className="flex animate-fade-in">
                        <span className="text-ink-600 select-none w-7 text-right shrink-0">{i + 1}</span>
                        <span className="text-ink-200 pl-3">
                          {'  '.repeat(line.indent)}
                          <span className={line.color || 'text-ink-200'}>{line.text}</span>
                        </span>
                      </div>
                    ))}
                    {typedLines < CODE_LINES.length && (
                      <span className="inline-block w-2 h-4 bg-sky-400 animate-blink align-middle ml-3" />
                    )}
                  </pre>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-ink-950/60 text-xs" dir="ltr">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono">Available for work</span>
                  </span>
                  <span className="font-mono text-ink-600">JavaScript • Node.js</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="reveal reveal-delay-2 order-1 lg:order-2 grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const FIcon = getIcon(f.icon);
              return (
              <div
                key={f.id}
                className={`group relative p-5 rounded-2xl glass lux-border hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 ${i % 2 === 0 ? 'sm:mt-0' : 'sm:mt-6'}`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <FIcon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
