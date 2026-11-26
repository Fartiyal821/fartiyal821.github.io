import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Code2,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { HeroCodeExplorer } from '../components/HeroCodeExplorer';
import { SeoHead } from '../components/SeoHead';
import { useAppContext } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../data/curriculumContent';

const LANGUAGE_TRACKS = [
  { name: 'Python', summary: 'Variables, functions, data structures, OOP, and file handling.' },
  { name: 'C Programming', summary: 'Memory layout, arrays, functions, pointers, and structures.' },
  { name: 'C++', summary: 'Classes, constructors, RAII, inheritance, and polymorphism.' },
  { name: 'JavaScript', summary: 'Modern ES syntax, asynchronous patterns, and DOM safety.' },
  { name: 'HTML & CSS', summary: 'Semantic markup, Flexbox, CSS Grid, and responsive layouts.' },
  { name: 'SQL & Databases', summary: 'Relational modeling, normalization, and structured queries.' },
  {
    name: 'Data Structures and Algorithms',
    summary: 'Complexity analysis, trees, graphs, sorting, and searching.'
  },
  {
    name: 'Computer Science Fundamentals',
    summary: 'Operating systems, networking protocols, and software engineering.'
  }
];

const HOME_FAQS = [
  {
    q: 'Are the programming notes on Short Study free to read and download?',
    a: 'Yes. All published coding notes and reference PDFs on Short Study are freely accessible to students, beginners, and developers without requiring registration or paywalls.'
  },
  {
    q: 'How are PDF coding notes organized and kept accurate?',
    a: 'Every note is categorized by language or computer science subject, accompanied by clear explanations, verified syntax examples, and last-updated dates managed directly through our content database.'
  },
  {
    q: 'How does Short Study select recommended technology products?',
    a: 'Our Affiliate Products section highlights practical hardware and tools relevant to programming students and developers, noting key specifications, suitable audiences, advantages, and limitations alongside a transparent affiliate disclosure.'
  },
  {
    q: 'Can I request a specific programming topic or report a technical correction?',
    a: 'Yes. Use the Contact Us page or email gauravfartiyal751@gmail.com to suggest new study guides or flag any technical improvement.'
  }
];

