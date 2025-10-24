import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import api from '../utils/api';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    featured: ''
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.featured) params.append('featured', filters.featured);

      const response = await api.get(`/news?${params.toString()}`);
      setNews(response.data.news);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters.category, filters.featured]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50">
      {/* Header Section */}
      <div className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-400/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-red-400/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-amber-400">News</span> & Stories
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, stories, and updates from our global Tigray community.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="news">News</option>
                <option value="events">Events</option>
                <option value="community">Community</option>
                <option value="culture">Culture</option>
                <option value="announcements">Announcements</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div className="lg:w-48">
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Articles</option>
                <option value="true">Featured Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <article key={article._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-amber-500/20 via-red-500/20 to-green-500/20 flex items-center justify-center relative overflow-hidden">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 font-medium">News Article</p>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Article Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="mr-4">{article.author?.name || 'Admin'}</span>
                    <Calendar className="w-4 h-4 mr-2 text-red-500" />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>

                  {/* Article Excerpt */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt || article.content.substring(0, 150) + '...'}
                  </p>

                  {/* Reaction Buttons */}
                  <div className="mb-4">
                    <ReactionButtons
                      contentType="news"
                      contentId={article._id}
                      initialLikes={article.likes?.length || 0}
                      initialDislikes={article.dislikes?.length || 0}
                      initialViews={article.views || 0}
                    />
                  </div>

                  {/* Read More Button */}
                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center group">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No News Articles Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.category || filters.featured 
                ? 'Try adjusting your search or filters to find more articles.'
                : 'Check back soon for the latest news and updates from our community.'
              }
            </p>
            {(searchTerm || filters.category || filters.featured) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ category: '', featured: '' });
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Comments Section for Featured Articles */}
        {news.length > 0 && news.some(article => article.featured) && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Community Discussion
            </h2>
            <div className="max-w-4xl mx-auto">
              <CommentSection
                contentType="news"
                contentId={news.find(article => article.featured)?._id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

