import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { useAppContext } from '../context/AppContext';

function PolicyShell({
  title,
  seoTitle,
  description,
  breadcrumbLabel,
  children
}: {
  title: string;
  seoTitle: string;
  description: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SeoHead title={seoTitle} description={description} />
      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: breadcrumbLabel }]} />
        <header className="border-b border-white/[0.08] pb-6 mb-7 sm:mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-xs text-[#9CA3AF]">Effective Date: November 23, 2026</p>
        </header>
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[#D1D5DB] break-words">
          {children}
        </div>
      </article>
    </>
  );
}

export function PrivacyPolicyPage() {
  const { settings } = useAppContext();

  return (
    <PolicyShell
      title="Privacy Policy"
      seoTitle={`Privacy Policy – ${settings.siteName}`}
      description="Privacy Policy explaining how Short Study handles visitor information, cookies, third-party services, Google advertising disclosures, and user privacy rights."
      breadcrumbLabel="Privacy Policy"
    >
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">1. Overview</h2>
        <p>
          Short Study (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your
          privacy and is committed to explaining clearly what information may be processed when you
          visit our educational platform, download programming notes, or contact us.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          2. Information Collected
        </h2>
        <p>Depending on how you interact with Short Study, we may process:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#9CA3AF]">
          <li>
            <strong className="text-[#F9FAFB]">Contact Form Submissions:</strong> When you submit an
            inquiry via our Contact Us form, we collect your name, email address, subject, and
            message solely to respond to your request.
          </li>
          <li>
            <strong className="text-[#F9FAFB]">Technical &amp; Server Logs:</strong> Our hosting and
            server infrastructure automatically receives standard request metadata such as your IP
            address, browser user agent, referring URL, and timestamps for security, rate limiting,
            and reliability.
          </li>
          <li>
            <strong className="text-[#F9FAFB]">Consent &amp; Preference Storage:</strong> Your
            cookie preference selections are stored locally in your browser so we remember your
            privacy choices across visits.
          </li>
          <li>
            <strong className="text-[#F9FAFB]">Administrator Authentication:</strong> Authorized
            administrators signing into the private management dashboard authenticate via Google
            Firebase Authentication. Ordinary public visitors do not need an account to browse or
            download study notes.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          3. Cookies, Analytics &amp; Third-Party Advertising (Google AdSense)
        </h2>
        <p>
          Short Study uses essential local storage and cookies to operate securely and remember your
          consent settings. Non-essential analytics or advertising technologies are not activated
          unless you provide consent through our cookie preferences interface.
        </p>
        <p>
          When advertising services such as Google AdSense are enabled on this site, third-party
          vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to
          this website or other websites. Google&apos;s use of advertising cookies enables it and
          its partners to serve ads to users based on their visit to Short Study and/or other sites
          on the Internet.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#9CA3AF]">
          <li>
            Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings:{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline hover:text-white"
            >
              https://adssettings.google.com/
            </a>
            .
          </li>
          <li>
            Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
            personalized advertising by visiting:{' '}
            <a
              href="https://www.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline hover:text-white"
            >
              https://www.aboutads.info/
            </a>
            .
          </li>
          <li>
            To learn more about how Google uses data when you use partner sites or apps, please
            review:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline hover:text-white"
            >
              https://policies.google.com/technologies/partner-sites
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          4. Third-Party Services &amp; Affiliate Links
        </h2>
        <p>
          Short Study uses Google Firebase (Cloud Firestore and Firebase Authentication) to store and
          serve educational catalog records securely. Additionally, our Affiliate Products page
          contains outbound links to third-party merchants. Once you leave Short Study via an
          outbound link, the destination merchant&apos;s own privacy policy and cookie practices
          govern your browsing session.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          5. Data Retention &amp; Your Rights
        </h2>
        <p>
          We retain contact form inquiries only as long as reasonably needed to address your
          question or maintain administrative records. Depending on your jurisdiction (including
          India, the EEA, the UK, and other regions), you may request access to, correction of, or
          deletion of personal information you submitted to us, or withdraw optional cookie consent
          at any time using the &ldquo;Manage Cookie Preferences&rdquo; link in our footer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          6. Policy Updates &amp; Contact Information
        </h2>
        <p>
          We may update this Privacy Policy from time to time to reflect technical or regulatory
          changes. Updates take effect when published on this page with a revised effective date.
        </p>
        <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 text-sm text-[#D1D5DB] space-y-1">
          <p className="font-semibold text-[#F9FAFB]">{settings.siteName}</p>
          <p>Address: Bajwalpur Rampur Road, Haldwani, Uttarakhand, India</p>
          <p>
            Email:{' '}
            <a
              href={`mailto:${settings.contactEmail}`}
              className="text-[#06B6D4] underline hover:text-cyan-300"
            >
              {settings.contactEmail}
            </a>
          </p>
        </div>
      </section>
    </PolicyShell>
  );
}

export function TermsPage() {
  const { settings } = useAppContext();

  return (
    <PolicyShell
      title="Terms and Conditions"
      seoTitle={`Terms and Conditions – ${settings.siteName}`}
      description="Terms and Conditions governing educational use of Short Study programming notes, PDFs, and outbound product links."
      breadcrumbLabel="Terms and Conditions"
    >
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">1. Acceptance of Terms</h2>
        <p>
          By accessing or using {settings.siteName}, you agree to comply with these Terms and
          Conditions and all applicable laws. If you do not agree with any part of these terms,
          please discontinue use of the website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          2. Educational Use &amp; Intellectual Property
        </h2>
        <p>
          All original articles, code explanations, layout assets, and downloadable PDF study guides
          published on Short Study are provided for personal, non-commercial educational study
          unless explicitly stated otherwise. You may download and print PDFs for personal learning
          and classroom revision, but you may not republish, resell, or redistribute Short Study
          materials as your own work without prior written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          3. Acceptable Use &amp; Security
        </h2>
        <p>
          Visitors agree not to attempt unauthorized access to administrative endpoints, disrupt
          server availability, submit automated spam through the contact form, or scrape bulk
          resources in ways that degrade service for other learners.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          4. Third-Party Links &amp; External Products
        </h2>
        <p>
          Short Study links to external technology retailers and documentation resources for
          convenience. We do not control external sites and are not responsible for pricing,
          shipping, warranties, or availability on third-party merchant websites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">5. Limitation of Liability</h2>
        <p>
          Educational notes and code examples are provided &ldquo;as is&rdquo; without warranties of
          any kind. Always test code carefully before deploying it into production environments.
        </p>
      </section>
    </PolicyShell>
  );
}

export function DisclaimerPage() {
  const { settings } = useAppContext();

  return (
    <PolicyShell
      title="Disclaimer"
      seoTitle={`Disclaimer – ${settings.siteName}`}
      description="Educational and technical disclaimer for Short Study coding notes, syntax examples, and product information."
      breadcrumbLabel="Disclaimer"
    >
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          Educational Purpose Only
        </h2>
        <p>
          All coding notes, computer science tutorials, PDF downloads, and code snippets provided on{' '}
          {settings.siteName} are intended solely for general educational reference. While we review
          examples for technical accuracy, software languages, compilers, frameworks, and libraries
          evolve over time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          No Professional or Guarantee Claims
        </h2>
        <p>
          Short Study does not guarantee specific exam grades, job placements, or software system
          outcomes. Learners should consult official language documentation and perform independent
          verification before using code in commercial or safety-critical systems.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          External Content &amp; Product Information
        </h2>
        <p>
          Product specifications and descriptions listed in our Affiliate Products section reflect
          publicly available technical details at the time of publication and may change on vendor
          websites. Always verify exact specifications on the merchant&apos;s page prior to purchase.
        </p>
      </section>
    </PolicyShell>
  );
}

export function AffiliateDisclosurePage() {
  const { settings } = useAppContext();

  return (
    <PolicyShell
      title="Affiliate Disclosure"
      seoTitle={`Affiliate Disclosure – ${settings.siteName}`}
      description="Transparent disclosure of affiliate relationships and product recommendation standards on Short Study."
      breadcrumbLabel="Affiliate Disclosure"
    >
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          Transparency Statement
        </h2>
        <p>
          {settings.siteName} may earn a commission when you purchase products through certain
          outbound links featured on this website, including on the{' '}
          <Link to="/affiliate-products" className="text-indigo-300 underline hover:text-white">
            Affiliate Products
          </Link>{' '}
          page. This comes at no additional cost to you.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          Editorial Independence
        </h2>
        <p>
          Affiliate commissions help support the ongoing hosting and maintenance of free educational
          coding notes. However, our inclusion of any keyboard, laptop, audio accessory, storage
          device, or developer tool is intended to help readers discover practical gear for study
          and coding—never as a paid endorsement or fabricated review. Where relevant, we explicitly
          note limitations alongside advantages.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">Link Attributes</h2>
        <p>
          Outbound affiliate links are marked with standard <code>rel=&quot;sponsored nofollow
          noopener noreferrer&quot;</code> attributes in accordance with search engine and publisher
          transparency standards.
        </p>
      </section>
    </PolicyShell>
  );
}

export function CookiePolicyPage() {
  const { settings, setCookieModalOpen } = useAppContext();

  return (
    <PolicyShell
      title="Cookie Policy"
      seoTitle={`Cookie Policy – ${settings.siteName}`}
      description="Details on how Short Study uses essential storage, optional analytics, and advertising cookies."
      breadcrumbLabel="Cookie Policy"
    >
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">1. What Cookies Are</h2>
        <p>
          Cookies and browser storage keys are small data files stored on your device when you visit
          a website. They help websites remember user preferences, secure login sessions, and
          measure aggregate site performance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          2. Categories Used on Short Study
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-[#9CA3AF]">
          <li>
            <strong className="text-[#F9FAFB]">Essential Storage:</strong> Required to store your
            consent preferences and maintain security for authenticated administrative sessions.
          </li>
          <li>
            <strong className="text-[#F9FAFB]">Analytics &amp; Performance (Optional):</strong> Only
            activated if you consent, helping us understand which programming guides are most helpful.
          </li>
          <li>
            <strong className="text-[#F9FAFB]">Advertising Cookies (Optional):</strong> When ad
            services such as Google AdSense are active and consented to, third-party ad cookies may
            deliver relevant ads and measure ad effectiveness.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-[#F9FAFB]">
          3. Managing Your Preferences
        </h2>
        <p>
          You can update or withdraw your consent preferences at any time using the button below, or
          by clearing cookies directly in your browser settings.
        </p>
        <button
          type="button"
          onClick={() => setCookieModalOpen(true)}
          className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Open Cookie Preferences
        </button>
      </section>
    </PolicyShell>
  );
}
