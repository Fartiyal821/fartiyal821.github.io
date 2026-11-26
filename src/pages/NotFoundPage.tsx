import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';

export function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found (404) – Short Study"
        description="The requested page could not be found on Short Study."
        noIndex
      />
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24 text-center space-y-5">
        <p className="font-mono text-sm font-semibold text-[#06B6D4]">404</p>
        <h1 className="font-display text-3xl font-bold text-[#F9FAFB] sm:text-4xl">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF]">
          The page you requested does not exist or may have moved. Browse our Coding Notes library
          or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/coding-notes"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-white/15 bg-[#111827] px-4 py-2.5 sm:py-2 text-sm font-medium text-[#F9FAFB] hover:bg-white/5"
          >
            Explore Coding Notes
          </Link>
        </div>
      </div>
    </>
  );
}
