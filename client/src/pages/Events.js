import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Search, Plus, ExternalLink, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';
import countries from '../utils/countries';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [expandedComments, setExpandedComments] = useState({});
  const { isAuthenticated, user } = useAuth();

  const categories = [
    'cultural', 'business', 'education', 'social', 'youth', 'religious'
  ];

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });
      
      if (showUpcomingOnly) params.append('upcoming', 'true');
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedCountry) params.append('country', selectedCountry);

      const response = await api.get(`/events?${params}`);
      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedCountry, showUpcomingOnly]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRSVP = async (eventId, status) => {
    if (!isAuthenticated) {
      alert('Please login to RSVP to events');
      return;
    }

    try {
      await api.post(`/events/${eventId}/rsvp`, { status });
      fetchEvents(); // Refresh events to update RSVP counts
    } catch (error) {
      console.error('RSVP error:', error);
      
      // Handle specific error messages from the server
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else {
        alert('Failed to RSVP. Please try again.');
      }
    }
  };

  const toggleComments = (eventId) => {
    setExpandedComments(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Events</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Join us at our gatherings, celebrations, and cultural events around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showUpcomingOnly}
                  onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Upcoming only</span>
              </label>

              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin">
                  <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Event
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateRows: 'none', alignItems: 'start' }}>
                {events.map((event) => (
                  <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col self-start" style={{ height: 'fit-content' }}>
                    <div className="relative h-48 overflow-hidden">
                      {(() => {
                        const imageUrl = event.image || (event.images && event.images.length > 0 ? event.images[0].url : null);
                        const isPlaceholder = imageUrl && imageUrl.includes('via.placeholder.com');
                        
                        return (
                          <>
                            {!imageUrl || isPlaceholder ? (
                              <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                <Calendar className="w-12 h-12 text-primary-600" />
                              </div>
                            ) : (
                              <img
                                src={imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                  if (event.images && event.images.length > 0) {
                                    setGalleryImages(event.images);
                                    setGalleryStartIndex(0);
                                    setShowImageGallery(true);
                                  }
                                }}
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
                              className="hidden image-fallback w-full h-full bg-primary-100 items-center justify-center"
                              style={{ display: 'none' }}
                            >
                              <Calendar className="w-12 h-12 text-primary-600" />
                            </div>
                            
                            {/* Show image count if there are multiple images */}
                            {event.images && event.images.length > 1 && (
                              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                +{event.images.length - 1} more
                              </div>
                            )}
                            
                            {/* Show video indicator if there are videos */}
                            {event.videos && event.videos.length > 0 && (
                              <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center">
                                <span>🎥</span>
                                <span className="ml-1">{event.videos.length} video{event.videos.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full">
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                        {/* Event Status Badge */}
                        {(() => {
                          const now = new Date();
                          const eventDate = new Date(event.date);
                          const isEventActive = event.isActive && eventDate >= now;
                          
                          return (
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              isEventActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isEventActive ? '🟢 Active' : '🔴 Expired'}
                            </span>
                          );
                        })()}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">{formatTime(event.time)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{event.location.name}</span>
                        </div>
                        {event.attendees && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {event.attendees.filter(a => a.status === 'going').length} attending
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Pricing Information */}
                      {!event.isFree && event.pricing && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">Event Pricing</span>
                            <span className="text-xs text-blue-700">
                              From ${Math.min(
                                event.pricing.general?.amount || 0,
                                event.pricing.student?.amount || 0,
                                event.pricing.vip?.amount || 0
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            General: ${event.pricing.general?.amount || 0} • 
                            Student: ${event.pricing.student?.amount || 0} • 
                            VIP: ${event.pricing.vip?.amount || 0}
                          </div>
                        </div>
                      )}
                      
                      {event.isFree && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-sm font-medium text-green-800">🆓 Free Event</span>
                        </div>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      {/* Reaction Buttons */}
                      <div className="mb-4">
                        <ReactionButtons
                          contentType="event"
                          contentId={event._id}
                          initialLikes={event.likes?.length || 0}
                          initialDislikes={event.dislikes?.length || 0}
                          initialViews={event.views || 0}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Link
                            to={`/events/${event._id}`}
                            className="flex-1 flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold py-2"
                          >
                            View Details <ExternalLink className="w-4 h-4 ml-1" />
                          </Link>
                          <button
                            onClick={() => toggleComments(event._id)}
                            className="px-3 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors"
                            title={`View comments for "${event.title}"`}
                          >
                            💬 {expandedComments[event._id] ? 'Hide Comments' : 'Show Comments'}
                          </button>
                        </div>
                        
                        {(() => {
                          const now = new Date();
                          const eventDate = new Date(event.date);
                          const isEventActive = event.isActive && eventDate >= now;
                          
                          if (!isAuthenticated) {
                            return (
                              <div className="text-center py-2">
                                <p className="text-sm text-gray-500">Please login to RSVP</p>
                              </div>
                            );
                          }
                          
                          if (!isEventActive) {
                            return (
                              <div className="text-center py-2">
                                <p className="text-sm text-red-600 font-medium">
                                  {eventDate < now ? 'Event has ended' : 'Event is no longer active'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">RSVP not available</p>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRSVP(event._id, 'going')}
                                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded text-sm hover:bg-primary-700 transition-colors"
                              >
                                RSVP Going
                              </button>
                              <button
                                onClick={() => handleRSVP(event._id, 'maybe')}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded text-sm hover:bg-gray-700 transition-colors"
                              >
                                Maybe
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                      
                      {/* Individual Comment Section for this event */}
                      {expandedComments[event._id] && (
                        <div className="mt-4 border-t border-gray-200 pt-4 flex-shrink-0">
                          <CommentSection
                            key={`comments-${event._id}`}
                            contentType="event"
                            contentId={event._id}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory || selectedCountry
                  ? 'Try adjusting your search criteria'
                  : 'Check back soon for upcoming events!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={galleryImages}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        startIndex={galleryStartIndex}
      />

    </div>
  );
};

export default Events;

