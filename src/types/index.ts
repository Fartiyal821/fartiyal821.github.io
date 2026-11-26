export const CODING_CATEGORIES = [
  'Python',
  'C Programming',
  'C++',
  'Java',
  'JavaScript',
  'HTML',
  'CSS',
  'SQL',
  'Data Structures and Algorithms',
  'Computer Science Fundamentals',
  'Web Development',
  'Other Programming Resources'
] as const;

export type CodingCategory = (typeof CODING_CATEGORIES)[number];

export const PRODUCT_CATEGORIES = [
  'Programming Accessories',
  'Keyboards and Mice',
  'Laptops and Computers',
  'Developer Tools',
  'Audio Equipment',
  'Study Accessories',
  'Storage Devices',
  'Other Technology Products'
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface CodingNote {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: CodingCategory;
  fileUrl: string;
  fileSize: number;
  filename: string;
  isPublished: boolean;
  authorUid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  features: string[];
  specifications: string;
  suitableAudience: string;
  advantages: string;
  limitations: string;
  affiliateUrl: string;
  disclosureStatus: boolean;
  isPublished: boolean;
  authorUid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  storageUrl: string;
  fileType: 'pdf' | 'image';
  mimeType: string;
  fileSize: number;
  uploadedByUid: string;
  createdAt: Date;
}

export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  logoText: string;
  logoUrl: string;
  contactEmail: string;
  instagramHandle: string;
  instagramUrl: string;
  footerDescription: string;
  seoTitle: string;
  seoDescription: string;
  updatedByUid?: string;
  updatedAt?: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'reviewed';
}

export const DEFAULT_LOGO_URL = '/assets/aistudio/Minimal_Blue_Coding_Symbol_97742d69.png';

export function resolvePublicAssetUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (url.startsWith('/assets/') || url.startsWith('/pdfs/')) {
    return `${base}${url}`;
  }
  return url;
}

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'Short Study',
  siteDescription:
    'Explore programming notes, computer science concepts, practical learning resources, and carefully selected technology products — all in one place.',
  logoText: 'Short Study',
  logoUrl: DEFAULT_LOGO_URL,
  contactEmail: 'gauravfartiyal751@gmail.com',
  instagramHandle: '@shortstudy999',
  instagramUrl: 'https://www.instagram.com/shortstudy999/',
  footerDescription:
    'An educational platform dedicated to clear programming notes, computer science fundamentals, and practical developer resources.',
  seoTitle: 'Short Study – Coding Notes, CS Fundamentals & Developer Resources',
  seoDescription:
    'Explore original programming notes in PDF format, computer science guides, practical code examples, and curated tech recommendations on Short Study.'
};
