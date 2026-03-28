import React from 'react';
import { Mic, Video, ImageIcon } from 'lucide-react';
import VideoEmbed from './VideoEmbed';
import { toEmbedSrc } from '../utils/videoEmbed';

function inferKind(url, hint) {
  const h = String(hint || '').toLowerCase();
  if (['gif', 'image', 'video'].includes(h)) return h;
  const u = String(url || '');
  if (/\.gif(\?|#|$)/i.test(u)) return 'gif';
  if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(u)) return 'video';
  if (/\.(png|jpe?g|webp|svg)(\?|#|$)/i.test(u)) return 'image';
  return '';
}

function VisualBlock({ url, kind }) {
  if (!url) return null;
  const k = inferKind(url, kind);
  if (k === 'video') {
    return (
      <div className="rounded-2xl overflow-hidden ring-2 ring-indigo-200/80 bg-black shadow-lg">
        <video src={url} controls playsInline className="w-full max-h-[min(420px,55vh)] object-contain" />
      </div>
    );
  }
  return (
    <div className="rounded-2xl overflow-hidden ring-2 ring-indigo-200/80 bg-slate-100 flex justify-center">
      <img src={url} alt="" className="max-w-full max-h-[min(420px,55vh)] object-contain" loading="lazy" />
    </div>
  );
}

/**
 * Course overview block: explainer video (YouTube or direct file), optional narration audio, optional GIF/image.
 */
const CourseExplainerPanel = ({ explainer }) => {
  if (!explainer) return null;
  const title = explainer.title || 'Course introduction';
  const { videoUrl, audioUrl, visualUrl, visualKind, caption } = explainer;
  const hasAny = Boolean(
    String(videoUrl || '').trim() || String(audioUrl || '').trim() || String(visualUrl || '').trim()
  );
  if (!hasAny) return null;

  const youtubeEmbed = videoUrl ? toEmbedSrc(videoUrl) : null;

  return (
    <section className="rounded-2xl border-2 border-indigo-200/90 bg-gradient-to-br from-white via-indigo-50/50 to-violet-50 p-6 md:p-8 shadow-lg shadow-indigo-100/60">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-6 h-6 text-indigo-600 shrink-0" />
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      <div className="space-y-6">
        {visualUrl && String(visualUrl).trim() && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              Visual (GIF / image / clip)
            </p>
            <VisualBlock url={visualUrl.trim()} kind={visualKind} />
          </div>
        )}

        {videoUrl && String(videoUrl).trim() && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Video</p>
            {youtubeEmbed ? (
              <VideoEmbed url={videoUrl.trim()} caption={caption} title={title} />
            ) : (
              <>
                <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-black shadow-xl">
                  <video
                    src={videoUrl.trim()}
                    controls
                    playsInline
                    className="w-full aspect-video object-contain max-h-[min(480px,60vh)]"
                  />
                </div>
                {caption && String(caption).trim() && (
                  <p className="text-sm text-slate-600 mt-3 border-l-4 border-indigo-400 pl-4">{caption}</p>
                )}
              </>
            )}
          </div>
        )}

        {audioUrl && String(audioUrl).trim() && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              Voice narration
            </p>
            <audio controls src={audioUrl.trim()} className="w-full max-w-xl" preload="metadata" />
            <p className="text-xs text-slate-500 mt-2">
              Use headphones in quiet spaces. Audio is hosted at the URL you set in admin (e.g. Cloudinary).
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseExplainerPanel;
