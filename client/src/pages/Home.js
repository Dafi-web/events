import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Users, ArrowRight, BookOpen, Zap, Code, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import MotivationalSlider from '../components/MotivationalSlider';

const Home = () => {
  const { t } = useLanguage();
  const [catalogCourses, setCatalogCourses] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchoolCourses: 0,
    totalTutorialEnrollments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, newsRes, tutorialsRes] = await Promise.all([
          api.get('/courses?limit=4'),
          api.get('/news?limit=4&featured=true'),
          api.get('/tutorials/enrollments?limit=1')
        ]);
        setCatalogCourses(coursesRes.data.courses || []);
        setNews(newsRes.data.news || []);

        const tutorialList = tutorialsRes.data.enrollments || tutorialsRes.data || [];
        const tutorialTotal =
          tutorialsRes.data.total ??
          (Array.isArray(tutorialList) ? tutorialList.length : 0);

        setStats({
          totalUsers: 1250,
          totalSchoolCourses: coursesRes.data.total || 0,
          totalTutorialEnrollments: tutorialTotal
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default stats even if API fails
        setStats({
          totalUsers: 1250,
          totalSchoolCourses: 0,
          totalTutorialEnrollments: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-purple-900/75 to-indigo-900/85"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Animated Tech Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-200/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-purple-200/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-indigo-300/20 to-transparent rounded-full blur-3xl animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-300/20 to-transparent rounded-full blur-3xl animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2.2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '2.8s'}}></div>
        </div>

        {/* Content — extra top padding clears sticky navbar + logo */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-32 md:pb-28 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl animate-fade-in-up leading-tight">
            <span className="text-blue-200">DafiTech</span>{' '}
            <span className="text-orange-300">Super Academy</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-indigo-100 mb-6 md:mb-8 max-w-3xl mx-auto">
            <span className="text-purple-200">Academy</span>
            <span className="text-white/80 mx-2">·</span>
            <span className="text-indigo-200">Courses</span>
            <span className="text-white/80 mx-2">·</span>
            <span className="text-cyan-200">Tutors</span>
          </p>

          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-yellow-300 drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            የመስመር ላይ ትምህርት ቤት እና አስተማሪዎች
          </h2>

          <p className="text-lg md:text-xl text-gray-100 mb-4 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Learn online with structured courses, video lessons, readings, and tutor-led programs—all in one place.
          </p>

          <p className="text-base md:text-lg text-yellow-100/95 mb-10 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            በኮርሶች፣ በቪዲዮ እና በአስተማሪ የሚመራ ትምህርት። ከየትኛውም ቦታ ይማሩ።
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-14 animate-fade-in-up" style={{animationDelay: '2s'}}>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Browse courses
              <div className="text-sm font-normal mt-1 opacity-90">ኮርሶችን ይመልከቱ</div>
            </Link>
            <Link
              to="/tutorials"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm bg-white/10"
            >
              Tutors &amp; enrollment
              <div className="text-sm font-normal mt-1 opacity-90">አስተማሪዎች እና ምዝገባ</div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4">
            <Link
              to="/courses"
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left md:text-center block"
            >
              <GraduationCap className="w-8 h-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Course catalog</h3>
              <p className="text-gray-200 text-sm">Videos, readings, and lesson pages from our academy.</p>
            </Link>
            <Link
              to="/tutorials"
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left md:text-center block"
            >
              <BookOpen className="w-8 h-8 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Tutors &amp; programs</h3>
              <p className="text-gray-200 text-sm">Apply for subjects and tracks that match your goals.</p>
            </Link>
            <Link
              to="/join"
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-left md:text-center block"
            >
              <Users className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Join the academy</h3>
              <p className="text-gray-200 text-sm">Create an account to save progress and join discussions.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('welcomeTitle')} - Global Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Online courses, academy materials, and tutor programs—built for learners everywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers.toLocaleString()}+</div>
              <div className="text-primary-100">Learners</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalSchoolCourses}+</div>
              <div className="text-primary-100">Academy courses</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalTutorialEnrollments}+</div>
              <div className="text-primary-100">Tutor enrollments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-indigo-50/90"></div>
        </div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-purple-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-indigo-400 to-transparent rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Zap className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-blue-800">DafiTech</span>{' '}
              <span className="text-orange-500">Super Academy</span>
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-700 mb-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              የመስመር ላይ ትምህርት እና አስተማሪዎች
            </h3>
            <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              Study with structured courses, lesson videos, readings, and tutor-led tracks—everything we publish is meant for real online learning.
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              ኮርሶች፣ ቪዲዮ፣ ማንበብ እና አስተማሪ-የሚመሩ ፕሮግራሞች በአንድ መድረክ።
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="relative group animate-fade-in-up" style={{animationDelay: '1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Academy courses</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-4 text-center">የአካዳሚ ኮርሶች</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3 flex-1">
                  Browse published courses with videos, images, and reading pages. Learn at your pace and review materials anytime.
                </p>
                <Link to="/courses" className="text-blue-600 font-semibold text-center hover:text-blue-800 mt-2">
                  Open catalog →
                </Link>
              </div>
            </div>

            <div className="relative group animate-fade-in-up" style={{animationDelay: '1.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Tutors &amp; tracks</h3>
                <h4 className="text-lg font-semibold text-purple-600 mb-4 text-center">አስተማሪዎች እና ፕሮግራሞች</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3 flex-1">
                  Apply for subject-specific tutoring and structured programs. Enrollment is managed through the tutorials section.
                </p>
                <Link to="/tutorials" className="text-purple-600 font-semibold text-center hover:text-purple-800 mt-2">
                  View tutors →
                </Link>
              </div>
            </div>

            <div className="relative group animate-fade-in-up" style={{animationDelay: '1.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Community &amp; news</h3>
                <h4 className="text-lg font-semibold text-indigo-600 mb-4 text-center">ዜና እና ማህበረሰብ</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3 flex-1">
                  Stay updated on announcements and join discussions. Register to participate in comments and course Q&amp;A.
                </p>
                <Link to="/news" className="text-indigo-600 font-semibold text-center hover:text-indigo-800 mt-2">
                  Latest news →
                </Link>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Study hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Learning modules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">24/7</div>
              <div className="text-gray-600">Access online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-400/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-purple-400/20 to-transparent"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-radial from-indigo-400/10 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="text-blue-400">Featured</span> courses
              </h2>
              <p className="text-xl text-gray-300">Video lessons and readings from our online school</p>
            </div>
            <Link
              to="/courses"
              className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse all courses <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : catalogCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {catalogCourses.map((course) => (
                <div key={course._id} className="group bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  {(() => {
                    const imageUrl =
                      course.coverImage ||
                      (course.images && course.images.length > 0 ? course.images[0].url : null);
                    const isPlaceholder = imageUrl && imageUrl.includes('via.placeholder.com');

                    return (
                      <div className="h-48 relative overflow-hidden">
                        {!imageUrl || isPlaceholder ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white" />
                          </div>
                        ) : (
                          <img
                            src={imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentNode.querySelector('.image-fallback');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        )}
                        <div
                          className="hidden image-fallback w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 items-center justify-center"
                          style={{ display: 'none' }}
                        >
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold capitalize border border-white/30">
                            {course.category}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {course.summary ||
                        `${(course.description || '').replace(/<[^>]+>/g, '').slice(0, 120)}${
                          (course.description || '').length > 120 ? '…' : ''
                        }`}
                    </p>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center transition-colors"
                    >
                      Open course <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-gray-300 text-xl mb-2">No published courses yet.</p>
              <p className="text-gray-400">Check back soon for new lessons.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="text-purple-600">Latest</span> News
              </h2>
              <p className="text-xl text-gray-700">Announcements and updates from the academy</p>
            </div>
            <Link
              to="/news"
              className="flex items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All News <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {news.map((article) => (
                <article key={article._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                  {article.image ? (
                    <div className="h-48 bg-cover bg-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url(${article.image})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-purple-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-purple-700/20 flex items-center justify-center relative">
                      <Newspaper className="w-12 h-12 text-purple-600" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-purple-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </p>
                    <Link
                      to={`/news/${article._id}`}
                      className="text-purple-600 hover:text-purple-700 font-semibold flex items-center transition-colors"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-purple-500" />
              </div>
              <p className="text-gray-700 text-xl mb-2">No news articles at the moment.</p>
              <p className="text-gray-600">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Learning Courses Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-400 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-blue-400 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <BookOpen className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-indigo-600">Learning</span> Courses
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Subject areas from math and language to coding—explore the catalog and enroll in tutor-led tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mathematics */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Mathematics</h3>
              <p className="text-gray-700 text-center mb-4">Grade 5-12 curriculum</p>
            </div>

            {/* English */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">English</h3>
              <p className="text-gray-700 text-center mb-4">Grade 5-12 curriculum</p>
            </div>

            {/* MERN Stack */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">MERN Stack</h3>
              <p className="text-gray-700 text-center mb-4">Full-stack web development</p>
            </div>
          </div>

          <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/courses"
              className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore the course catalog <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/tutorials"
              className="inline-flex items-center border-2 border-indigo-600 text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300"
            >
              Tutor programs <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-blue-600">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Educators and leaders behind DafiTech Super Academy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Dawit - Founder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="https://github.com/Dafi-web/assets2/blob/main/GHuicPpQYTezyvgYZJjlOSXuf0y%20(1).jpg?raw=true" 
                  alt="Dawit Abrha - Founder & CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dawit Abrha</h3>
              <p className="text-blue-600 font-semibold mb-4">Founder & CEO</p>
              <p className="text-gray-600 leading-relaxed">
                M.Sc. in Electrical & Computer Engineering, MERN Full Stack Expert. 
                University lecturer and entrepreneur passionate about technology and business growth. 
                Founder of DafiTech with a vision to connect the Ethiopian diaspora through technology.
              </p>
            </div>
            
            {/* Fikadu - Program Manager */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="https://github.com/Dafi-web/assets2/blob/main/-6003655202638514825_119.jpg?raw=true" 
                  alt="Fikadu Shewit - Program Manager" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fikadu Shewit</h3>
              <p className="text-orange-600 font-semibold mb-4">Program Manager & Telecommunications Engineer</p>
              <p className="text-gray-600 leading-relaxed">
                Telecommunications Engineer with extensive experience in lecturing and advising student projects. 
                University lecturer with expertise in program development and educational management, passionate about connecting people through technology and education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Messages Slider */}
      <MotivationalSlider />

      {/* Get Involved Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90"></div>
        </div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-purple-400/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-indigo-400/20 to-transparent rounded-full blur-3xl animate-ping" style={{animationDuration: '5s'}}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-6 h-6 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-30 w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2.5s'}}></div>
          <div className="absolute bottom-40 left-30 w-5 h-5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.8s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <span className="text-blue-400">Start learning</span> with DafiTech Super Academy
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-yellow-400 mb-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            ዛሬ ትምህርት ለመጀመር ይመዝገቡ
          </h3>
          <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            Open courses, apply for tutors, and join the community—everything you need for online school is here.
          </p>
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            ኮርሶችን ይመልከቱ፣ አስተማሪ ይጠይቁ እና በማህበረሰባችን ይቀላቀሉ።
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              to="/courses"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">Browse courses</h3>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">ኮርሶች</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Video lessons, readings, and materials from our academy catalog.
              </p>
            </Link>
            
            <Link
              to="/tutorials"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1.2s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">Tutors &amp; enrollment</h3>
              <h4 className="text-lg font-semibold mb-4 text-purple-200">አስተማሪዎች</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Apply for programs and track your enrollment with our tutors.
              </p>
            </Link>
            
            <Link
              to="/join"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1.4s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">Create your account</h3>
              <h4 className="text-lg font-semibold mb-4 text-indigo-200">መለያ ይፍጠሩ</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Register to save progress, comment on courses, and stay in touch.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;