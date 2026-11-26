import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Code2, Lightbulb } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { CURRICULUM_MODULES } from '../data/curriculumContent';

export function LearnGuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const moduleData = CURRICULUM_MODULES.find((m) => m.slug === slug);

  if (!moduleData) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">Study guide not found</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          The requested programming module could not be located.
        </p>
        <Link
          to="/coding-notes"
          className="mt-6 inline-flex items-center rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to Coding Notes
        </Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={`${moduleData.title} – Short Study`}
        description={moduleData.shortSummary}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: moduleData.title,
            description: moduleData.shortSummary,
            author: { '@type': 'Organization', name: 'Short Study' },
            publisher: { '@type': 'Organization', name: 'Short Study' }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Coding Notes',
                item: `${window.location.origin}/coding-notes`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: moduleData.category,
                item: window.location.href
              }
            ]
          }
        ]}
      />

      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12 min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Coding Notes', to: '/coding-notes' },
            { label: moduleData.category }
          ]}
        />

        <header className="border-b border-white/[0.08] pb-6 sm:pb-8">
          <p className="text-xs font-medium text-[#06B6D4]">{moduleData.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl text-balance">
            {moduleData.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#9CA3AF]">
            {moduleData.shortSummary}
          </p>
        </header>

        {/* Learning Objectives */}
        <section className="mt-8 rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-[#F9FAFB] mb-3">
            Learning Objectives
          </h2>
          <ul className="space-y-2 text-sm text-[#D1D5DB]">
            {moduleData.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981] mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Topics */}
        <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-10 min-w-0">
          {moduleData.topics.map((topic, idx) => (
            <section
              key={idx}
              className="rounded-xl border border-white/[0.08] bg-[#090F1C] p-5 sm:p-7 space-y-5 min-w-0"
            >
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#F9FAFB]">
                  {idx + 1}. {topic.title}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#D1D5DB]">
                  {topic.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#030712] overflow-hidden min-w-0 max-w-full">
                <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#111827] px-4 py-2 text-xs font-mono text-[#9CA3AF]">
                  <Code2 className="h-3.5 w-3.5 text-[#06B6D4] shrink-0" />
                  <span className="truncate">{topic.syntaxLabel}</span>
                </div>
                <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-[#E5E7EB]">
                  <code>{topic.code}</code>
                </pre>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed">
                <div className="rounded-lg border border-white/[0.06] bg-[#111827] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[#06B6D4]">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Real-World Use Case</span>
                  </div>
                  <p className="text-[#9CA3AF]">{topic.realWorldUseCase}</p>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-[#111827] p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Common Mistake to Avoid</span>
                  </div>
                  <p className="text-[#9CA3AF]">{topic.commonMistake}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* FAQs */}
        {moduleData.faqs.length > 0 && (
          <section className="mt-12 border-t border-white/[0.08] pt-8 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
              Topic Questions &amp; Answers
            </h2>
            <div className="space-y-4">
              {moduleData.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 space-y-1.5"
                >
                  <h3 className="text-sm font-semibold text-[#F9FAFB]">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-[#9CA3AF]">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-6">
          <Link
            to={`/coding-notes?category=${encodeURIComponent(moduleData.category)}`}
            className="text-sm font-medium text-[#06B6D4] hover:text-cyan-300"
          >
            Check downloadable PDFs for {moduleData.category} &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}
