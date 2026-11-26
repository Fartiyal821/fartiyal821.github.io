import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, FileText, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PdfNoteCard } from '../components/PdfNoteCard';
import { SeoHead } from '../components/SeoHead';
import { CURRICULUM_MODULES } from '../data/curriculumContent';
import { subscribePublishedNotes } from '../services/repository';
import { CODING_CATEGORIES, type CodingNote } from '../types';

type SortOption = 'newest' | 'updated' | 'title';

export function CodingNotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [notes, setNotes] = useState<CodingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) setSelectedCategory(paramCat);
  }, [searchParams]);

  useEffect(() => {
    const unsub = subscribePublishedNotes(
      (items) => {
        setNotes(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Unable to load coding notes.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = notes.filter((note) => {
      const catMatch = selectedCategory === 'All' || note.language === selectedCategory;
      const textMatch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.description.toLowerCase().includes(q) ||
        note.language.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'updated') return b.updatedAt.getTime() - a.updatedAt.getTime();
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [notes, selectedCategory, searchQuery, sortBy]);

  return (
    <>
      <SeoHead
        title="Coding Notes & Printable Programming PDFs – Short Study"
        description="Search and download original programming PDF notes across Python, C, C++, JavaScript, HTML, CSS, SQL, DSA, and Computer Science fundamentals."
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Coding Notes' }]} />

        <div className="flex flex-col gap-3 sm:gap-4 border-b border-white/[0.08] pb-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
              Coding Notes Library
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Open concise programming PDFs directly in your browser or download them for offline
              revision across core languages and computer science topics.
            </p>
          </div>
          <div className="text-sm text-[#9CA3AF] tabular-nums shrink-0">
            <span className="font-mono font-semibold text-[#F9FAFB]">{filteredNotes.length}</span>{' '}
            {filteredNotes.length === 1 ? 'PDF resource' : 'PDF resources'} available
          </div>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-3.5 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDFs by title, topic, or language..."
              aria-label="Search coding notes"
              className="w-full rounded-lg border border-white/10 bg-[#090F1C] py-2.5 pl-10 pr-4 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <label htmlFor="notes-sort" className="text-xs font-medium text-[#9CA3AF] whitespace-nowrap">
              Sort by
            </label>
            <select
              id="notes-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 sm:flex-none rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="updated">Recently Updated</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Bar — horizontal swipe strip on mobile, wrapped on desktop */}
        <div
          role="tablist"
          aria-label="Programming categories"
          className="mt-5 -mx-5 px-5 md:mx-0 md:px-0 flex overflow-x-auto no-scrollbar md:flex-wrap items-center gap-2 border-b border-white/[0.06] pb-5 md:pb-6"
        >
          {['All', ...CODING_CATEGORIES].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleCategorySelect(cat)}
                className={`shrink-0 rounded-lg px-3.5 py-2 md:px-3 md:py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-[#111827] text-[#9CA3AF] border border-white/[0.08] hover:text-[#F9FAFB] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* PDF List */}
        <div className="mt-8">
          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-sm text-rose-200">
              {error}
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-xl border border-white/[0.06] bg-[#111827] animate-pulse"
                />
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <PdfNoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center">
              <FileText className="mx-auto h-9 w-9 text-indigo-400" />
              <h2 className="mt-3 font-display text-lg font-semibold text-[#F9FAFB]">
                {notes.length === 0
                  ? 'No published PDF notes yet'
                  : 'No PDF notes match your current filter'}
              </h2>
              <p className="mt-1.5 text-sm text-[#9CA3AF] max-w-md mx-auto">
                {notes.length === 0
                  ? 'Once you add and publish PDF notes through the Admin Dashboard, they appear here automatically.'
                  : 'Try clearing your search term or switching back to All categories.'}
              </p>
              {selectedCategory !== 'All' || searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleCategorySelect('All');
                  }}
                  className="mt-5 rounded-lg border border-white/15 bg-[#090F1C] px-4 py-2 text-sm font-medium text-[#F9FAFB] hover:bg-white/5"
                >
                  Reset Filters
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Original Written Study Guides Section */}
        <section className="mt-14 sm:mt-16 border-t border-white/[0.08] pt-10 sm:pt-12">
          <div className="mb-7 sm:mb-8 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-[#F9FAFB]">
              Original Programming Study Guides
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Read structured lessons with annotated code snippets, common mistakes, and practical
              use cases directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CURRICULUM_MODULES.map((mod) => (
              <article
                key={mod.slug}
                className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6"
              >
                <div>
                  <p className="text-xs font-medium text-[#06B6D4]">{mod.category}</p>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#F9FAFB]">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">{mod.shortSummary}</p>
                </div>
                <Link
                  to={`/learn/${mod.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white"
                >
                  <span>Open Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
