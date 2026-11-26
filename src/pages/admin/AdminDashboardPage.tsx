import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Link2,
  LogOut,
  Package,
  Plus,
  Settings,
  Trash2,
  X
} from 'lucide-react';
import { formatBytes, formatShortDate } from '../../components/PdfNoteCard';
import { ProductCard } from '../../components/ProductCard';
import { SeoHead } from '../../components/SeoHead';
import { useAppContext } from '../../context/AppContext';
import {
  getPdfDisplayUrls,
  normalizeImageInputUrl,
  parseGoogleDriveInput
} from '../../lib/googleDrive';
import {
  createAffiliateProduct,
  createCodingNote,
  deleteAffiliateProduct,
  deleteCodingNote,
  deleteContactMessage,
  deleteMediaFileRecord,
  isLegacyStarterNote,
  recordMediaFile,
  saveWebsiteSettings,
  slugify,
  subscribeAllNotesAdmin,
  subscribeAllProductsAdmin,
  subscribeContactMessagesAdmin,
  subscribeMediaFilesAdmin,
  updateAffiliateProduct,
  updateCodingNote,
  updateContactMessageStatus
} from '../../services/repository';
import {
  CODING_CATEGORIES,
  DEFAULT_LOGO_URL,
  PRODUCT_CATEGORIES,
  resolvePublicAssetUrl,
  type AffiliateProduct,
  type CodingCategory,
  type CodingNote,
  type ContactMessage,
  type MediaFile,
  type ProductCategory,
  type WebsiteSettings
} from '../../types';
import { AdminLogin } from './AdminLogin';

type AdminTab = 'overview' | 'notes' | 'products' | 'media' | 'inquiries' | 'settings';

