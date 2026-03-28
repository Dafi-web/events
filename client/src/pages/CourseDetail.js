import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  PlayCircle,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  ListChecks,
  Lightbulb,
  FolderGit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';
import ImageGallery from '../components/ImageGallery';
import CodePracticePanel from '../components/CodePracticePanel';
import VideoEmbed from '../components/VideoEmbed';
import LessonAnimatedPlayer from '../components/LessonAnimatedPlayer';
import LessonQuiz from '../components/LessonQuiz';

const CATEGORY_LABELS = {
  stem: 'STEM',
  languages: 'Languages',
  arts: 'Arts',
  business: 'Business',
  technology: 'Technology',
  general: 'General'
};

const CourseDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (e) {
      console.error(e);
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  useEffect(() => {
    setLessonIndex(0);
  }, [id]);

  useEffect(() => {
    if (location.hash === '#lessons' && !loading && (course?.pages?.length || 0) > 0) {
      setActiveSection('readings');
    }
  }, [location.hash, loading, course?.pages?.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h1>
          <p className="text-slate-600 mb-6">This course may have been removed or is not published.</p>
          <Link
            to="/courses"
            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const cover =
    course.coverImage || (course.images && course.images[0]?.url) || null;
  const videos = course.videos || [];
  const pages = course.pages || [];
  const practiceCount = pages.reduce((n, p) => n + (p.practices?.length || 0), 0);
  const lessonSafe = Math.min(Math.max(0, lessonIndex), Math.max(0, pages.length - 1));
  const currentPage = pages.length > 0 ? pages[lessonSafe] : null;
  const lessonProgress = pages.length ? ((lessonSafe + 1) / pages.length) * 100 : 0;
  const images = course.images || [];
  const unpublished = !course.isPublished;

  const showVideosNav = videos.length > 0 || pages.length > 0;
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    ...(showVideosNav
      ? [
          {
            id: 'videos',
            label: videos.length ? `Videos (${videos.length})` : 'Videos',
            icon: PlayCircle
          }
        ]
      : []),
    ...(pages.length
      ? [
          {
            id: 'readings',
            label:
              practiceCount > 0
                ? `Lessons (${pages.length}) · ${practiceCount} practices`
                : `Lessons (${pages.length})`,
            icon: GraduationCap
          }
        ]
      : []),
    ...(images.length > 1 ? [{ id: 'gallery', label: 'Gallery', icon: BookOpen }] : []),
    { id: 'discussion', label: 'Discussion', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/courses"
            className="inline-flex items-center text-indigo-200 hover:text-white text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All courses
          </Link>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                  {CATEGORY_LABELS[course.category] || course.category}
                </span>
                {unpublished && user?.role === 'admin' && (
                  <span className="rounded-full bg-amber-500/20 text-amber-100 px-3 py-1 text-xs font-semibold">
                    Draft (only visible to admins)
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
              {course.summary && (
                <p className="text-lg text-indigo-100/90 leading-relaxed">{course.summary}</p>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl">
              {cover ? (
                <img src={cover} alt="" className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 bg-indigo-800/50 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-indigo-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-4">
            <nav className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course menu
              </div>
              <ul className="p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          if (item.id === 'gallery' && images.length) {
                            setGalleryOpen(true);
                            setGalleryIndex(0);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                          active
                            ? 'bg-indigo-50 text-indigo-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 opacity-80" />
                        {item.label}
                        <ChevronRight
                          className={`w-4 h-4 ml-auto opacity-40 ${active ? 'text-indigo-600' : ''}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            {activeSection === 'readings' && pages.length > 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Lesson outline</span>
                </div>
                <ul className="max-h-[min(420px,50vh)] overflow-y-auto p-2 space-y-0.5">
                  {pages.map((p, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setLessonIndex(i)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          lessonSafe === i
                            ? 'bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-indigo-500 font-bold mr-2 tabular-nums">{i + 1}.</span>
                        <span className="line-clamp-2">{p.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <ReactionButtons
                contentType="course"
                contentId={course._id}
                initialLikes={course.likes?.length || 0}
                initialDislikes={course.dislikes?.length || 0}
                initialViews={course.views || 0}
              />
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-10">
            {activeSection === 'overview' && (
              <div className="space-y-8">
                {pages.length > 0 && (
                  <div className="rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 md:p-8 shadow-md shadow-indigo-100/80">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <PlayCircle className="w-6 h-6 text-indigo-600 shrink-0" />
                          Animated step-by-step lessons
                        </h2>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-xl">
                          Open <strong>Lessons</strong> for the full-screen walkthrough (auto-advance scenes, play/pause,
                          prev/next). This is built into the course — not YouTube. Optional uploaded files appear under{' '}
                          <strong>Videos</strong> if the instructor added them.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection('readings')}
                        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 transition-all"
                      >
                        Open lessons
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">About this course</h2>
                  <div
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap"
                  >
                    {course.description}
                  </div>
                </div>

                {course.sampleProject && course.sampleProject.title && (
                  <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <FolderGit2 className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-bold text-slate-900">Sample project</h2>
                    </div>
                    <p className="text-slate-700 mb-3 whitespace-pre-wrap">{course.sampleProject.description}</p>
                    {course.sampleProject.repoUrl && (
                      <a
                        href={course.sampleProject.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Open repository / starter →
                      </a>
                    )}
                    {course.sampleProject.codeSample && (
                      <pre className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                        {course.sampleProject.codeSample}
                      </pre>
                    )}
                  </div>
                )}

                {course.tips && course.tips.length > 0 && (
                  <div className="rounded-2xl bg-white border border-amber-200/80 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-6 h-6 text-amber-500" />
                      <h2 className="text-xl font-bold text-slate-900">Tips for success</h2>
                    </div>
                    <ul className="space-y-4">
                      {course.tips.map((tip, i) => (
                        <li key={i} className="border-l-4 border-amber-400 pl-4">
                          <h3 className="font-semibold text-slate-900">{tip.title}</h3>
                          {tip.body && (
                            <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap">{tip.body}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'videos' && showVideosNav && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-slate-900">Video lessons</h2>
                {videos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center space-y-3">
                    <PlayCircle className="w-12 h-12 text-slate-400 mx-auto" />
                    <p className="text-slate-700 font-medium">No uploaded video files for this course yet.</p>
                    <p className="text-slate-600 text-sm max-w-lg mx-auto">
                      The <strong>animated walkthrough</strong> (slide scenes with auto-advance) lives under{' '}
                      <strong>Lessons</strong> — it does not require uploads here.
                    </p>
                    {pages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveSection('readings')}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                      >
                        Go to Lessons
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  videos.map((v, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <div className="aspect-video bg-black">
                        <video
                          src={v.url}
                          controls
                          className="w-full h-full"
                          playsInline
                          preload="metadata"
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                      {v.caption && (
                        <div className="px-4 py-3 bg-slate-50 text-sm text-slate-600 border-t border-slate-100">
                          {v.caption}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSection === 'readings' && pages.length > 0 && currentPage && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Step-by-step lessons
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Each lesson starts with an <strong>animated walkthrough</strong> (gradient scenes, play/pause
                      auto-advance, prev/next) when slides exist — then notes, practice, and optional quiz.
                    </p>
                  </div>
                  <div className="text-sm font-medium text-indigo-700 tabular-nums">
                    Lesson {lessonSafe + 1} of {pages.length}
                  </div>
                </div>

                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-[width] duration-300 ease-out"
                    style={{ width: `${lessonProgress}%` }}
                  />
                </div>

                <article
                  className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/90 shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-200/60"
                  id={`page-${lessonSafe}`}
                >
                  <div className="relative px-6 md:px-10 pt-8 pb-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
                    <div className="relative flex flex-wrap items-start gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-lg font-bold ring-1 ring-white/30">
                        {lessonSafe + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100/90 mb-1">
                          Current lesson
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold leading-snug">{currentPage.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-10 space-y-8">
                    {(currentPage.slides || []).length > 0 && (
                      <LessonAnimatedPlayer
                        slides={currentPage.slides}
                        resetKey={`${course._id}-${lessonSafe}`}
                        lessonIndex={lessonSafe}
                      />
                    )}

                    {!(currentPage.slides || []).length && currentPage.videoUrl && (
                      <section className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-indigo-700" />
                          Video walkthrough
                        </h4>
                        <VideoEmbed
                          url={currentPage.videoUrl}
                          caption={currentPage.videoCaption}
                          title={currentPage.title}
                        />
                      </section>
                    )}

                    {currentPage.deepDive && String(currentPage.deepDive).trim() && (
                      <section className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                          Deep dive — detailed explanation
                        </h4>
                        <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap rounded-2xl bg-indigo-50/60 border border-indigo-100 px-5 py-6 text-sm leading-relaxed">
                          {currentPage.deepDive}
                        </div>
                      </section>
                    )}

                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Notes &amp; examples
                      </h4>
                      <div className="prose prose-slate prose-p:leading-relaxed max-w-none text-slate-700 whitespace-pre-wrap rounded-2xl bg-white/80 border border-slate-100 px-5 py-6">
                        {currentPage.body}
                      </div>
                    </section>

                    {(currentPage.lessonTips || []).length > 0 && (
                      <section className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Lesson tips
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm bg-amber-50/50 border border-amber-100 rounded-xl px-5 py-4">
                          {(currentPage.lessonTips || []).map((tip, ti) => (
                            <li key={ti}>{tip}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {(currentPage.practices || []).length > 0 && (
                      <section className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                          Hands-on practice
                        </h4>
                        {(currentPage.practices || []).map((pr, pidx) => (
                          <CodePracticePanel
                            key={`${lessonSafe}-${pidx}`}
                            practice={pr}
                            pageIndex={lessonSafe}
                            practiceIndex={pidx}
                          />
                        ))}
                      </section>
                    )}

                    {currentPage.assessment &&
                      currentPage.assessment.questions &&
                      currentPage.assessment.questions.length > 0 && (
                        <LessonQuiz
                          assessment={currentPage.assessment}
                          storageKey={`${course._id}-${lessonSafe}`}
                        />
                      )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 md:px-10 py-6 bg-slate-100/80 border-t border-slate-200">
                    <button
                      type="button"
                      disabled={lessonSafe <= 0}
                      onClick={() => setLessonIndex((i) => Math.max(0, i - 1))}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous lesson
                    </button>
                    <button
                      type="button"
                      disabled={lessonSafe >= pages.length - 1}
                      onClick={() => setLessonIndex((i) => Math.min(pages.length - 1, i + 1))}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                    >
                      Next lesson
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              </div>
            )}

            {activeSection === 'gallery' && images.length > 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setGalleryIndex(i);
                        setGalleryOpen(true);
                      }}
                      className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200 hover:ring-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'discussion' && (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Discussion</h2>
                <CommentSection contentType="course" contentId={course._id} />
              </div>
            )}
          </main>
        </div>
      </div>

      <ImageGallery
        images={images}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        startIndex={galleryIndex}
      />
    </div>
  );
};

export default CourseDetail;
