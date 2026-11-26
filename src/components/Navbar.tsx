import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_LOGO_URL, resolvePublicAssetUrl } from '../types';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/coding-notes', label: 'Coding Notes' },
  { to: '/affiliate-products', label: 'Affiliate Products' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' }
];

export function Navbar() {
  const { settings } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoSrc = resolvePublicAssetUrl(settings.logoUrl || DEFAULT_LOGO_URL);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.08] bg-[#030712]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 sm:gap-8 px-5 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-[#F9FAFB] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6366F1] rounded"
        >
          <img
            src={logoSrc}
            alt={settings.siteName}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/15"
          />
          <span className="font-display">{settings.logoText || settings.siteName}</span>
        </Link>

        {/* Zone 2: 5 concise single-line text links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-7">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#F9FAFB] border-[#6366F1]'
                    : 'text-[#9CA3AF] border-transparent hover:text-[#F9FAFB] hover:border-white/20'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/coding-notes"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
          >
            Browse Notes
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#090F1C] text-[#F9FAFB] hover:bg-[#111827] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-b border-white/[0.08] bg-[#090F1C]/98 backdrop-blur-md px-5 py-5 space-y-1.5 shadow-2xl"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#111827] text-white border border-white/10'
                    : 'text-[#D1D5DB] hover:bg-[#111827]/60 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-3 mt-2 border-t border-white/[0.08]">
            <Link
              to="/coding-notes"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-[#6366F1] px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Browse Coding Notes
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
