import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle,
  Presentation
} from 'lucide-react';
import CodePracticePanel from './CodePracticePanel';

const THEME_BG = {
  indigo: 'from-indigo-600 via-violet-600 to-fuchsia-600',
  emerald: 'from-emerald-600 via-teal-600 to-cyan-700',
  amber: 'from-amber-500 via-orange-500 to-red-600',
  rose: 'from-rose-500 via-pink-600 to-fuchsia-700',
  slate: 'from-slate-700 via-slate-800 to-slate-900',
  violet: 'from-violet-600 via-purple-600 to-indigo-800'
};

const VARIANT_ICON = {
  intro: Sparkles,
  content: BookOpen,
  practice: Code2,
  summary: CheckCircle
};

const LessonSlideshow = ({ slides, resetKey, lessonIndex = 0 }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [resetKey]);

  const total = slides?.length || 0;
  const safe = total ? Math.min(Math.max(0, idx), total - 1) : 0;
  const slide = total ? slides[safe] : null;

  const go = useCallback(
    (dir) => {
      setIdx((i) => {
        const next = i + dir;
        if (next < 0 || next >= total) return i;
        return next;
      });
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!total || !slide) return null;

  const Icon = VARIANT_ICON[slide.variant] || BookOpen;
  const theme = slide.theme && THEME_BG[slide.theme] ? slide.theme : 'indigo';
  const grad = THEME_BG[theme];

  return (
    <section className="space-y-4" aria-label="Lesson presentation">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
          <Presentation className="w-4 h-4 text-indigo-600" />
          Interactive presentation
        </h4>
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          Slide {safe + 1} / {total} · use ← → keys
        </span>
      </div>

      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br shadow-2xl ring-1 ring-black/10 min-h-[280px] md:min-h-[340px] ${grad}`}
      >
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_20%_30%,white,transparent_45%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4xMiI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L3N2Zz4=')] pointer-events-none" />

        <div className="relative p-6 md:p-10 text-white flex flex-col justify-center min-h-[280px] md:min-h-[340px] transition-opacity duration-300">
          <div className="flex items-start gap-4 mb-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30">
              <Icon className="w-6 h-6 text-white" strokeWidth={2} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                {slide.variant === 'intro' && 'Start here'}
                {slide.variant === 'content' && 'Concept'}
                {slide.variant === 'practice' && 'Try it'}
                {slide.variant === 'summary' && 'Recap'}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-sm">
                {slide.title}
              </h3>
            </div>
          </div>
          {slide.body ? (
            <div className="text-base md:text-lg text-white/95 leading-relaxed whitespace-pre-wrap max-w-3xl drop-shadow-sm">
              {slide.body}
            </div>
          ) : null}
        </div>

        <div className="relative flex items-center justify-between gap-2 px-4 py-3 bg-black/20 backdrop-blur-md border-t border-white/10">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={safe <= 0}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-[50%]">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === safe ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={safe >= total - 1}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {slide.practice && slide.practice.title && (
        <div className="rounded-2xl border border-indigo-200/80 bg-white p-1 shadow-inner">
          <p className="px-4 pt-3 text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            On-slide practice
          </p>
          <CodePracticePanel
            practice={slide.practice}
            pageIndex={lessonIndex}
            practiceIndex={`slide-${safe}`}
          />
        </div>
      )}
    </section>
  );
};

export default LessonSlideshow;
