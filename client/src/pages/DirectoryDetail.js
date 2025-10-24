import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Globe, Star, Building2, User, Users, 
  Clock, ArrowLeft, ExternalLink, Share2, Heart, MessageCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';
import ImageGallery from '../components/ImageGallery';

const DirectoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/directory/${id}`);
      setListing(response.data);
      
      // Track view
      await api.post(`/directory/${id}/view`);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Failed to load directory listing');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'business': return <Building2 className="w-6 h-6" />;
      case 'professional': return <User className="w-6 h-6" />;
      case 'organization': return <Users className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'business': return 'bg-amber-100 text-amber-800';
      case 'professional': return 'bg-green-100 text-green-800';
      case 'organization': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatHours = (hours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => ({
      day: dayNames[index],
      hours: hours[day] || 'Closed'
    }));
  };

  const handleImageClick = (index) => {
    if (listing.images && listing.images.length > 0) {
      setGalleryImages(listing.images);
      setGalleryStartIndex(index);
      setShowImageGallery(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.name,
          text: listing.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading directory listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The directory listing you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/directory')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 max-w-md mx-auto">
            <Building2 className="w-16 h-16 text-amber-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Access Required</h2>
            <p className="text-gray-600 mb-6">
              This directory listing is only available to DafiTech community members.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Login to View
              </a>
              <a
                href="/register"
                className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/directory')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Directory
        </button>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Header Section */}
          <div className="relative">
            {/* Hero Image */}
            <div className="h-64 md:h-80 relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-red-500/20 to-green-500/20">
              {listing.images && listing.images.length > 0 ? (
                <img 
                  src={listing.images[0]} 
                  alt={listing.name} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
                  onClick={() => handleImageClick(0)}
                />
              ) : listing.logo ? (
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={listing.logo} 
                    alt={`${listing.name} logo`} 
                    className="w-32 h-32 object-cover rounded-full shadow-lg" 
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {listing.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              
              {/* Logo overlay if both logo and images exist */}
              {listing.logo && listing.images && listing.images.length > 0 && (
                <div className="absolute top-6 left-6">
                  <img 
                    src={listing.logo} 
                    alt={`${listing.name} logo`} 
                    className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-lg" 
                  />
                </div>
              )}
              
              {/* Image count indicator */}
              {listing.images && listing.images.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-black/70 text-white px-3 py-2 rounded-full text-sm">
                  +{listing.images.length - 1} more photos
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                title="Share this listing"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Header Info */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  {/* Type Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getTypeColor(listing.type)}`}>
                    {getTypeIcon(listing.type)}
                    {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                  </div>

                  {/* Business Name */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {listing.name}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {listing.description}
                  </p>

                  {/* Category */}
                  <div className="text-sm text-gray-500 capitalize mb-6">
                    Category: {listing.category.replace('-', ' ')}
                  </div>

                  {/* Verification Badges */}
                  <div className="flex items-center gap-4 mb-6">
                    {listing.verified && (
                      <div className="flex items-center text-green-600">
                        <Star className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Verified Business</span>
                      </div>
                    )}
                    {listing.featured && (
                      <div className="flex items-center text-amber-600">
                        <Star className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Featured Listing</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reaction Buttons */}
                <div className="flex flex-col items-center">
                  <ReactionButtons
                    contentType="directory"
                    contentId={listing._id}
                    initialLikes={listing.likes?.length || 0}
                    initialDislikes={listing.dislikes?.length || 0}
                    initialViews={listing.views || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-6 h-6 mr-3 text-amber-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.contact.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-amber-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a 
                          href={`mailto:${listing.contact.email}`}
                          className="text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {listing.contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {listing.contact.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a 
                          href={`tel:${listing.contact.phone}`}
                          className="text-gray-900 hover:text-red-600 transition-colors"
                        >
                          {listing.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {listing.contact.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={listing.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 hover:text-blue-600 transition-colors flex items-center"
                        >
                          Visit Website <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {listing.contact.address.city && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900">
                          {listing.contact.address.street && `${listing.contact.address.street}, `}
                          {listing.contact.address.city}
                          {listing.contact.address.state && `, ${listing.contact.address.state}`}
                          {listing.contact.address.country && `, ${listing.contact.address.country}`}
                          {listing.contact.address.postalCode && ` ${listing.contact.address.postalCode}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              {listing.hours && Object.values(listing.hours).some(hour => hour && hour.trim() !== '') && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-amber-600" />
                    Business Hours
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formatHours(listing.hours).map(({ day, hours }, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="font-medium text-gray-700">{day}</span>
                        <span className={`text-sm ${hours === 'Closed' ? 'text-gray-500' : 'text-gray-900'}`}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {listing.socialMedia && Object.values(listing.socialMedia).some(social => social && social.trim() !== '') && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {listing.socialMedia.instagram && (
                      <a 
                        href={listing.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <span className="font-semibold">Instagram</span>
                      </a>
                    )}
                    
                    {listing.socialMedia.linkedin && (
                      <a 
                        href={listing.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <span className="font-semibold">LinkedIn</span>
                      </a>
                    )}
                    
                    {listing.socialMedia.twitter && (
                      <a 
                        href={listing.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <span className="font-semibold">Twitter</span>
                      </a>
                    )}
                    
                    {listing.socialMedia.facebook && (
                      <a 
                        href={listing.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <span className="font-semibold">Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.name} - Photo ${index + 2}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(index + 1)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <CommentSection
                  contentType="directory"
                  contentId={listing._id}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Information */}
              {listing.owner && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Listed by</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {listing.owner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{listing.owner.name}</p>
                      <p className="text-sm text-gray-500">{listing.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Listing Status</h3>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                  listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {listing.status === 'approved' ? 'This listing is approved and visible to the public.' :
                   listing.status === 'pending' ? 'This listing is pending approval.' :
                   'This listing has been rejected.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default DirectoryDetail;


