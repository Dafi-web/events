import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Newspaper, Users, Heart, MapPin, Clock, ArrowRight, Globe, Users2, Lightbulb, Building2, BookOpen, Zap, Code, Award, TrendingUp, Star, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

const Home = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBusinesses: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, newsRes, directoryRes, tutorialsRes] = await Promise.all([
          api.get('/events?limit=4'),
          api.get('/news?limit=4&featured=true'),
          api.get('/directory?limit=1'),
          api.get('/tutorials/enrollments?limit=1')
        ]);
        setEvents(eventsRes.data.events || []);
        setNews(newsRes.data.news || []);
        
        // Set basic stats (in a real app, you'd have a dedicated stats endpoint)
        setStats({
          totalUsers: 1250, // This would come from an API
          totalEvents: eventsRes.data.total || 0,
          totalBusinesses: directoryRes.data.total || 0,
          totalCourses: tutorialsRes.data.total || 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default stats even if API fails
        setStats({
          totalUsers: 1250,
          totalEvents: 0,
          totalBusinesses: 0,
          totalCourses: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl animate-fade-in-up">
            <span className="text-blue-800 animate-color-shift hover:text-blue-600 transition-colors duration-300" style={{animationDelay: '0.5s'}}>Dafi</span><span className="text-orange-500 animate-color-shift-orange hover:text-orange-400 transition-colors duration-300" style={{animationDelay: '0.7s'}}>Tech</span><br />
            <span className="text-purple-300 animate-pulse" style={{animationDelay: '1s'}}>Business</span> • <span className="text-indigo-300 animate-pulse" style={{animationDelay: '1.2s'}}>Events</span> • <span className="text-cyan-300 animate-pulse" style={{animationDelay: '1.4s'}}>Learning</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-300 drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            የኢትዮጵያ የቴክኖሎጂ እና ትምህርት ማዕከል
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-100 mb-4 max-w-4xl mx-auto drop-shadow-lg leading-relaxed animate-fade-in-up" style={{animationDelay: '1.2s'}}>
            Your comprehensive platform for business growth, community events, and professional development. 
            Connect, learn, and succeed in today's digital world.
          </p>
          
          <p className="text-lg md:text-xl text-yellow-100 mb-12 max-w-4xl mx-auto drop-shadow-lg leading-relaxed animate-fade-in-up" style={{animationDelay: '1.6s'}}>
            ለንግድ እድገት፣ የማህበረሰብ ዝግጅቶች እና የሙያዊ ልማት የሚያገለግል የተሟላ መድረክ። 
            በዛሬው ዲጂታል ዓለም ውስጥ ይገናኙ፣ ይማሩ እና ይሳካሉ።
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in-up" style={{animationDelay: '2s'}}>
            <Link
              to="/join"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 animate-pulse hover:animate-none"
            >
              Join Our Community
              <div className="text-sm font-normal mt-1">ማህበረሰባችንን ይቀላቀሉ</div>
            </Link>
            <Link
              to="/tutorials"
              className="border-2 border-white text-white px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm bg-white/10 hover:scale-105 animate-pulse hover:animate-none"
              style={{animationDelay: '0.5s'}}
            >
              Start Learning
              <div className="text-sm font-normal mt-1">ትምህርት ይጀምሩ</div>
            </Link>
          </div>

          {/* Platform Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up" style={{animationDelay: '2.4s'}}>
              <Building2 className="w-8 h-8 text-blue-300 mx-auto mb-3 animate-bounce" style={{animationDelay: '3s'}} />
              <h3 className="text-lg font-semibold text-white mb-2">Business Directory</h3>
              <p className="text-gray-200 text-sm mb-2">List your business and connect with customers</p>
              <p className="text-yellow-200 text-xs">ንግድዎን ይዝግጁ እና ከደንበኞች ጋር ይገናኙ</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up" style={{animationDelay: '2.8s'}}>
              <Calendar className="w-8 h-8 text-purple-300 mx-auto mb-3 animate-bounce" style={{animationDelay: '3.2s'}} />
              <h3 className="text-lg font-semibold text-white mb-2">Events & Networking</h3>
              <p className="text-gray-200 text-sm mb-2">Discover and host professional events</p>
              <p className="text-yellow-200 text-xs">የሙያዊ ዝግጅቶችን ይፈልጉ እና ያደርጉ</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up" style={{animationDelay: '3.2s'}}>
              <BookOpen className="w-8 h-8 text-indigo-300 mx-auto mb-3 animate-bounce" style={{animationDelay: '3.4s'}} />
              <h3 className="text-lg font-semibold text-white mb-2">Online Learning</h3>
              <p className="text-gray-200 text-sm mb-2">Master new skills with expert courses</p>
              <p className="text-yellow-200 text-xs">ከሙያዊ ኮርሶች ጋር አዲስ ክህሎቶችን ይማሩ</p>
            </div>
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
              Join thousands of professionals worldwide who are building their future with DafiTech
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers.toLocaleString()}+</div>
              <div className="text-primary-100">Active Members</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalEvents}+</div>
              <div className="text-primary-100">Events Hosted</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalBusinesses}+</div>
              <div className="text-primary-100">Businesses Listed</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalCourses}+</div>
              <div className="text-primary-100">Courses Available</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-blue-800 animate-color-shift hover:text-blue-600 transition-colors duration-300" style={{animationDelay: '0.5s'}}>Dafi</span><span className="text-orange-500 animate-color-shift-orange hover:text-orange-400 transition-colors duration-300" style={{animationDelay: '0.7s'}}>Tech</span> — Your Digital Success Platform
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              የኢትዮጵያ የዲጂታል ስኬት መድረክ
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              From business growth to skill development, DafiTech provides everything you need to thrive 
              in today's competitive digital landscape.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              ከንግድ እድገት እስከ ክህሎት ልማት፣ DafiTech በዛሬው ውድድር የሚተላለፍ ዲጂታል አካባቢ ውስጥ 
              ለማደግ የሚያስፈልግዎትን ሁሉ ይሰጣል።
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Business Directory */}
            <div className="relative group animate-fade-in-up" style={{animationDelay: '1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce" style={{animationDelay: '1.5s'}}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Business Directory</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-4 text-center">የንግድ ማውጫ</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3">
                  Showcase your business to a global audience. List your services, connect with customers, 
                  and grow your network with our comprehensive business directory platform.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  ንግድዎን ለአለም አቀፍ ሰዎች ያሳዩ። አገልግሎቶችዎን ይዝግጁ፣ ከደንበኞች ጋር ይገናኙ 
                  እና በሰፊው የንግድ ማውጫ መድረካችን አውታረድዎን ያሳድጉ።
                </p>
              </div>
            </div>

            {/* Events & Networking */}
            <div className="relative group animate-fade-in-up" style={{animationDelay: '1.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce" style={{animationDelay: '1.7s'}}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Events & Networking</h3>
                <h4 className="text-lg font-semibold text-purple-600 mb-4 text-center">ዝግጅቶች እና አውታረድ</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3">
                  Discover professional events, workshops, and networking opportunities. Host your own events 
                  and connect with like-minded professionals in your industry.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  የሙያዊ ዝግጅቶች፣ ስልጠናዎች እና የአውታረድ እድሎችን ይፈልጉ። የራስዎን ዝግጅቶች ያደርጉ 
                  እና በሙያዎ ውስጥ ከተመሳሳይ አስተሳሰብ ያላቸው ሙያዊዎች ጋር ይገናኙ።
                </p>
              </div>
            </div>

            {/* Online Learning */}
            <div className="relative group animate-fade-in-up" style={{animationDelay: '1.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 rounded-2xl transform group-hover:scale-105 transition-all duration-300 animate-pulse" style={{animationDelay: '1.5s'}}></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce" style={{animationDelay: '1.9s'}}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Online Learning</h3>
                <h4 className="text-lg font-semibold text-indigo-600 mb-4 text-center">የመስመር ላይ ትምህርት</h4>
                <p className="text-gray-700 leading-relaxed text-center mb-3">
                  Master new skills with our comprehensive course offerings. From technical skills to business 
                  development, advance your career with expert-led learning programs.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  በሰፊው የኮርስ አቅርቦቻችን አዲስ ክህሎቶችን ይማሩ። ከቴክኒካል ክህሎቶች እስከ ንግድ ልማት፣ 
                  በሙያዊ የሚመሩ የትምህርት ፕሮግራሞች ሙያዎን ያሳድጉ።
                </p>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Businesses Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Learning Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
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
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="text-blue-400">Upcoming</span> Events
              </h2>
              <p className="text-xl text-gray-300">Join our professional networking and learning events</p>
            </div>
            <Link
              to="/events"
              className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Events <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event) => (
                <div key={event._id} className="group bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  {(() => {
                    const imageUrl = event.image || (event.images && event.images.length > 0 ? event.images[0].url : null);
                    const isPlaceholder = imageUrl && imageUrl.includes('via.placeholder.com');
                    
                    return (
                      <div className="h-48 relative overflow-hidden">
                        {!imageUrl || isPlaceholder ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-white" />
                          </div>
                        ) : (
                          <img
                            src={imageUrl}
                            alt={event.title}
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
                          <Calendar className="w-12 h-12 text-white" />
                        </div>
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold capitalize border border-white/30">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-300 mb-3">
                      <Clock className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300 mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="text-sm">{event.location.name}</span>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center transition-colors"
                    >
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-gray-300 text-xl mb-2">No upcoming events at the moment.</p>
              <p className="text-gray-400">Check back soon for new events!</p>
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
              <p className="text-xl text-gray-700">Stay updated with industry insights and platform news</p>
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
              Master new skills with our comprehensive course offerings. From technical development 
              to business growth, advance your career with expert-led programs.
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
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">$150/month</span>
              </div>
            </div>

            {/* English */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">English</h3>
              <p className="text-gray-700 text-center mb-4">Grade 5-12 curriculum</p>
              <div className="text-center">
                <span className="text-2xl font-bold text-green-600">$150/month</span>
              </div>
            </div>

            {/* MERN Stack */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">MERN Stack</h3>
              <p className="text-gray-700 text-center mb-4">Full-stack web development</p>
              <div className="text-center">
                <span className="text-2xl font-bold text-purple-600">$250/month</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/tutorials"
              className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Courses <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <span className="text-blue-400">Join</span> <span className="text-blue-800 animate-color-shift hover:text-blue-600 transition-colors duration-300" style={{animationDelay: '0.5s'}}>Dafi</span><span className="text-orange-500 animate-color-shift-orange hover:text-orange-400 transition-colors duration-300" style={{animationDelay: '0.7s'}}>Tech</span> Today
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            ዛሬ DafiTech ይቀላቀሉ
          </h3>
          <p className="text-xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            Connect with professionals, grow your business, and advance your career. 
            Join thousands of users who are already succeeding with DafiTech.
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            ከሙያዊዎች ጋር ይገናኙ፣ ንግድዎን ያሳድጉ እና ሙያዎን ያሳድጉ። 
            በ DafiTech እየሳኩ ያሉ በሺዎች የሚቆጠሩ ተጠቃሚዎች ይቀላቀሉ።
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              to="/join"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{animationDelay: '1.5s'}}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">Join the Community</h3>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">ማህበረሰቡን ይቀላቀሉ</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Connect with professionals and become part of our growing community of entrepreneurs and learners.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                ከሙያዊዎች ጋር ይገናኙ እና እየተሳደገ ያለው የተገቢያ ሰዎች እና ተማሪዎች ማህበረሰባችን አካል ይሁኑ።
              </p>
            </Link>
            
            <Link
              to="/directory"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1.2s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{animationDelay: '1.7s'}}>
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">List Your Business</h3>
              <h4 className="text-lg font-semibold mb-4 text-purple-200">ንግድዎን ይዝግጁ</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Showcase your business to a global audience and connect with potential customers and partners.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                ንግድዎን ለአለም አቀፍ ሰዎች ያሳዩ እና ከሚሆኑ ደንበኞች እና አጋሮች ጋር ይገናኙ።
              </p>
            </Link>
            
            <Link
              to="/tutorials"
              className="group bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: '1.4s'}}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{animationDelay: '1.9s'}}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">Start Learning</h3>
              <h4 className="text-lg font-semibold mb-4 text-indigo-200">ትምህርት ይጀምሩ</h4>
              <p className="text-gray-300 leading-relaxed mb-2">
                Master new skills with our comprehensive course offerings and advance your career.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                በሰፊው የኮርስ አቅርቦቻችን አዲስ ክህሎቶችን ይማሩ እና ሙያዎን ያሳድጉ።
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;