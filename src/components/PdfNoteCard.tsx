import { useState } from 'react';
import { Download, ExternalLink, Eye, FileText, X } from 'lucide-react';
import { getPdfDisplayUrls } from '../lib/googleDrive';
import type { CodingNote } from '../types';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return 'PDF';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function PdfNoteCard({ note }: { note: CodingNote }) {
  const [embedOpen, setEmbedOpen] = useState(false);

  const safeDownloadName = note.filename?.toLowerCase().endsWith('.pdf')
    ? note.filename
    : `${note.slug || 'short-study-note'}.pdf`;

  const { isDrive, previewUrl, openUrl, downloadUrl } = getPdfDisplayUrls(
    note.fileUrl,
    safeDownloadName
  );

  return (
    <>
      <article className="group flex flex-col gap-4 sm:gap-5 rounded-xl border border-white/[0.08] bg-[#111827] p-5 sm:p-6 transition-colors duration-150 hover:border-indigo-500/40 md:flex-row md:items-center md:justify-between">
        {/* Left: PDF Icon Container + Middle Metadata/Copy */}
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-indigo-500/25 bg-[#090F1C] text-indigo-400"
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="mt-0.5 font-mono text-[10px] font-semibold tracking-wider text-rose-400">
              PDF
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#9CA3AF] tabular-nums">
              <span className="font-medium text-[#06B6D4]">{note.language}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{isDrive && note.fileSize <= 0 ? 'Google Drive PDF' : formatBytes(note.fileSize)}</span>
              <span aria-hidden="true">&middot;</span>
              <span>Updated {formatShortDate(note.updatedAt)}</span>
            </div>

            <h3 className="font-display text-base font-semibold text-[#F9FAFB] leading-snug">
              {note.title}
            </h3>

            <p className="text-sm leading-relaxed text-[#9CA3AF] line-clamp-2">
              {note.description}
            </p>
          </div>
        </div>

        {/* Right: Embedded Preview (for Drive) + Open & Download Buttons */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-4 sm:flex sm:flex-wrap sm:items-center md:border-t-0 md:pt-0 md:pl-4 shrink-0">
          {isDrive && (
            <button
              type="button"
              onClick={() => setEmbedOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#090F1C] px-3.5 py-2.5 sm:py-2 text-sm font-medium text-[#F9FAFB] transition-colors hover:border-white/30 hover:bg-white/5 whitespace-nowrap"
            >
              <Eye className="h-4 w-4 text-indigo-400" />
              <span>Preview</span>
            </button>
          )}

          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#090F1C] px-4 py-2.5 sm:py-2 text-sm font-medium text-[#F9FAFB] transition-colors hover:border-white/30 hover:bg-white/5 whitespace-nowrap"
          >
            <ExternalLink className="h-4 w-4 text-[#06B6D4]" />
            <span>Open</span>
          </a>

          <a
            href={downloadUrl}
            target={isDrive ? '_blank' : undefined}
            rel={isDrive ? 'noopener noreferrer' : undefined}
            download={!isDrive ? safeDownloadName : undefined}
            className={`${isDrive ? 'col-span-2 sm:col-span-1 ' : ''}inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-4 py-2.5 sm:py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 whitespace-nowrap`}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </a>
        </div>
      </article>

      {/* Embedded Google Drive PDF Viewer Modal */}
      {embedOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`pdf-modal-${note.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2.5 sm:p-4 backdrop-blur-sm"
        >
          <div className="flex h-[90vh] sm:h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/15 bg-[#090F1C] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-b border-white/10 bg-[#111827] px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="min-w-0 flex-1">
                <h3
                  id={`pdf-modal-${note.id}`}
                  className="font-display text-sm sm:text-base font-semibold text-[#F9FAFB] truncate"
                >
                  {note.title}
                </h3>
                <p className="text-xs text-[#9CA3AF]">{note.language}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#090F1C] px-3 py-1.5 text-xs font-medium text-[#F9FAFB] hover:bg-white/5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#06B6D4]" />
                  <span>Open Tab</span>
                </a>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#6366F1] px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setEmbedOpen(false)}
                  aria-label="Close PDF preview"
                  className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#030712]">
              <iframe
                src={previewUrl}
                title={note.title}
                className="h-full w-full border-0"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
