import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  PlayCircle,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';
import ImageGallery from '../components/ImageGallery';

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
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
  const images = course.images || [];
  const unpublished = !course.isPublished;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    ...(videos.length
      ? [{ id: 'videos', label: `Videos (${videos.length})`, icon: PlayCircle }]
      : []),
    ...(pages.length
      ? [{ id: 'readings', label: `Reading (${pages.length})`, icon: GraduationCap }]
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
              <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About this course</h2>
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap"
                >
                  {course.description}
                </div>
              </div>
            )}

            {activeSection === 'videos' && videos.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-slate-900">Video lessons</h2>
                {videos.map((v, idx) => (
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
                ))}
              </div>
            )}

            {activeSection === 'readings' && pages.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-slate-900">Reading materials</h2>
                {pages.map((page, idx) => (
                  <article
                    key={idx}
                    className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm scroll-mt-24"
                    id={`page-${idx}`}
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 text-sm font-bold">
                        {idx + 1}
                      </span>
                      {page.title}
                    </h3>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {page.body}
                    </div>
                  </article>
                ))}
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
