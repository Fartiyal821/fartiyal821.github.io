/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AppProvider } from './context/AppContext';
import { AboutPage } from './pages/AboutPage';
import { AffiliateProductsPage } from './pages/AffiliateProductsPage';
import { CodingNotesPage } from './pages/CodingNotesPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LearnGuidePage } from './pages/LearnGuidePage';
import {
  AffiliateDisclosurePage,
  CookiePolicyPage,
  DisclaimerPage,
  PrivacyPolicyPage,
  TermsPage
} from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-[#F9FAFB] overflow-x-clip">
      <Navbar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter basename={routerBasename}>
          <ScrollToTop />
          <Routes>
            <Route path="/admin" element={<AdminDashboardPage />} />

            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/coding-notes" element={<CodingNotesPage />} />
              <Route path="/learn/:slug" element={<LearnGuidePage />} />
              <Route path="/affiliate-products" element={<AffiliateProductsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
