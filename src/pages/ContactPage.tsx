import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SeoHead } from '../components/SeoHead';
import { useAppContext } from '../context/AppContext';
import { submitContactMessage } from '../services/repository';

export function ContactPage() {
  const { settings } = useAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (website.trim().length > 0) {
      setErrorMsg('Spam check failed.');
      return;
    }
    if (name.trim().length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (subject.trim().length < 3) {
      setErrorMsg('Please enter a subject (at least 3 characters).');
      return;
    }
    if (message.trim().length < 15) {
      setErrorMsg('Please provide a message of at least 15 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSuccessMsg('Thank you. Your message has been received and saved for review.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMsg('Unable to send your message right now. Please try emailing directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SeoHead
        title={`Contact Us – ${settings.siteName}`}
        description="Contact Short Study to request coding notes, report technical corrections, or ask questions about educational resources."
      />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />

        <header className="border-b border-white/[0.08] pb-6 sm:pb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
            Contact {settings.siteName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#9CA3AF] max-w-2xl leading-relaxed">
            Have a question about a coding guide, a suggestion for a new PDF topic, or a technical
            correction to share? Send a message below or reach us directly via email or Instagram.
          </p>
        </header>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-8 lg:gap-10 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">
                Direct Channels
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] mb-1">Official Email</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="inline-flex items-center gap-2 font-medium text-[#06B6D4] hover:text-cyan-300 break-all"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{settings.contactEmail}</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] mb-1">Instagram</p>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-indigo-300 hover:text-white"
                  >
                    <span>{settings.instagramHandle}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#090F1C] p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F9FAFB]">
                <MessageSquare className="h-4 w-4 text-[#6366F1]" />
                <span>Helpful Reasons to Reach Out</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-[#9CA3AF]">
                <li>&middot; Requesting new programming PDF study sheets or topic coverage.</li>
                <li>&middot; Reporting a typo, broken link, or technical inaccuracy in a guide.</li>
                <li>&middot; Questions regarding privacy, copyright, or affiliate disclosures.</li>
                <li>&middot; General educational feedback from students or educators.</li>
              </ul>
            </div>
          </div>

          {/* Real Backend Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-8 space-y-5"
            >
              <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">
                Send a Message
              </h2>

              {/* Honeypot field hidden from human users */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-[#D1D5DB] mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-[#D1D5DB] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-medium text-[#D1D5DB] mb-1.5">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  maxLength={160}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Topic request, technical correction, or inquiry"
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-[#D1D5DB] mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  maxLength={3000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here (minimum 15 characters)..."
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-xs text-rose-200"
                >
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981] mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Sending...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
