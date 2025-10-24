import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PaymentModal from '../components/PaymentModal';
import ImageGallery from '../components/ImageGallery';
import CommentSection from '../components/CommentSection';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      
      // Check if user has already RSVP'd
      if (isAuthenticated && response.data.attendees) {
        const userRsvp = response.data.attendees.find(
          attendee => attendee.user && attendee.user._id === user.id
        );
        if (userRsvp) {
          setRsvpStatus(userRsvp.status);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Event not found');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleRSVP = async (status) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if event data is loaded
    if (!event || !event._id) {
      setError('Event information is not loaded yet. Please wait and try again.');
      return;
    }

    // If event requires payment and user is trying to RSVP as "going", show payment modal
    if (!event.isFree && status === 'going') {
      // Check if pricing data is available
      if (!event.pricing || Object.keys(event.pricing).length === 0) {
        setError('Pricing information is not available for this event. Please contact the administrator.');
        return;
      }
      setShowPaymentModal(true);
      return;
    }

    try {
      setRsvpLoading(true);
      await api.post(`/events/${id}/rsvp`, { status });
      setRsvpStatus(status);
      
      // Refresh event data to get updated attendee count
      fetchEvent();
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setRsvpStatus('going');
    setError(''); // Clear any errors
    fetchEvent();
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setError(''); // Clear any errors when closing modal
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

  const getAttendeeCount = (status) => {
    if (!event?.attendees) return 0;
    return event.attendees.filter(a => a.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Main Image */}
          <div className="relative h-64 md:h-96">
            {(() => {
              const mainImageUrl = event.image || (event.images && event.images.length > 0 ? event.images[0].url : null);
              const isPlaceholder = mainImageUrl && mainImageUrl.includes('via.placeholder.com');
              
              if (!mainImageUrl || isPlaceholder) {
                return (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                      {isPlaceholder ? (
                        <p className="text-sm">Upload disabled - Cloudinary not configured</p>
                      ) : (
                        <p className="text-sm">No event image</p>
                      )}
                    </div>
                  </div>
                );
              }
              
              return (
                <img
                  src={mainImageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentNode.querySelector('.image-fallback');
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              );
            })()}
            <div 
              className="image-fallback w-full h-full bg-primary-100 flex items-center justify-center"
              style={{ display: 'none' }}
            >
              <Calendar className="w-16 h-16 text-primary-600" />
            </div>
            
            {/* Image Gallery Indicator */}
            {event.images && event.images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {event.images.length} photos
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary-600" />
                    <span className="font-medium">{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                    <span className="font-medium">{event.location.name}</span>
                  </div>
                </div>
              </div>

              {/* RSVP Section */}
              {isAuthenticated && (
                <div className="md:ml-8 mb-6 md:mb-0">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Will you attend?</h3>
                    
                    {/* Pricing Information */}
                    {!event.isFree && event.pricing && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <DollarSign className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-900">Event Pricing</span>
                        </div>
                        <div className="text-xs text-blue-700">
                          General: ${event.pricing.general?.amount || 0} • 
                          Student: ${event.pricing.student?.amount || 0} • 
                          VIP: ${event.pricing.vip?.amount || 0}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {['going', 'maybe', 'not going'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleRSVP(status)}
                          disabled={rsvpLoading}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                            rsvpStatus === status
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {rsvpLoading ? 'Updating...' : (
                            <>
                              {!event.isFree && status === 'going' && <CreditCard className="w-4 h-4 mr-2" />}
                              {status.replace('going', 'Going').replace('not going', "Can't Go").replace('maybe', 'Maybe')}
                              {!event.isFree && status === 'going' && <span className="ml-1 text-xs">(Pay)</span>}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Venue:</strong> {event.location.name}</p>
                  <p><strong>Country:</strong> {event.location.country}</p>
                  {event.location.address && (
                    <p><strong>Address:</strong> {event.location.address}</p>
                  )}
                  {event.location.city && (
                    <p><strong>City:</strong> {event.location.city}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Event Info</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Category:</strong> {event.category.charAt(0).toUpperCase() + event.category.slice(1)}</p>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{getAttendeeCount('going')} people going</span>
                  </div>
                  {event.maxAttendees && (
                    <p><strong>Max Attendees:</strong> {event.maxAttendees}</p>
                  )}
                  {event.organizer && (
                    <p><strong>Organizer:</strong> {event.organizer.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {event.images && event.images.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Event Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.images.map((image, index) => {
                    // Check if it's a placeholder URL
                    const isPlaceholder = image.url && image.url.includes('via.placeholder.com');
                    
                    return (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden relative">
                        {isPlaceholder ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                            <div>
                              <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                                <Calendar className="w-full h-full" />
                              </div>
                              <p>Upload disabled - Cloudinary not configured</p>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={image.url}
                            alt={`${event.title} gallery ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => {
                              setGalleryStartIndex(index);
                              setShowImageGallery(true);
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentNode.querySelector('.image-error-fallback');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        )}
                        <div 
                          className="hidden image-error-fallback w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
                          style={{ display: 'none' }}
                        >
                          <div className="text-center">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>Image not available</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Gallery */}
            {event.videos && event.videos.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Event Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.videos.map((video, index) => {
                    // Check if it's a placeholder URL
                    const isPlaceholder = video.url && video.url.includes('via.placeholder.com');
                    
                    return (
                      <div key={index} className="relative">
                        {isPlaceholder ? (
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
                                <Calendar className="w-full h-full" />
                              </div>
                              <p className="text-sm">Upload disabled - Cloudinary not configured</p>
                              <p className="text-xs mt-1">Video files are not being uploaded</p>
                            </div>
                          </div>
                        ) : (
                          <video
                            controls
                            className="w-full rounded-lg shadow-md"
                            poster={
                              video.thumbnail || 
                              (video.url.includes('cloudinary.com') ? `${video.url.replace(/\.(mp4|mov|avi|webm|mkv)$/, '.jpg')}` : undefined)
                            }
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentNode.querySelector('.video-fallback');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          >
                            {/* Handle both local and Cloudinary URLs */}
                            {video.url.startsWith('/api/files/') ? (
                              <source src={`http://localhost:4000${video.url}`} type="video/mp4" />
                            ) : (
                              <>
                                <source src={video.url} type="video/mp4" />
                                <source src={video.url} type="video/webm" />
                                <source src={video.url} type="video/mov" />
                              </>
                            )}
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <div 
                          className="hidden video-fallback w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                          style={{ display: 'none' }}
                        >
                          <div className="text-center">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>Video not available</p>
                          </div>
                        </div>
                        {video.caption && (
                          <p className="text-sm text-gray-600 mt-2">{video.caption}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Who's Going ({getAttendeeCount('going')})</h3>
                <div className="flex flex-wrap gap-2">
                  {event.attendees
                    .filter(attendee => attendee.status === 'going' && attendee.user)
                    .slice(0, 10)
                    .map((attendee, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-medium">
                          {attendee.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{attendee.user.name}</span>
                    </div>
                  ))}
                  {getAttendeeCount('going') > 10 && (
                    <span className="text-sm text-gray-500 flex items-center">
                      +{getAttendeeCount('going') - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection
            contentType="event"
            contentId={event._id}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        event={event}
        onSuccess={handlePaymentSuccess}
      />

      {/* Image Gallery Modal */}
      <ImageGallery
        images={event?.images || []}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        startIndex={galleryStartIndex}
      />
    </div>
  );
};

export default EventDetail;
