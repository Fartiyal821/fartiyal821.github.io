import { resolvePublicAssetUrl } from '../types';

export interface ParsedGoogleDriveFile {
  fileId: string;
  previewUrl: string;
  downloadUrl: string;
  imageUrl: string;
}

const DRIVE_ID_REGEX = /^[a-zA-Z0-9_-]{10,120}$/;

export function extractGoogleDriveFileId(rawInput: string): string | null {
  const input = rawInput.trim();
  if (!input) return null;

  // If user pasted full <iframe> embed snippet, extract src attribute safely
  let candidateUrl = input;
  const iframeSrcMatch = input.match(/src\s*=\s*["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    candidateUrl = iframeSrcMatch[1].trim();
  }

  let parsed: URL;
  try {
    parsed = new URL(candidateUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (host !== 'drive.google.com' && host !== 'docs.google.com') {
    return null;
  }

  // Pattern 1: /file/d/<ID>/...
  const filePathMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePathMatch && DRIVE_ID_REGEX.test(filePathMatch[1])) {
    return filePathMatch[1];
  }

  // Pattern 2: /document/d/<ID>/... or /presentation/d/<ID>/...
  const docsPathMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (docsPathMatch && DRIVE_ID_REGEX.test(docsPathMatch[1])) {
    return docsPathMatch[1];
  }

  // Pattern 3: ?id=<ID> (open?id=... or uc?id=... or thumbnail?id=...)
  const queryId = parsed.searchParams.get('id');
  if (queryId && DRIVE_ID_REGEX.test(queryId)) {
    return queryId;
  }

  return null;
}

export function parseGoogleDriveInput(rawInput: string): ParsedGoogleDriveFile | null {
  const fileId = extractGoogleDriveFileId(rawInput);
  if (!fileId) return null;
  return {
    fileId,
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    imageUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`
  };
}

export function normalizeImageInputUrl(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  const drive = parseGoogleDriveInput(trimmed);
  if (drive) return drive.imageUrl;
  return trimmed;
}

export function getPdfDisplayUrls(
  fileUrl: string,
  _downloadName: string
): {
  isDrive: boolean;
  previewUrl: string;
  openUrl: string;
  downloadUrl: string;
} {
  const drive = parseGoogleDriveInput(fileUrl);
  if (drive) {
    return {
      isDrive: true,
      previewUrl: drive.previewUrl,
      openUrl: drive.previewUrl,
      downloadUrl: drive.downloadUrl
    };
  }

  const resolvedUrl = resolvePublicAssetUrl(fileUrl);
  return {
    isDrive: false,
    previewUrl: resolvedUrl,
    openUrl: resolvedUrl,
    downloadUrl: resolvedUrl
  };
}
