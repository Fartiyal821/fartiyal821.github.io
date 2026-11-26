import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_LOGO_URL, resolvePublicAssetUrl } from '../types';

export function Footer() {
  const { settings, setCookieModalOpen } = useAppContext();
  const currentYear = new Date().getFullYear();
  const logoSrc = resolvePublicAssetUrl(settings.logoUrl || DEFAULT_LOGO_URL);

  return (
    <footer className="border-t border-white/[0.08] bg-[#090F1C]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-base font-bold text-[#F9FAFB]">
              <img
                src={logoSrc}
                alt={settings.siteName}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/15"
              />
              <span className="font-display">{settings.siteName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#9CA3AF] max-w-sm">
              {settings.footerDescription}
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h2 className="font-display text-sm font-semibold text-[#F9FAFB] mb-3.5 sm:mb-4">Explore</h2>
            <ul className="space-y-3 sm:space-y-2.5 text-sm text-[#9CA3AF]">
              <li>
                <Link to="/coding-notes" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Coding Notes
                </Link>
              </li>
              <li>
                <Link to="/affiliate-products" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Affiliate Products
                </Link>
              </li>
              <li>
                <Link to="/learn/python-programming" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Python Study Guide
                </Link>
              </li>
              <li>
                <Link to="/learn/web-development" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/learn/computer-science-fundamentals"
                  className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5"
                >
                  CS Fundamentals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h2 className="font-display text-sm font-semibold text-[#F9FAFB] mb-3.5 sm:mb-4">Information</h2>
            <ul className="space-y-3 sm:space-y-2.5 text-sm text-[#9CA3AF]">
              <li>
                <Link to="/about" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#F9FAFB] transition-colors inline-block py-0.5">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h2 className="font-display text-sm font-semibold text-[#F9FAFB] mb-3.5 sm:mb-4">Connect</h2>
            <ul className="space-y-3 text-sm text-[#9CA3AF]">
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="inline-flex items-center gap-2 hover:text-[#F9FAFB] transition-colors break-all"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#06B6D4]" />
                  <span>{settings.contactEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#F9FAFB] transition-colors"
                >
                  <span>Instagram ({settings.instagramHandle})</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </a>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => setCookieModalOpen(true)}
                  className="text-xs font-medium text-[#9CA3AF] underline underline-offset-4 hover:text-[#F9FAFB] transition-colors py-1"
                >
                  Manage Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-start justify-between gap-3 sm:gap-4 border-t border-white/[0.08] pt-8 text-xs text-[#9CA3AF] sm:flex-row sm:items-center">
          <p className="tabular-nums">
            Copyright &copy; {currentYear} {settings.siteName}. All rights reserved.
          </p>
          <p>Original programming education &amp; curated developer resources.</p>
        </div>
      </div>
    </footer>
  );
}
