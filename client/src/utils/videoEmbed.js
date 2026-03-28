/**
 * Normalize common video URLs to iframe-safe embed URLs (YouTube).
 */
export function toEmbedSrc(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u) return null;

  if (u.includes('youtube.com/embed/')) {
    return u.split('&')[0].split('?')[0];
  }

  const watch = u.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) {
    return `https://www.youtube.com/embed/${watch[1]}`;
  }

  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) {
    return `https://www.youtube.com/embed/${short[1]}`;
  }

  if (u.includes('youtube.com/shorts/')) {
    const m = u.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }

  return null;
}
