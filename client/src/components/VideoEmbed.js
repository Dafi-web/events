import React from 'react';
import { Play } from 'lucide-react';
import { toEmbedSrc } from '../utils/videoEmbed';

const VideoEmbed = ({ url, caption, title }) => {
  const embed = toEmbedSrc(url);
  if (!embed) {
    if (!url) return null;
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
        <p className="font-medium mb-1">Video link</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline break-all"
        >
          {url}
        </a>
        <p className="text-xs mt-2 text-amber-800">
          Paste a YouTube link or embed URL to show the player here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 bg-slate-900 aspect-video">
        <iframe
          title={title || 'Lesson video'}
          src={`${embed}?rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Play className="w-3.5 h-3.5 fill-white" />
          Video
        </div>
      </div>
      {caption && (
        <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-indigo-400 pl-4 py-1">
          {caption}
        </p>
      )}
    </div>
  );
};

export default VideoEmbed;
