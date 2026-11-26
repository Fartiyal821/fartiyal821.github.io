import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore';
import { AUTHORIZED_ADMIN_EMAIL, auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { normalizeImageInputUrl, parseGoogleDriveInput } from '../lib/googleDrive';
import {
  CODING_CATEGORIES,
  DEFAULT_WEBSITE_SETTINGS,
  PRODUCT_CATEGORIES,
  type AffiliateProduct,
  type CodingCategory,
  type CodingNote,
  type ContactMessage,
  type MediaFile,
  type ProductCategory,
  type WebsiteSettings
} from '../types';

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
  return base || 'resource';
}

export function sanitizeSlug(val: string): string {
  return slugify(val).slice(0, 160);
}

export function validateSafeExternalUrl(url: string): string {
  const trimmed = url.trim().slice(0, 1000);
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error('URL must begin with https:// or http://');
  }
  return trimmed;
}

export function validateSafeFileUrl(url: string): string {
  const drive = parseGoogleDriveInput(url);
  if (drive) {
    return drive.previewUrl;
  }
  const trimmed = url.trim().slice(0, 500);
  const isLocalAsset =
    /^\/assets\/[a-zA-Z0-9_.\-/]+$/.test(trimmed) && !trimmed.includes('..');
  const isLocalPdf =
    /^\/pdfs\/[a-zA-Z0-9_.\-]+\.pdf$/.test(trimmed) && !trimmed.includes('..');
  if (!isLocalAsset && !isLocalPdf && !/^https?:\/\//i.test(trimmed)) {
    throw new Error('File URL must be a Google Drive link, static PDF/asset path, or https:// URL.');
  }
  return trimmed;
}

export function validateSafeImageUrl(url: string): string {
  const normalized = normalizeImageInputUrl(url);
  if (!normalized) return '';
  return validateSafeFileUrl(normalized);
}

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  return Boolean(email && email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase());
}

export async function checkIsAdminUser(uid: string, email?: string | null): Promise<boolean> {
  if (isAuthorizedAdminEmail(email)) return true;
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch {
    return false;
  }
}

// ---------- CODING NOTES ----------

function mapNote(id: string, data: Record<string, unknown>): CodingNote {
  const lang = CODING_CATEGORIES.includes(data.language as CodingCategory)
    ? (data.language as CodingCategory)
    : 'Other Programming Resources';
  return {
    id,
    title: String(data.title || ''),
    slug: String(data.slug || ''),
    description: String(data.description || ''),
    language: lang,
    fileUrl: String(data.fileUrl || ''),
    fileSize: typeof data.fileSize === 'number' ? data.fileSize : 0,
    filename: String(data.filename || 'note.pdf'),
    isPublished: Boolean(data.isPublished),
    authorUid: String(data.authorUid || ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt)
  };
}

export function isLegacyStarterNote(note: Pick<CodingNote, 'id' | 'fileUrl'>): boolean {
  return note.fileUrl.startsWith('/pdfs/') || note.id.startsWith('starter-');
}

