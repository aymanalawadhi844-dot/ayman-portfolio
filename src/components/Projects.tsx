import { FolderGit2, ExternalLink, Github } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useSiteData } from '@/context/SiteDataContext';
import { getIcon } from '@/lib/icons';
import type { Project } from '@/lib/types';

function ProjectPreview({ type, imageUrl }: { type: Project['preview']; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="معاينة المشروع"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }
  if (type === 'code') {
    return (
      <div className="h-full w-full p-3 font-mono text-[8px] sm:text-[10px] leading-tight space-y-0.5" dir="ltr">
        <div className="text-ink-600">class Library {`{`}</div>
        <div className="text-sky-400 pl-3">Book books[100];</div>
        <div className="text-sky-400 pl-3">int count;</div>
        <div className="text-gold-400 pl-3">void addBook();</div>
        <div className="text-gold-400 pl-3">void borrow();</div>
        <div className="text-gold-400 pl-3">void returnBook();</div>
        <div className="text-ink-600">{`}`};</div>
        <div className="text-emerald-400">Library lib;</div>
        <div className="text-emerald-400">lib.addBook();</div>
        <div className="text-ink-600">// OOP Design ✓</div>
      </div>
    );
  }
  if (type === 'database') {
    return (
      <div className="h-full w-full flex items-center justify-center gap-2 sm:gap-3">
        {['Products', 'Orders', 'Customers'].map((t, i) => (
          <div key={t} className="flex flex-col items-center gap-1">
            <div className="px-2 py-1.5 rounded-md bg-gold-500/15 border border-gold-500/30">
              <div className="text-[8px] sm:text-[9px] font-mono text-gold-400">dbo.{t}</div>
            </div>
            {i < 2 && <div className="text-emerald-400 text-xs">↕</div>}
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        </div>
      </div>
    );
  }
  if (type === 'network') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Hospital icons */}
          <div className="absolute top-2 left-2 px-1.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[7px] sm:text-[8px] font-mono text-emerald-400">Branch A</div>
          <div className="absolute top-2 right-2 px-1.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-[7px] sm:text-[8px] font-mono text-emerald-400">Branch B</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 text-[7px] sm:text-[8px] font-mono text-sky-400">Core Switch</div>
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            <line x1="30" y1="20" x2="100" y2="80" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
            <line x1="170" y1="20" x2="100" y2="80" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
            <line x1="30" y1="20" x2="170" y2="20" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          <div className="text-[7px] sm:text-[8px] font-mono text-ink-500 z-10">VLAN · DHCP · DNS</div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full w-full p-3 space-y-1.5">
      <div className="flex gap-1">
        <div className="w-4 h-4 rounded-full bg-ink-700" />
        <div className="w-4 h-4 rounded-full bg-ink-700" />
        <div className="w-4 h-4 rounded-full bg-ink-700" />
      </div>
      <div className="space-y-1">
        <div className="h-2 w-3/4 rounded bg-sky-500/30" />
        <div className="h-2 w-full rounded bg-ink-700" />
        <div className="h-2 w-5/6 rounded bg-ink-700" />
        <div className="flex gap-1 mt-1.5">
          <div className="h-6 w-12 rounded bg-sky-500/20 border border-sky-500/30" />
          <div className="h-6 w-12 rounded bg-gold-500/20 border border-gold-500/30" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const ref = useReveal<HTMLElement>();
  const { projects } = useSiteData();

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-sky-500/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-emerald-400 font-medium mb-4">
            <FolderGit2 className="w-4 h-4" />
            معرض المشاريع
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            مشاريع <span className="text-gradient">مختارة</span>
          </h2>
          <p className="text-ink-400 max-w-2xl mx-auto text-lg">
            مجموعة من المشاريع البرمجية التي تعكس مهاراتي في مختلف المجالات التقنية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const ProjectIcon = getIcon(project.icon);
            return (
            <article
              key={project.id}
              className={`reveal reveal-delay-${(i % 2) + 1} group relative flex flex-col rounded-2xl glass lux-border overflow-hidden transition-all duration-500 hover:-translate-y-2 h-full`}
            >
              {/* Visual preview */}
              <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${project.accent} border-b border-white/5 overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-lux bg-grid-lux opacity-30" />
                <div className="absolute top-3 left-3 text-5xl font-extrabold text-white/5 font-mono select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="absolute inset-0 p-4">
                  <ProjectPreview type={project.preview} imageUrl={project.imageUrl} />
                </div>
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white/5`}>
                    <ProjectIcon className={`w-5 h-5 ${project.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm text-ink-400 leading-relaxed mb-4">{project.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-ink-300 bg-white/5 border border-white/8 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* GitHub button — consistent across all cards */}
                <div className="mt-auto pt-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sky-400 bg-sky-500/8 border border-sky-500/20 rounded-xl hover:bg-sky-500/15 hover:border-sky-500/35 hover:text-sky-300 transition-all duration-300 group/btn"
                  >
                    <Github className="w-4 h-4 shrink-0" />
                    <span>معاينة الكود على GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-[-2px] transition-transform" />
                  </a>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