export function HomePage() {
  const { settings } = useAppContext();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <SeoHead
        title={settings.seoTitle}
        description={settings.seoDescription}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: settings.siteName,
          description: settings.siteDescription,
          url: window.location.origin,
          publisher: {
            '@type': 'Organization',
            name: settings.siteName,
            email: settings.contactEmail,
            sameAs: [settings.instagramUrl]
          }
        }}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#030712]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b from-indigo-600/15 via-cyan-500/5 to-transparent blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-9 lg:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 min-w-0 space-y-5 sm:space-y-6">
              <p className="text-sm font-medium text-[#06B6D4]">
                Structured Programming &amp; Computer Science Education
              </p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-5xl text-balance leading-[1.12]">
                Learn to Code. Build Your Future.
              </h1>
              <p className="text-base leading-relaxed text-[#9CA3AF] sm:text-lg max-w-xl">
                Explore programming notes, computer science concepts, practical learning resources,
                and carefully selected technology products &mdash; all in one place.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <Link
                  to="/coding-notes"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 whitespace-nowrap"
                >
                  <span>Explore Coding Notes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/affiliate-products"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#090F1C] px-5 py-3 text-sm font-semibold text-[#F9FAFB] transition-colors hover:border-white/30 hover:bg-[#111827] whitespace-nowrap"
                >
                  <span>Explore Tech Products</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <HeroCodeExplorer />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Introduction to Short Study */}
      <section className="border-b border-white/[0.08] bg-[#090F1C]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl text-balance">
                Built for clarity, technical accuracy, and steady progress
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-[#9CA3AF]">
              <p>
                Short Study is an educational platform created for school learners, beginner
                programmers, computer science undergraduates, and working developers who want concise,
                well-structured study material without clutter or paywalls.
              </p>
              <p>
                Every study module pairs clear concept explanations with verified code examples,
                real-world engineering context, and downloadable PDF reference sheets, alongside
                transparently disclosed technology hardware recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Programming Languages */}
      <section className="border-b border-white/[0.08] bg-[#090F1C]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="mb-7 sm:mb-8 max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl">
              Programming Languages &amp; Core Tracks
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Browse notes by language or computer science subject to focus on what you are learning next.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LANGUAGE_TRACKS.map((track) => (
              <Link
                key={track.name}
                to={`/coding-notes?category=${encodeURIComponent(track.name)}`}
                className="group rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6 transition-colors hover:border-indigo-500/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-[#F9FAFB] group-hover:text-indigo-300 transition-colors">
                    {track.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[#6B7280] group-hover:text-[#06B6D4] transition-colors shrink-0" />
                </div>
                <p className="mt-2 text-sm sm:text-xs leading-relaxed text-[#9CA3AF]">{track.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Latest Learning Resources (Original Curriculum Modules) */}
      <section className="border-b border-white/[0.08] bg-[#030712]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="mb-7 sm:mb-8 max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl">
              Latest Learning Resources
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Original concept guides featuring syntax examples, common pitfalls, and practical use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CURRICULUM_MODULES.map((mod) => (
              <article
                key={mod.slug}
                className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6 transition-colors hover:border-white/20"
              >
                <div>
                  <p className="text-xs font-medium text-[#06B6D4]">
                    {mod.category} <span aria-hidden="true">&middot;</span> {mod.topics.length} lessons
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-[#F9FAFB] leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#9CA3AF]">
                    {mod.shortSummary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <Link
                    to={`/learn/${mod.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white transition-colors"
                  >
                    <span>Read Study Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Learn With Short Study? */}
      <section className="border-b border-white/[0.08] bg-[#030712]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 sm:mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl">
              Why Learn With Short Study?
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Designed around how students and engineers actually study, review, and build.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-6 space-y-3">
              <Code2 className="h-6 w-6 text-[#6366F1]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Code-First Explanations
              </h3>
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                Concepts are paired directly with clean syntax examples, common mistakes to avoid,
                and realistic engineering scenarios rather than filler prose.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-6 space-y-3">
              <BookOpen className="h-6 w-6 text-[#06B6D4]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Offline-Ready PDF Notes
              </h3>
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                Open notes immediately in your browser tab or download genuine PDF files organized by
                language for exam revision and interview prep.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-6 space-y-3">
              <ShieldCheck className="h-6 w-6 text-[#10B981]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Transparent Disclosures
              </h3>
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                Clear privacy policies, honest hardware trade-offs, and explicit affiliate
                disclosures so learners know exactly how the platform operates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="border-b border-white/[0.08] bg-[#090F1C]">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#111827]">
            {HOME_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 text-left text-sm sm:text-base font-medium text-[#F9FAFB] hover:bg-white/[0.02]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 text-sm leading-relaxed text-[#9CA3AF]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Educational Disclaimer */}
      <section className="bg-[#030712]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#090F1C] p-5 sm:p-6 sm:flex-row sm:items-start sm:gap-4">
            <Layers className="h-5 w-5 shrink-0 text-[#9CA3AF] mt-0.5" />
            <div className="space-y-1">
              <h2 className="font-display text-sm font-semibold text-[#F9FAFB]">
                Educational Disclaimer
              </h2>
              <p className="text-xs leading-relaxed text-[#9CA3AF]">
                All programming notes, syntax examples, and computer science tutorials on Short Study
                are published strictly for educational reference. While content is checked for
                technical accuracy, verify compiler versions, API behaviors, and production security
                requirements in your target environment. See our full{' '}
                <Link to="/disclaimer" className="text-indigo-300 underline hover:text-white">
                  Disclaimer
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