export function AdminDashboardPage() {
  const { user, authReady, adminCheckReady, isAdmin, logout, settings } = useAppContext();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [notes, setNotes] = useState<CodingNote[]>([]);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  // Confirm Deletion Modal
  const [confirmDelete, setConfirmDelete] = useState<{
    label: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Coding Note Form Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CodingNote | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteLanguage, setNoteLanguage] = useState<CodingCategory>('Python');
  const [noteSourceMode, setNoteSourceMode] = useState<'drive' | 'url'>('drive');
  const [noteDriveInput, setNoteDriveInput] = useState('');
  const [showDrivePreview, setShowDrivePreview] = useState(false);
  const [noteFileUrl, setNoteFileUrl] = useState('');
  const [noteFilename, setNoteFilename] = useState('');
  const [noteFileSize, setNoteFileSize] = useState(0);
  const [notePublished, setNotePublished] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  // Media Library Add Form
  const [mediaName, setMediaName] = useState('');
  const [mediaType, setMediaType] = useState<'pdf' | 'image'>('pdf');
  const [mediaUrl, setMediaUrl] = useState('');
  const [savingMedia, setSavingMedia] = useState(false);

  // Affiliate Product Form Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<AffiliateProduct | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Keyboards and Mice');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodFeaturesText, setProdFeaturesText] = useState('');
  const [prodSpecs, setProdSpecs] = useState('');
  const [prodAudience, setProdAudience] = useState('');
  const [prodAdvantages, setProdAdvantages] = useState('');
  const [prodLimitations, setProdLimitations] = useState('');
  const [prodAffiliateUrl, setProdAffiliateUrl] = useState('');
  const [prodDisclosure, setProdDisclosure] = useState(true);
  const [prodPublished, setProdPublished] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Website Settings Form
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const showNotice = (kind: 'success' | 'error', text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    const unsubNotes = subscribeAllNotesAdmin(
      (items) => {
        const legacy = items.filter(isLegacyStarterNote);
        if (legacy.length > 0) {
          void Promise.all(legacy.map((n) => deleteCodingNote(n.id))).catch(() => {});
        }
        setNotes(items.filter((item) => !isLegacyStarterNote(item)));
      },
      (e) => showNotice('error', `Notes sync error: ${e.message}`)
    );
    const unsubProds = subscribeAllProductsAdmin(setProducts, (e) =>
      showNotice('error', `Products sync error: ${e.message}`)
    );
    const unsubMedia = subscribeMediaFilesAdmin(setMediaFiles, (e) =>
      showNotice('error', `Media sync error: ${e.message}`)
    );
    const unsubInquiries = subscribeContactMessagesAdmin(setInquiries, (e) =>
      showNotice('error', `Inquiries sync error: ${e.message}`)
    );
    return () => {
      unsubNotes();
      unsubProds();
      unsubMedia();
      unsubInquiries();
    };
  }, [isAdmin]);

  if (!authReady || !adminCheckReady) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-sm text-[#9CA3AF]">
        Verifying administrator session...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  // Stats
  const publishedNotesCount = notes.filter((n) => n.isPublished).length;
  const unpublishedNotesCount = notes.length - publishedNotesCount;
  const publishedProductsCount = products.filter((p) => p.isPublished).length;

  // Handlers: Coding Notes
  const openCreateNoteModal = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteDescription('');
    setNoteLanguage('Python');
    setNoteSourceMode('drive');
    setNoteDriveInput('');
    setShowDrivePreview(false);
    setNoteFileUrl('');
    setNoteFilename('');
    setNoteFileSize(0);
    setNotePublished(true);
    setNoteModalOpen(true);
  };

  const openEditNoteModal = (note: CodingNote) => {
    const drive = parseGoogleDriveInput(note.fileUrl);
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteDescription(note.description);
    setNoteLanguage(note.language);
    setNoteSourceMode(drive ? 'drive' : 'url');
    setNoteDriveInput(drive ? note.fileUrl : '');
    setShowDrivePreview(false);
    setNoteFileUrl(note.fileUrl);
    setNoteFilename(note.filename);
    setNoteFileSize(note.fileSize);
    setNotePublished(note.isPublished);
    setNoteModalOpen(true);
  };

  const handleDriveInputChange = (raw: string) => {
    setNoteDriveInput(raw);
    const parsed = parseGoogleDriveInput(raw);
    if (parsed) {
      setNoteFileUrl(parsed.previewUrl);
      setNoteFileSize(0);
      if (!noteFilename) {
        setNoteFilename(`${slugify(noteTitle || 'coding-note')}.pdf`);
      }
    } else {
      setNoteFileUrl('');
      setShowDrivePreview(false);
    }
  };

  const handleSaveMediaLink = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedUrl = mediaUrl.trim();
    if (!trimmedUrl) {
      showNotice('error', 'Please enter a valid PDF or image URL.');
      return;
    }

    setSavingMedia(true);
    try {
      const finalUrl =
        mediaType === 'image'
          ? normalizeImageInputUrl(trimmedUrl)
          : parseGoogleDriveInput(trimmedUrl)?.previewUrl || trimmedUrl;
      const cleanName = mediaName.trim() || 'Saved Resource';
      const safeFilename = `${slugify(cleanName)}${mediaType === 'pdf' ? '.pdf' : ''}`;

      await recordMediaFile({
        filename: safeFilename,
        originalName: cleanName,
        storageUrl: finalUrl,
        fileType: mediaType,
        mimeType: mediaType === 'pdf' ? 'application/pdf' : 'image/url',
        fileSize: 0
      });
      setMediaName('');
      setMediaUrl('');
      showNotice('success', 'Media link saved to Firestore.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Unable to save media link.');
    } finally {
      setSavingMedia(false);
    }
  };

  const handleSaveNote = async (e: FormEvent) => {
    e.preventDefault();
    let finalFileUrl = noteFileUrl.trim();
    let finalFilename = noteFilename.trim() || `${slugify(noteTitle || 'coding-note')}.pdf`;

    if (noteSourceMode === 'drive') {
      const parsed = parseGoogleDriveInput(noteDriveInput);
      if (!parsed) {
        showNotice(
          'error',
          'Please paste a valid Google Drive PDF link or <iframe> embed code.'
        );
        return;
      }
      finalFileUrl = parsed.previewUrl;
      finalFilename = `${slugify(noteTitle || 'coding-note')}.pdf`;
    } else if (!finalFileUrl) {
      showNotice('error', 'Please enter a valid PDF URL.');
      return;
    } else {
      const parsedDrive = parseGoogleDriveInput(finalFileUrl);
      if (parsedDrive) {
        finalFileUrl = parsedDrive.previewUrl;
      }
    }

    setSavingNote(true);
    try {
      if (editingNote) {
        await updateCodingNote(editingNote.id, {
          title: noteTitle,
          slug: slugify(noteTitle),
          description: noteDescription,
          language: noteLanguage,
          fileUrl: finalFileUrl,
          fileSize: noteSourceMode === 'drive' ? 0 : noteFileSize,
          filename: finalFilename,
          isPublished: notePublished
        });
        showNotice('success', 'Coding note updated.');
      } else {
        await createCodingNote({
          title: noteTitle,
          slug: slugify(noteTitle),
          description: noteDescription,
          language: noteLanguage,
          fileUrl: finalFileUrl,
          fileSize: noteSourceMode === 'drive' ? 0 : noteFileSize,
          filename: finalFilename,
          isPublished: notePublished
        });
        showNotice('success', 'New coding note added.');
      }
      setNoteModalOpen(false);
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to save coding note.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleToggleNotePublish = async (note: CodingNote) => {
    try {
      await updateCodingNote(note.id, { isPublished: !note.isPublished });
      showNotice('success', note.isPublished ? 'Note unpublished.' : 'Note published publicly.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Unable to update status.');
    }
  };

  // Handlers: Affiliate Products
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDescription('');
    setProdCategory('Keyboards and Mice');
    setProdImageUrl('');
    setProdFeaturesText('');
    setProdSpecs('');
    setProdAudience('');
    setProdAdvantages('');
    setProdLimitations('');
    setProdAffiliateUrl('');
    setProdDisclosure(true);
    setProdPublished(true);
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod: AffiliateProduct) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDescription(prod.description);
    setProdCategory(prod.category);
    setProdImageUrl(prod.imageUrl);
    setProdFeaturesText(prod.features.join('\n'));
    setProdSpecs(prod.specifications);
    setProdAudience(prod.suitableAudience);
    setProdAdvantages(prod.advantages);
    setProdLimitations(prod.limitations);
    setProdAffiliateUrl(prod.affiliateUrl);
    setProdDisclosure(prod.disclosureStatus);
    setProdPublished(prod.isPublished);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const features = prodFeaturesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        name: prodName,
        description: prodDescription,
        imageUrl: normalizeImageInputUrl(prodImageUrl),
        category: prodCategory,
        features,
        specifications: prodSpecs,
        suitableAudience: prodAudience,
        advantages: prodAdvantages,
        limitations: prodLimitations,
        affiliateUrl: prodAffiliateUrl,
        disclosureStatus: prodDisclosure,
        isPublished: prodPublished
      };

      if (editingProduct) {
        await updateAffiliateProduct(editingProduct.id, payload);
        showNotice('success', 'Affiliate product updated.');
      } else {
        await createAffiliateProduct(payload);
        showNotice('success', 'Affiliate product created.');
      }
      setProductModalOpen(false);
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleProductPublish = async (prod: AffiliateProduct) => {
    try {
      await updateAffiliateProduct(prod.id, { isPublished: !prod.isPublished });
      showNotice('success', prod.isPublished ? 'Product unpublished.' : 'Product published publicly.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Unable to update product status.');
    }
  };

  // Handlers: Website Settings
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const normalized = {
        ...settingsForm,
        logoUrl: normalizeImageInputUrl(settingsForm.logoUrl)
      };
      await saveWebsiteSettings(normalized);
      showNotice('success', 'Website settings updated across public site.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Unable to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleInquiryStatus = async (msg: ContactMessage) => {
    const nextStatus = msg.status === 'reviewed' ? 'new' : 'reviewed';
    try {
      await updateContactMessageStatus(msg.id, nextStatus);
      showNotice('success', `Marked inquiry as ${nextStatus}.`);
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteContactMessage(id);
      showNotice('success', 'Inquiry removed from Firestore.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to delete inquiry.');
    }
  };

  const SIDEBAR_ITEMS: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'notes', label: 'Manage Coding Notes', icon: FileText },
    { id: 'products', label: 'Manage Affiliate Products', icon: Package },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'inquiries', label: 'Contact Inquiries', icon: Inbox },
    { id: 'settings', label: 'Website Settings', icon: Settings }
  ];

  return (
    <>
      <SeoHead
        title="Admin Dashboard – Short Study"
        description="Private administrative console."
        noIndex
      />

      <div className="min-h-screen bg-[#030712] text-[#F9FAFB] flex flex-col lg:flex-row">
        {/* Sidebar (Compact horizontal tabs on mobile/tablet, full vertical rail on desktop) */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#090F1C] flex flex-col justify-between">
          <div>
            <div className="h-14 sm:h-16 px-4 sm:px-5 flex items-center justify-between gap-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={resolvePublicAssetUrl(settings.logoUrl || DEFAULT_LOGO_URL)}
                  alt={settings.siteName}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-md object-cover ring-1 ring-white/15 shrink-0"
                />
                <span className="font-display text-base font-bold text-[#F9FAFB] truncate">
                  {settings.siteName} Admin
                </span>
              </div>

              <button
                type="button"
                onClick={() => void logout()}
                className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-950/20 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-950/40 shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <nav
              aria-label="Admin sections"
              className="flex lg:flex-col overflow-x-auto no-scrollbar gap-1.5 px-4 py-2.5 lg:p-3 lg:space-y-1 lg:gap-0"
            >
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 lg:w-full flex items-center gap-2.5 lg:gap-3 rounded-lg px-3 py-2 lg:py-2.5 text-xs sm:text-sm font-medium transition-colors text-left whitespace-nowrap ${
                      active
                        ? 'bg-[#6366F1] text-white'
                        : 'text-[#9CA3AF] hover:bg-[#111827] hover:text-[#F9FAFB]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block p-3 border-t border-white/[0.08] space-y-2">
            <div className="px-3 py-1.5 text-xs text-[#9CA3AF] truncate">{user.email}</div>
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Bar */}
          <header className="h-14 sm:h-16 border-b border-white/[0.08] bg-[#030712] px-4 sm:px-6 flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-[#9CA3AF] truncate">
              <span>Admin</span>
              <span className="mx-1.5 sm:mx-2 text-[#6B7280]">/</span>
              <span className="font-medium text-[#F9FAFB]">
                {SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label}
              </span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#F9FAFB] hover:bg-white/10 whitespace-nowrap shrink-0"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </header>

          {toast && (
            <div
              role="status"
              className={`mx-4 sm:mx-6 mt-4 rounded-lg border px-4 py-3 text-xs font-medium flex items-center gap-2 ${
                toast.kind === 'success'
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-500/30 bg-rose-950/30 text-rose-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{toast.text}</span>
            </div>
          )}

          <main className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                      Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-[#9CA3AF]">
                      Live statistics synchronized directly from Cloud Firestore.
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <p className="text-xs text-[#9CA3AF]">Published PDFs</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-[#10B981] tabular-nums">
                      {publishedNotesCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <p className="text-xs text-[#9CA3AF]">Unpublished Draft PDFs</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-amber-400 tabular-nums">
                      {unpublishedNotesCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <p className="text-xs text-[#9CA3AF]">Total Affiliate Products</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-[#F9FAFB] tabular-nums">
                      {products.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <p className="text-xs text-[#9CA3AF]">Published Products</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-[#06B6D4] tabular-nums">
                      {publishedProductsCount}
                    </p>
                  </div>
                </div>

                {/* Recent Tables */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <section className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-base font-semibold text-[#F9FAFB]">
                        Recently Updated Coding Notes
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('notes')}
                        className="text-xs text-[#06B6D4] hover:underline"
                      >
                        Manage all
                      </button>
                    </div>
                    {notes.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">No coding notes in database yet.</p>
                    ) : (
                      <ul className="divide-y divide-white/[0.06] text-sm">
                        {notes.slice(0, 5).map((n) => (
                          <li key={n.id} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-[#F9FAFB] truncate">{n.title}</p>
                              <p className="text-xs text-[#9CA3AF]">
                                {n.language} &middot; {formatShortDate(n.updatedAt)}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-medium shrink-0 ${
                                n.isPublished ? 'text-[#10B981]' : 'text-amber-400'
                              }`}
                            >
                              {n.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="rounded-xl border border-white/[0.08] bg-[#111827] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-base font-semibold text-[#F9FAFB]">
                        Recently Updated Affiliate Products
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="text-xs text-[#06B6D4] hover:underline"
                      >
                        Manage all
                      </button>
                    </div>
                    {products.length === 0 ? (
                      <p className="text-xs text-[#9CA3AF]">No affiliate products in database yet.</p>
                    ) : (
                      <ul className="divide-y divide-white/[0.06] text-sm">
                        {products.slice(0, 5).map((p) => (
                          <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-[#F9FAFB] truncate">{p.name}</p>
                              <p className="text-xs text-[#9CA3AF]">
                                {p.category} &middot; {formatShortDate(p.updatedAt)}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-medium shrink-0 ${
                                p.isPublished ? 'text-[#10B981]' : 'text-amber-400'
                              }`}
                            >
                              {p.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE CODING NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                      Manage Coding Notes
                    </h1>
                    <p className="mt-1 text-sm text-[#9CA3AF]">
                      Upload, edit, publish, unpublish, or remove downloadable PDFs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateNoteModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-indigo-500 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New PDF</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center space-y-3">
                    <p className="text-sm text-[#9CA3AF]">No coding notes added yet.</p>
                    <button
                      type="button"
                      onClick={openCreateNoteModal}
                      className="rounded-lg bg-[#6366F1] px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
                    >
                      Add Your First PDF
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#111827]">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-white/[0.08] bg-[#090F1C] text-xs text-[#9CA3AF]">
                        <tr>
                          <th className="px-4 py-3 font-medium">Title</th>
                          <th className="px-4 py-3 font-medium">Language</th>
                          <th className="px-4 py-3 font-medium">Size</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {notes.map((note) => (
                          <tr key={note.id} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3">
                              <p className="font-medium text-[#F9FAFB]">{note.title}</p>
                              <p className="text-xs text-[#9CA3AF] truncate max-w-md">
                                {note.filename}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#D1D5DB] whitespace-nowrap">
                              {note.language}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-[#9CA3AF] tabular-nums whitespace-nowrap">
                              {formatBytes(note.fileSize)}
                            </td>
                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                              <span
                                className={
                                  note.isPublished
                                    ? 'font-medium text-[#10B981]'
                                    : 'font-medium text-amber-400'
                                }
                              >
                                {note.isPublished ? 'Published' : 'Unpublished'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <a
                                  href={getPdfDisplayUrls(note.fileUrl, note.filename).openUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Preview PDF"
                                  className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => void handleToggleNotePublish(note)}
                                  title={note.isPublished ? 'Unpublish' : 'Publish'}
                                  className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                                >
                                  {note.isPublished ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditNoteModal(note)}
                                  title="Edit PDF"
                                  className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDelete({
                                      label: `Delete "${note.title}" permanently?`,
                                      onConfirm: async () => {
                                        await deleteCodingNote(note.id);
                                        showNotice('success', 'Coding note deleted.');
                                      }
                                    })
                                  }
                                  title="Delete PDF"
                                  className="rounded-md p-1.5 text-rose-400 hover:bg-rose-950/40"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MANAGE AFFILIATE PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                      Manage Affiliate Products
                    </h1>
                    <p className="mt-1 text-sm text-[#9CA3AF]">
                      Add technology products, configure affiliate links, preview cards, and control
                      publication.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateProductModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-indigo-500 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center space-y-3">
                    <p className="text-sm text-[#9CA3AF]">No affiliate products created yet.</p>
                    <button
                      type="button"
                      onClick={openCreateProductModal}
                      className="rounded-lg bg-[#6366F1] px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
                    >
                      Add First Product
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#111827]">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-white/[0.08] bg-[#090F1C] text-xs text-[#9CA3AF]">
                        <tr>
                          <th className="px-4 py-3 font-medium">Product</th>
                          <th className="px-4 py-3 font-medium">Category</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3">
                              <p className="font-medium text-[#F9FAFB]">{prod.name}</p>
                              <p className="text-xs text-[#9CA3AF] truncate max-w-sm">
                                {prod.affiliateUrl}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#D1D5DB] whitespace-nowrap">
                              {prod.category}
                            </td>
                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                              <span
                                className={
                                  prod.isPublished
                                    ? 'font-medium text-[#10B981]'
                                    : 'font-medium text-amber-400'
                                }
                              >
                                {prod.isPublished ? 'Published' : 'Unpublished'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewProduct(prod)}
                                  title="Preview Product Card"
                                  className="rounded-md px-2 py-1 text-xs text-[#06B6D4] hover:bg-white/10"
                                >
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleToggleProductPublish(prod)}
                                  title={prod.isPublished ? 'Unpublish' : 'Publish'}
                                  className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                                >
                                  {prod.isPublished ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditProductModal(prod)}
                                  title="Edit Product"
                                  className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDelete({
                                      label: `Delete product "${prod.name}" permanently?`,
                                      onConfirm: async () => {
                                        await deleteAffiliateProduct(prod.id);
                                        showNotice('success', 'Affiliate product deleted.');
                                      }
                                    })
                                  }
                                  title="Delete Product"
                                  className="rounded-md p-1.5 text-rose-400 hover:bg-rose-950/40"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MEDIA LIBRARY */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                    Media Library
                  </h1>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Bookmark Google Drive PDFs, product image URLs, and static assets directly in
                    Cloud Firestore.
                  </p>
                </div>

                <form
                  onSubmit={handleSaveMediaLink}
                  className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end"
                >
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Resource Name
                    </label>
                    <input
                      type="text"
                      required
                      value={mediaName}
                      onChange={(e) => setMediaName(e.target.value)}
                      placeholder="e.g. DSA Sheet PDF"
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value === 'image' ? 'image' : 'pdf')}
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                    >
                      <option value="pdf">PDF Link</option>
                      <option value="image">Image URL</option>
                    </select>
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Google Drive / HTTPS / Static URL
                    </label>
                    <input
                      type="text"
                      required
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... or https://..."
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={savingMedia}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      <span>{savingMedia ? 'Saving...' : 'Save Link'}</span>
                    </button>
                  </div>
                </form>

                {mediaFiles.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center text-sm text-[#9CA3AF]">
                    No saved media links yet. Add a Google Drive link or external URL above to store
                    it in Firestore.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mediaFiles.map((file) => (
                      <div
                        key={file.id}
                        className="rounded-xl border border-white/[0.08] bg-[#111827] p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-[#06B6D4] uppercase">
                              {file.fileType}
                            </p>
                            <p className="text-sm font-medium text-[#F9FAFB] truncate">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-[#9CA3AF] tabular-nums">
                              {file.fileSize > 0
                                ? `${formatBytes(file.fileSize)} · `
                                : ''}
                              {formatShortDate(file.createdAt)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDelete({
                                label: `Remove media entry "${file.originalName}"?`,
                                onConfirm: async () => {
                                  await deleteMediaFileRecord(file.id);
                                  showNotice('success', 'Media entry removed.');
                                }
                              })
                            }
                            className="rounded p-1.5 text-rose-400 hover:bg-rose-950/40"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs">
                          <a
                            href={resolvePublicAssetUrl(file.storageUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-300 hover:underline truncate"
                          >
                            Open link
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              void navigator.clipboard.writeText(file.storageUrl);
                              showNotice('success', 'URL copied to clipboard.');
                            }}
                            className="text-[#9CA3AF] hover:text-white"
                          >
                            Copy URL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CONTACT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                    Contact Inquiries
                  </h1>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Messages submitted through the public Contact Us form, synced live from Cloud
                    Firestore.
                  </p>
                </div>

                {inquiries.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.08] bg-[#111827] p-10 text-center text-sm text-[#9CA3AF]">
                    No contact inquiries received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-white/[0.08] bg-[#111827] p-5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-base font-semibold text-[#F9FAFB]">
                                {msg.subject}
                              </h3>
                              <span
                                className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                                  msg.status === 'reviewed'
                                    ? 'bg-emerald-950/60 text-[#10B981]'
                                    : 'bg-indigo-950/60 text-indigo-300'
                                }`}
                              >
                                {msg.status === 'reviewed' ? 'Reviewed' : 'New'}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-[#9CA3AF]">
                              From <span className="text-[#F9FAFB]">{msg.name}</span> (
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-[#06B6D4] hover:underline"
                              >
                                {msg.email}
                              </a>
                              ) &middot; {msg.createdAt.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void handleToggleInquiryStatus(msg)}
                              className="rounded-md border border-white/15 bg-[#090F1C] px-2.5 py-1 text-xs font-medium text-[#D1D5DB] hover:bg-white/10"
                            >
                              {msg.status === 'reviewed' ? 'Mark as New' : 'Mark Reviewed'}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteInquiry(msg.id)}
                              className="rounded p-1.5 text-rose-400 hover:bg-rose-950/40"
                              title="Delete inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-[#D1D5DB] whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: WEBSITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-[#F9FAFB]">
                    Website Settings
                  </h1>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Update global branding, contact links, footer copy, and SEO metadata.
                  </p>
                </div>

                <form
                  onSubmit={handleSaveSettings}
                  className="rounded-xl border border-white/[0.08] bg-[#111827] p-6 space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Website Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.siteName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, siteName: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Header Logo Text
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.logoText}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, logoText: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Logo Image URL or Asset Path (Also used as browser tab icon across all pages)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <img
                        src={resolvePublicAssetUrl(
                          normalizeImageInputUrl(settingsForm.logoUrl) || DEFAULT_LOGO_URL
                        )}
                        alt="Logo preview"
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/15 shrink-0 bg-[#090F1C]"
                      />
                      <input
                        type="text"
                        value={settingsForm.logoUrl}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, logoUrl: e.target.value })
                        }
                        placeholder={`${DEFAULT_LOGO_URL} or https://...`}
                        className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                      {settingsForm.logoUrl !== DEFAULT_LOGO_URL && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettingsForm({ ...settingsForm, logoUrl: DEFAULT_LOGO_URL })
                          }
                          className="rounded-lg border border-white/15 bg-[#090F1C] px-3 py-2 text-xs font-medium text-[#9CA3AF] hover:text-white"
                        >
                          Use Default
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Website Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={settingsForm.siteDescription}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, siteDescription: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        value={settingsForm.contactEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.instagramHandle}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        required
                        value={settingsForm.instagramUrl}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                      Footer Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={settingsForm.footerDescription}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, footerDescription: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Default SEO Title
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.seoTitle}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, seoTitle: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                        Default SEO Meta Description
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.seoDescription}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, seoDescription: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {savingSettings ? 'Saving Settings...' : 'Save Website Settings'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Coding Note Add/Edit Modal */}
      {noteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSaveNote}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/15 bg-[#111827] p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">
                {editingNote ? 'Edit Coding Note' : 'Add New PDF Resource'}
              </h2>
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="rounded p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">PDF Title</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={160}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Python Loops & Functions Reference"
                className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Programming Language / Category
              </label>
              <select
                value={noteLanguage}
                onChange={(e) => setNoteLanguage(e.target.value as CodingCategory)}
                className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
              >
                {CODING_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">Description</label>
              <textarea
                rows={3}
                required
                minLength={10}
                maxLength={1200}
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                placeholder="Concise original description of what learners will cover..."
                className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
              />
            </div>

            <div className="rounded-lg border border-white/10 bg-[#090F1C] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#D1D5DB]">PDF Source</span>
                <div className="inline-flex rounded-lg bg-[#030712] p-0.5 border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setNoteSourceMode('drive')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      noteSourceMode === 'drive'
                        ? 'bg-[#6366F1] text-white'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Google Drive Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteSourceMode('url')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      noteSourceMode === 'url'
                        ? 'bg-[#6366F1] text-white'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Direct PDF URL
                  </button>
                </div>
              </div>

              {noteSourceMode === 'drive' ? (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="note-drive-input"
                      className="block text-xs text-[#9CA3AF] mb-1.5"
                    >
                      Paste Google Drive embedded link, share URL, or{' '}
                      <code className="font-mono text-[#06B6D4]">&lt;iframe&gt;</code> embed code
                    </label>
                    <textarea
                      id="note-drive-input"
                      rows={2}
                      value={noteDriveInput}
                      onChange={(e) => handleDriveInputChange(e.target.value)}
                      placeholder="https://drive.google.com/file/d/FILE_ID/preview or <iframe src=&quot;https://drive.google.com/file/d/FILE_ID/preview&quot; ...>"
                      className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 font-mono text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>

                  {(() => {
                    const parsed = parseGoogleDriveInput(noteDriveInput);
                    if (!noteDriveInput.trim()) {
                      return (
                        <p className="text-[11px] text-[#9CA3AF]">
                          Make sure the file sharing permission in Google Drive is set to{' '}
                          <span className="text-[#F9FAFB]">Anyone with the link can view</span>.
                        </p>
                      );
                    }
                    if (!parsed) {
                      return (
                        <p className="text-xs text-rose-300">
                          Could not detect a valid Google Drive file ID. Paste a link like{' '}
                          <span className="font-mono">
                            https://drive.google.com/file/d/.../view
                          </span>{' '}
                          or <span className="font-mono">.../preview</span>.
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-[#10B981] font-medium">
                            Valid Google Drive PDF &middot; ID:{' '}
                            <span className="font-mono">{parsed.fileId}</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setShowDrivePreview((prev) => !prev)}
                              className="text-[#06B6D4] hover:underline font-medium"
                            >
                              {showDrivePreview ? 'Hide Embed Preview' : 'Test Embed Preview'}
                            </button>
                            <a
                              href={parsed.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-300 hover:underline"
                            >
                              <span>Open Tab</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        {showDrivePreview && (
                          <div className="h-64 w-full overflow-hidden rounded-lg border border-white/10 bg-[#030712]">
                            <iframe
                              src={parsed.previewUrl}
                              title="Google Drive PDF Preview"
                              className="h-full w-full border-0"
                              allow="autoplay"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="note-direct-url"
                      className="block text-xs text-[#9CA3AF] mb-1.5"
                    >
                      Direct HTTPS PDF URL
                    </label>
                    <input
                      id="note-direct-url"
                      type="text"
                      value={noteFileUrl}
                      onChange={(e) => {
                        setNoteFileUrl(e.target.value);
                        if (!noteFilename) {
                          setNoteFilename(`${slugify(noteTitle || 'coding-note')}.pdf`);
                        }
                      }}
                      placeholder="https://example.com/notes.pdf"
                      className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 font-mono text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#6366F1] focus:outline-none"
                    />
                  </div>
                  {noteFileUrl.trim() && (
                    <a
                      href={getPdfDisplayUrls(noteFileUrl.trim(), noteFilename).openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#06B6D4] hover:underline"
                    >
                      <span>Open PDF URL</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-[#D1D5DB] cursor-pointer">
              <input
                type="checkbox"
                checked={notePublished}
                onChange={(e) => setNotePublished(e.target.checked)}
                className="h-4 w-4 accent-[#6366F1]"
              />
              <span>Publish immediately on public Coding Notes page</span>
            </label>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingNote}
                className="rounded-lg bg-[#6366F1] px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {savingNote ? 'Saving...' : editingNote ? 'Save Changes' : 'Create PDF Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Affiliate Product Add/Edit Modal */}
      {productModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/15 bg-[#111827] p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">
                {editingProduct ? 'Edit Affiliate Product' : 'Add Affiliate Product'}
              </h2>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={160}
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Product Image URL (https://..., Google Drive image link, or /assets/...)
              </label>
              <div className="flex items-center gap-3">
                {prodImageUrl.trim() && (
                  <img
                    src={resolvePublicAssetUrl(normalizeImageInputUrl(prodImageUrl))}
                    alt="Product preview"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/15 shrink-0 bg-[#090F1C]"
                  />
                )}
                <input
                  type="text"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://... or Google Drive share link"
                  className="flex-1 rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Original Description
              </label>
              <textarea
                rows={3}
                required
                minLength={10}
                maxLength={2000}
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                  Key Features (one per line)
                </label>
                <textarea
                  rows={3}
                  value={prodFeaturesText}
                  onChange={(e) => setProdFeaturesText(e.target.value)}
                  placeholder="Hot-swappable switches&#10;USB-C wired & Bluetooth&#10;Mac/Windows layout"
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                  Specifications
                </label>
                <textarea
                  rows={3}
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  placeholder="75% layout, PBT keycaps, 4000mAh battery"
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                  Suitable Audience
                </label>
                <input
                  type="text"
                  value={prodAudience}
                  onChange={(e) => setProdAudience(e.target.value)}
                  placeholder="CS students, full-stack devs"
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">Advantages</label>
                <input
                  type="text"
                  value={prodAdvantages}
                  onChange={(e) => setProdAdvantages(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#D1D5DB] mb-1">Limitations</label>
                <input
                  type="text"
                  value={prodLimitations}
                  onChange={(e) => setProdLimitations(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D1D5DB] mb-1">
                Affiliate Destination URL (https://...)
              </label>
              <input
                type="url"
                required
                value={prodAffiliateUrl}
                onChange={(e) => setProdAffiliateUrl(e.target.value)}
                placeholder="https://example.com/product?tag=..."
                className="w-full rounded-lg border border-white/10 bg-[#090F1C] px-3 py-2 text-sm text-[#F9FAFB]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-[#D1D5DB] cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodDisclosure}
                  onChange={(e) => setProdDisclosure(e.target.checked)}
                  className="h-4 w-4 accent-[#6366F1]"
                />
                <span>Show affiliate link disclosure</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-[#D1D5DB] cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodPublished}
                  onChange={(e) => setProdPublished(e.target.checked)}
                  className="h-4 w-4 accent-[#6366F1]"
                />
                <span>Publish publicly</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="rounded-lg bg-[#6366F1] px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {savingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Affiliate Product Card Modal */}
      {previewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-5xl rounded-xl border border-white/15 bg-[#030712] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#F9FAFB]">
                Public Card Preview
              </h2>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="rounded p-1 text-[#9CA3AF] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProductCard product={previewProduct} />
          </div>
        </div>
      )}

      {/* Permanent Deletion Confirmation Dialog */}
      {confirmDelete && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-xl border border-white/15 bg-[#111827] p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">
              Confirm Permanent Deletion
            </h2>
            <p className="text-sm text-[#9CA3AF]">{confirmDelete.label}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await confirmDelete.onConfirm();
                    setConfirmDelete(null);
                  } catch (err) {
                    showNotice('error', err instanceof Error ? err.message : 'Deletion failed.');
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-500 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