export function subscribePublishedNotes(
  onData: (notes: CodingNote[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'coding_notes';
  const q = query(collection(db, path), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapNote(d.id, d.data() as Record<string, unknown>))
        .filter((item) => !isLegacyStarterNote(item))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeAllNotesAdmin(
  onData: (notes: CodingNote[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'coding_notes';
  const q = query(collection(db, path));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapNote(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export interface NoteInput {
  title: string;
  slug?: string;
  description: string;
  language: CodingCategory;
  fileUrl: string;
  fileSize: number;
  filename: string;
  isPublished: boolean;
}

export async function createCodingNote(input: NoteInput, customId?: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required.');
  const id = customId || `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const docRef = doc(db, 'coding_notes', id);
  const payload = {
    title: input.title.trim().slice(0, 160),
    slug: sanitizeSlug(input.slug || input.title),
    description: input.description.trim().slice(0, 1200),
    language: input.language,
    fileUrl: validateSafeFileUrl(input.fileUrl),
    fileSize: Math.max(0, Math.min(52428800, Number(input.fileSize) || 0)),
    filename: input.filename.trim().slice(0, 255),
    isPublished: Boolean(input.isPublished),
    authorUid: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(docRef, payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `coding_notes/${id}`);
  }
}

export async function updateCodingNote(id: string, input: Partial<NoteInput>): Promise<void> {
  const docRef = doc(db, 'coding_notes', id);
  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp()
  };
  if (input.title !== undefined) updates.title = input.title.trim().slice(0, 160);
  if (input.slug !== undefined) updates.slug = sanitizeSlug(input.slug);
  if (input.description !== undefined) updates.description = input.description.trim().slice(0, 1200);
  if (input.language !== undefined) updates.language = input.language;
  if (input.fileUrl !== undefined) updates.fileUrl = validateSafeFileUrl(input.fileUrl);
  if (input.fileSize !== undefined) {
    updates.fileSize = Math.max(0, Math.min(52428800, Number(input.fileSize) || 0));
  }
  if (input.filename !== undefined) updates.filename = input.filename.trim().slice(0, 255);
  if (input.isPublished !== undefined) updates.isPublished = Boolean(input.isPublished);

  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `coding_notes/${id}`);
  }
}

export async function deleteCodingNote(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'coding_notes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `coding_notes/${id}`);
  }
}

// ---------- AFFILIATE PRODUCTS ----------

function mapProduct(id: string, data: Record<string, unknown>): AffiliateProduct {
  const cat = PRODUCT_CATEGORIES.includes(data.category as ProductCategory)
    ? (data.category as ProductCategory)
    : 'Other Technology Products';
  const rawFeatures = Array.isArray(data.features) ? data.features : [];
  return {
    id,
    name: String(data.name || ''),
    description: String(data.description || ''),
    imageUrl: String(data.imageUrl || ''),
    category: cat,
    features: rawFeatures.map((f) => String(f)).slice(0, 12),
    specifications: String(data.specifications || ''),
    suitableAudience: String(data.suitableAudience || ''),
    advantages: String(data.advantages || ''),
    limitations: String(data.limitations || ''),
    affiliateUrl: String(data.affiliateUrl || ''),
    disclosureStatus: data.disclosureStatus !== false,
    isPublished: Boolean(data.isPublished),
    authorUid: String(data.authorUid || ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt)
  };
}

export function subscribePublishedProducts(
  onData: (products: AffiliateProduct[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'affiliate_products';
  const q = query(collection(db, path), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeAllProductsAdmin(
  onData: (products: AffiliateProduct[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'affiliate_products';
  const q = query(collection(db, path));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export interface ProductInput {
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
}

export async function createAffiliateProduct(input: ProductInput): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required.');
  const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const docRef = doc(db, 'affiliate_products', id);
  const features = input.features
    .map((f) => f.trim().slice(0, 200))
    .filter(Boolean)
    .slice(0, 12);

  const payload = {
    name: input.name.trim().slice(0, 160),
    description: input.description.trim().slice(0, 2000),
    imageUrl: input.imageUrl.trim() ? validateSafeImageUrl(input.imageUrl) : '',
    category: input.category,
    features,
    specifications: input.specifications.trim().slice(0, 1000),
    suitableAudience: input.suitableAudience.trim().slice(0, 300),
    advantages: input.advantages.trim().slice(0, 600),
    limitations: input.limitations.trim().slice(0, 600),
    affiliateUrl: validateSafeExternalUrl(input.affiliateUrl),
    disclosureStatus: Boolean(input.disclosureStatus),
    isPublished: Boolean(input.isPublished),
    authorUid: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(docRef, payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `affiliate_products/${id}`);
  }
}

export async function updateAffiliateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<void> {
  const docRef = doc(db, 'affiliate_products', id);
  const updates: Record<string, unknown> = {
    updatedAt: serverTimestamp()
  };
  if (input.name !== undefined) updates.name = input.name.trim().slice(0, 160);
  if (input.description !== undefined) updates.description = input.description.trim().slice(0, 2000);
  if (input.imageUrl !== undefined) {
    updates.imageUrl = input.imageUrl.trim() ? validateSafeImageUrl(input.imageUrl) : '';
  }
  if (input.category !== undefined) updates.category = input.category;
  if (input.features !== undefined) {
    updates.features = input.features
      .map((f) => f.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 12);
  }
  if (input.specifications !== undefined) {
    updates.specifications = input.specifications.trim().slice(0, 1000);
  }
  if (input.suitableAudience !== undefined) {
    updates.suitableAudience = input.suitableAudience.trim().slice(0, 300);
  }
  if (input.advantages !== undefined) updates.advantages = input.advantages.trim().slice(0, 600);
  if (input.limitations !== undefined) updates.limitations = input.limitations.trim().slice(0, 600);
  if (input.affiliateUrl !== undefined) {
    updates.affiliateUrl = validateSafeExternalUrl(input.affiliateUrl);
  }
  if (input.disclosureStatus !== undefined) {
    updates.disclosureStatus = Boolean(input.disclosureStatus);
  }
  if (input.isPublished !== undefined) updates.isPublished = Boolean(input.isPublished);

  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `affiliate_products/${id}`);
  }
}

export async function deleteAffiliateProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'affiliate_products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `affiliate_products/${id}`);
  }
}

// ---------- MEDIA FILES ----------

export function subscribeMediaFilesAdmin(
  onData: (files: MediaFile[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'media_files';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            filename: String(data.filename || ''),
            originalName: String(data.originalName || ''),
            storageUrl: String(data.storageUrl || ''),
            fileType: data.fileType === 'image' ? 'image' : 'pdf',
            mimeType: String(data.mimeType || 'application/octet-stream'),
            fileSize: typeof data.fileSize === 'number' ? data.fileSize : 0,
            uploadedByUid: String(data.uploadedByUid || ''),
            createdAt: toDate(data.createdAt)
          };
        })
      );
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function recordMediaFile(input: {
  filename: string;
  originalName: string;
  storageUrl: string;
  fileType: 'pdf' | 'image';
  mimeType: string;
  fileSize: number;
}): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required.');
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    await setDoc(doc(db, 'media_files', id), {
      filename: input.filename.slice(0, 255),
      originalName: input.originalName.slice(0, 255),
      storageUrl: validateSafeFileUrl(input.storageUrl),
      fileType: input.fileType,
      mimeType: input.mimeType.slice(0, 100),
      fileSize: Math.max(0, Number(input.fileSize) || 0),
      uploadedByUid: uid,
      createdAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `media_files/${id}`);
  }
}

export async function deleteMediaFileRecord(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'media_files', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `media_files/${id}`);
  }
}

// ---------- WEBSITE SETTINGS ----------

export function subscribeWebsiteSettings(onData: (settings: WebsiteSettings) => void): Unsubscribe {
  const docRef = doc(db, 'website_settings', 'global');
  return onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) {
        onData(DEFAULT_WEBSITE_SETTINGS);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onData({
        siteName: String(data.siteName || DEFAULT_WEBSITE_SETTINGS.siteName),
        siteDescription: String(data.siteDescription || DEFAULT_WEBSITE_SETTINGS.siteDescription),
        logoText: String(data.logoText || DEFAULT_WEBSITE_SETTINGS.logoText),
        logoUrl: String(data.logoUrl || DEFAULT_WEBSITE_SETTINGS.logoUrl),
        contactEmail: String(data.contactEmail || DEFAULT_WEBSITE_SETTINGS.contactEmail),
        instagramHandle: String(data.instagramHandle || DEFAULT_WEBSITE_SETTINGS.instagramHandle),
        instagramUrl: String(data.instagramUrl || DEFAULT_WEBSITE_SETTINGS.instagramUrl),
        footerDescription: String(
          data.footerDescription || DEFAULT_WEBSITE_SETTINGS.footerDescription
        ),
        seoTitle: String(data.seoTitle || DEFAULT_WEBSITE_SETTINGS.seoTitle),
        seoDescription: String(data.seoDescription || DEFAULT_WEBSITE_SETTINGS.seoDescription),
        updatedByUid: String(data.updatedByUid || ''),
        updatedAt: toDate(data.updatedAt)
      });
    },
    () => {
      onData(DEFAULT_WEBSITE_SETTINGS);
    }
  );
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required.');
  const docRef = doc(db, 'website_settings', 'global');
  const payload = {
    siteName: settings.siteName.trim().slice(0, 100),
    siteDescription: settings.siteDescription.trim().slice(0, 500),
    logoText: settings.logoText.trim().slice(0, 60),
    logoUrl: settings.logoUrl.trim() ? validateSafeImageUrl(settings.logoUrl) : '',
    contactEmail: settings.contactEmail.trim().slice(0, 160),
    instagramHandle: settings.instagramHandle.trim().slice(0, 80),
    instagramUrl: validateSafeExternalUrl(settings.instagramUrl),
    footerDescription: settings.footerDescription.trim().slice(0, 400),
    seoTitle: settings.seoTitle.trim().slice(0, 120),
    seoDescription: settings.seoDescription.trim().slice(0, 300),
    updatedByUid: uid,
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'website_settings/global');
  }
}

// ---------- CONTACT MESSAGES (FIRESTORE) ----------

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const docRef = doc(db, 'contact_messages', id);
  try {
    await setDoc(docRef, {
      name: input.name.trim().slice(0, 100),
      email: input.email.trim().slice(0, 160),
      subject: input.subject.trim().slice(0, 160),
      message: input.message.trim().slice(0, 3000),
      status: 'new',
      createdAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `contact_messages/${id}`);
  }
}

export function subscribeContactMessagesAdmin(
  onData: (messages: ContactMessage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'contact_messages';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: String(data.name || ''),
            email: String(data.email || ''),
            subject: String(data.subject || ''),
            message: String(data.message || ''),
            status: data.status === 'reviewed' ? 'reviewed' : 'new',
            createdAt: toDate(data.createdAt)
          };
        })
      );
    },
    (error) => {
      if (onError) onError(error);
      else handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateContactMessageStatus(
  id: string,
  status: 'new' | 'reviewed'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'contact_messages', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contact_messages/${id}`);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'contact_messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `contact_messages/${id}`);
  }
}
