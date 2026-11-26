import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { useAppContext } from '../context/AppContext';

export function AboutPage() {
  const { settings } = useAppContext();

  return (
    <>
      <SeoHead
        title={`About Us – ${settings.siteName}`}
        description="Learn what Short Study is, why the platform was built for coding students and developers, and how we curate programming notes and tech recommendations."
      />

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />

        <header className="border-b border-white/[0.08] pb-6 sm:pb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
            About {settings.siteName}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#9CA3AF]">
            An independent coding and computer science education platform focused on clear study
            notes, verifiable code examples, and practical developer resources.
          </p>
        </header>

        <div className="mt-10 space-y-10 text-sm sm:text-base leading-relaxed text-[#D1D5DB]">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
              What Short Study Is
            </h2>
            <p>
              Short Study is a dedicated educational website designed for school students exploring
              their first programming language, computer science undergraduates preparing for exams
              and technical interviews, and self-taught web or software developers building core
              engineering skills.
            </p>
            <p>
              Instead of burying foundational concepts under long, repetitive articles, Short Study
              organizes programming topics into focused study guides and downloadable PDF reference
              notes that learners can open immediately in a browser or save for offline study.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
              Why the Platform Was Created
            </h2>
            <p>
              Students learning programming often run into two frustrating extremes: overly dense
              reference manuals that assume years of prior experience, or scattered blog posts filled
              with outdated syntax and unverified snippets. Short Study was created to bridge that
              gap with structured, concise, and technically reviewed study material available freely
              to everyone.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 space-y-2">
              <Code2 className="h-5 w-5 text-[#6366F1]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Technical Accuracy
              </h3>
              <p className="text-xs leading-relaxed text-[#9CA3AF]">
                Topics include syntax examples, real-world use cases, and common mistakes so
                learners build habits that hold up in real projects.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 space-y-2">
              <BookOpen className="h-5 w-5 text-[#06B6D4]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Accessible PDF Notes
              </h3>
              <p className="text-xs leading-relaxed text-[#9CA3AF]">
                Downloadable PDFs are categorized clearly by language and updated centrally so
                learners always get clean, readable study materials.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 space-y-2">
              <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                Honest Gear Curation
              </h3>
              <p className="text-xs leading-relaxed text-[#9CA3AF]">
                Product listings highlight specifications, suitable audiences, advantages, and
                limitations alongside clear affiliate disclosures.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
              Our Approach to Technology Recommendations
            </h2>
            <p>
              In addition to programming education, Short Study maintains a curated Affiliate
              Products section covering keyboards, mice, laptops, audio gear, storage devices, and
              study accessories. Every recommendation includes clear specifications and honest
              notes on who the product fits best—as well as any limitations—so students can make
              informed purchasing decisions. When affiliate links are used, Short Study discloses
              them clearly and transparently.
            </p>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#090F1C] p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#F9FAFB]">
                Questions, topic requests, or feedback?
              </h2>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Reach out directly via email or our contact form.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-indigo-500 whitespace-nowrap shrink-0"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
