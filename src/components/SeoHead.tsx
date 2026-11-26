import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_LOGO_URL, resolvePublicAssetUrl } from '../types';

interface SeoHeadProps {
  title: string;
  description: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, type?: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  if (type) {
    el.setAttribute('type', type);
  }
  el.setAttribute('href', href);
}

export function SeoHead({ title, description, noIndex = false, structuredData }: SeoHeadProps) {
  const location = useLocation();
  const { settings } = useAppContext();
  const logoHref = resolvePublicAssetUrl(settings.logoUrl || DEFAULT_LOGO_URL);

  useEffect(() => {
    document.title = title;
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const absoluteLogoUrl = logoHref.startsWith('http')
      ? logoHref
      : `${window.location.origin}${logoHref.startsWith('/') ? '' : '/'}${logoHref}`;

    upsertLink('icon', logoHref, 'image/png');
    upsertLink('shortcut icon', logoHref, 'image/png');
    upsertLink('apple-touch-icon', logoHref);

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', absoluteLogoUrl);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', absoluteLogoUrl);

    let robotsEl = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robotsEl) {
        robotsEl = document.createElement('meta');
        robotsEl.setAttribute('name', 'robots');
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute('content', 'noindex, nofollow');
    } else if (robotsEl) {
      robotsEl.remove();
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const existingLd = document.getElementById('shortstudy-jsonld');
    if (existingLd) existingLd.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.id = 'shortstudy-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, noIndex, location.pathname, structuredData, logoHref]);

  return null;
}
