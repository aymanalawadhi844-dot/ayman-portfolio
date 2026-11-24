import { Layers } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useSiteData } from '@/context/SiteDataContext';
import { getIcon } from '@/lib/icons';

export default function Skills() {
  const ref = useReveal<HTMLElement>();
  const { skills: cards } = useSiteData();

  return (
    <section id="skills" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gold-500/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-gold-400 font-medium mb-4">
            <Layers className="w-4 h-4" />
            المهارات التقنية
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            مهاراتي <span className="text-gradient">التقنية</span>
          </h2>
          <p className="text-ink-400 max-w-2xl mx-auto text-lg">
            مجموعة متكاملة من المهارات في تطوير الويب، البرمجة، قواعد البيانات، وأمن الشبكات.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-3 gap-5 auto-rows-fr">
          {cards.map((card, i) => {
            const CardIcon = getIcon(card.icon);
            return (
            <div
              key={card.id}
              className={`reveal reveal-delay-${i + 1} ${card.span} group relative p-6 rounded-2xl glass lux-border hover:bg-white/5 transition-all duration-400 hover:-translate-y-1.5`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                  <CardIcon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">{card.desc}</p>
                </div>
              </div>

              {/* Tech badges / pills */}
              <div className="flex flex-wrap gap-2.5 mt-4">
                {card.skills.map((skill) => {
                  const SkillIcon = getIcon(skill.icon);
                  return (
                  <span
                    key={skill.name}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-ink-300 bg-white/5 border border-white/8 rounded-full transition-all duration-300 ${card.hoverColor}`}
                  >
                    <SkillIcon className="w-3.5 h-3.5 opacity-70" />
                    {skill.name}
                  </span>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
