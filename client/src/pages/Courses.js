import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, BookOpen, PlayCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CATEGORY_LABELS = {
  stem: 'STEM',
  languages: 'Languages',
  arts: 'Arts',
  business: 'Business',
  technology: 'Technology',
  general: 'General'
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: 12 });
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      const response = await api.get(`/courses?${params}`);
      setCourses(response.data.courses || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, category]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100 ring-1 ring-white/20 mb-6">
                <GraduationCap className="w-4 h-4" />
                DafiTech Super Academy
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Learn at your own pace
              </h1>
              <p className="text-lg text-indigo-100/90 max-w-2xl leading-relaxed">
                Video lessons, readings, and structured pages curated by our team. Browse everything here;
                open a course to watch, read, and discuss with the community.
              </p>
              {!user && (
                <p className="mt-4 text-sm text-indigo-200/95 max-w-2xl">
                  <Link
                    to="/login"
                    className="font-semibold text-white underline decoration-white/60 underline-offset-2 hover:decoration-white"
                  >
                    Sign in
                  </Link>{' '}
                  to access full course content after you choose a course.
                </p>
              )}
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-6 py-3 font-semibold shadow-lg hover:bg-indigo-50 transition-colors shrink-0"
              >
                Manage courses
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            >
              <option value="">All subjects</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => {
                  const cover =
                    course.coverImage ||
                    (course.images && course.images[0]?.url) ||
                    null;
                  const videoCount = course.videos?.length || 0;
                  const pageCount = course.pages?.length || 0;
                  return (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="group flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-100">
                        {cover ? (
                          <img
                            src={cover}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="w-16 h-16 text-indigo-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                            {CATEGORY_LABELS[course.category] || course.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          {videoCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/75 text-white text-xs px-2 py-1">
                              <PlayCircle className="w-3.5 h-3.5" />
                              {videoCount}
                            </span>
                          )}
                          {pageCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/75 text-white text-xs px-2 py-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {pageCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                          {course.title}
                        </h2>
                        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                          {(() => {
                            const plain = (course.description || '').replace(/<[^>]+>/g, '');
                            const text = course.summary || plain.slice(0, 200);
                            return text || 'Open for lessons and materials.';
                          })()}
                        </p>
                        <span className="inline-flex items-center text-indigo-600 font-semibold text-sm">
                          Open course
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-white"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
              <GraduationCap className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm || category
                  ? 'Try different filters or clear your search.'
                  : 'New lessons will appear here when administrators publish courses.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
