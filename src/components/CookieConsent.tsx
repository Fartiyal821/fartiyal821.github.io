import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function CookieConsent() {
  const { cookieConsent, cookieModalOpen, setCookieModalOpen, saveCookieConsent } = useAppContext();
  const [analytics, setAnalytics] = useState(cookieConsent.analytics);
  const [advertising, setAdvertising] = useState(cookieConsent.advertising);

  const showBanner = !cookieConsent.decided && !cookieModalOpen;

  return (
    <>
      {showBanner && (
        <aside
          aria-label="Cookie consent notice"
          className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-50 mx-auto max-w-4xl rounded-xl border border-white/15 bg-[#111827]/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F9FAFB]">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                <span>Your Privacy &amp; Cookie Choices</span>
              </div>
              <p className="text-xs leading-relaxed text-[#9CA3AF] max-w-2xl">
                Short Study uses essential cookies for site security and preferences. Optional analytics
                and advertising cookies are only enabled with your consent. Review our{' '}
                <Link to="/cookie-policy" className="text-indigo-300 underline hover:text-white">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-indigo-300 underline hover:text-white">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAnalytics(cookieConsent.analytics);
                  setAdvertising(cookieConsent.advertising);
                  setCookieModalOpen(true);
                }}
                className="rounded-lg border border-white/15 bg-transparent px-3.5 py-2.5 sm:py-2 text-xs font-medium text-[#F9FAFB] hover:bg-white/5 transition-colors whitespace-nowrap text-center"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent(false, false)}
                className="rounded-lg border border-white/15 bg-[#090F1C] px-3.5 py-2.5 sm:py-2 text-xs font-medium text-[#F9FAFB] hover:bg-white/10 transition-colors whitespace-nowrap text-center"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent(true, true)}
                className="col-span-2 sm:col-span-1 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors whitespace-nowrap text-center"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {cookieModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-xl border border-white/15 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 id="cookie-modal-title" className="font-display text-lg font-semibold text-[#F9FAFB]">
                  Manage Cookie Preferences
                </h2>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  Choose which optional technologies Short Study may activate on this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCookieModalOpen(false)}
                aria-label="Close preferences"
                className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-[#090F1C] p-3.5">
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB]">Essential Storage</p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">
                    Required for consent state, session security, and core navigation. Always active.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#10B981] whitespace-nowrap">Always On</span>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-white/10 bg-[#090F1C] p-3.5">
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB]">Analytics &amp; Measurement</p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">
                    Helps measure aggregate page performance and educational topic demand.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#6366F1]"
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-white/10 bg-[#090F1C] p-3.5">
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB]">Advertising &amp; Personalization</p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">
                    Enables third-party ad cookies (such as Google AdSense when configured) to serve relevant ads.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={advertising}
                  onChange={(e) => setAdvertising(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#6366F1]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => saveCookieConsent(false, false)}
                className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-[#F9FAFB] hover:bg-white/5"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent(analytics, advertising)}
                className="rounded-lg bg-[#6366F1] px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
