import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Star, Plus, Search, Building2, User, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ReactionButtons from '../components/ReactionButtons';
import CommentSection from '../components/CommentSection';

const Directory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeView, setActiveView] = useState('public'); // 'public' or 'my-listings'
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    country: ''
  });
  const [newListing, setNewListing] = useState({
    name: '',
    description: '',
    type: 'business',
    category: 'other',
    contact: {
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      }
    },
    hours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    socialMedia: {
      instagram: '',
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    tags: []
  });

  const fetchListings = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.country) params.append('country', filters.country);

      const response = await api.get(`/directory?${params.toString()}`);
      setListings(response.data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters.type, filters.category, filters.country]);

  const fetchMyListings = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await api.get('/directory/my-listings');
      setMyListings(response.data.listings);
    } catch (error) {
      console.error('Error fetching my listings:', error);
      // Fallback to admin route if user is admin
      try {
        const adminResponse = await api.get('/directory/admin/all');
        const userListings = adminResponse.data.listings.filter(listing => {
          const ownerId = listing.owner?._id;
          const userId = user._id || user.id;
          const match = ownerId === userId || ownerId === user.id || ownerId === user._id;
          return listing.owner && match;
        });
        setMyListings(userListings);
      } catch (adminError) {
        console.error('Error with admin fallback:', adminError);
        // Final fallback: use public route and filter
        try {
          const publicResponse = await api.get('/directory');
          const publicListings = publicResponse.data.listings.filter(listing => {
            const ownerId = listing.owner?._id;
            const userId = user._id || user.id;
            const match = ownerId === userId || ownerId === user.id || ownerId === user._id;
            return listing.owner && match;
          });
          setMyListings(publicListings);
        } catch (publicError) {
          console.error('Error with public route fallback:', publicError);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchListings();
    if (isAuthenticated) {
      fetchMyListings();
    }
  }, [fetchListings, fetchMyListings, isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(newListing).forEach(key => {
        if (key === 'contact') {
          Object.keys(newListing.contact).forEach(contactKey => {
            if (contactKey === 'address') {
              Object.keys(newListing.contact.address).forEach(addressKey => {
                formData.append(`contact.address.${addressKey}`, newListing.contact.address[addressKey]);
              });
            } else {
              formData.append(`contact.${contactKey}`, newListing.contact[contactKey]);
            }
          });
        } else if (key === 'hours') {
          Object.keys(newListing.hours).forEach(hourKey => {
            formData.append(`hours.${hourKey}`, newListing.hours[hourKey]);
          });
        } else if (key === 'socialMedia') {
          Object.keys(newListing.socialMedia).forEach(socialKey => {
            formData.append(`socialMedia.${socialKey}`, newListing.socialMedia[socialKey]);
          });
        } else if (key === 'tags') {
          formData.append('tags', newListing.tags.join(','));
        } else if (key !== 'logoFile' && key !== 'imageFiles') {
          formData.append(key, newListing[key]);
        }
      });

      // Add logo file
      if (newListing.logoFile) {
        formData.append('logo', newListing.logoFile);
      }

      // Add image files
      if (newListing.imageFiles && newListing.imageFiles.length > 0) {
        newListing.imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await api.post('/directory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Business submitted successfully:', response.data);
      
      setSubmitSuccess(true);
      setShowAddForm(false);
      setNewListing({
        name: '',
        description: '',
        type: 'business',
        category: 'other',
        contact: {
          email: '',
          phone: '',
          website: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        },
        hours: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: ''
        },
        socialMedia: {
          instagram: '',
          linkedin: '',
          twitter: '',
          facebook: ''
        },
        tags: [],
        logoFile: null,
        imageFiles: []
      });
      fetchListings();
      if (isAuthenticated) {
        fetchMyListings();
      }
      
      // Show success message for 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      
      if (error.response?.status === 401) {
        setSubmitError('Please login to submit your business listing.');
      } else if (error.response?.status === 400) {
        setSubmitError(error.response?.data?.msg || 'Please fill in all required fields correctly.');
      } else {
        setSubmitError('Failed to submit business listing. Please try again.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'business': return <Building2 className="w-5 h-5" />;
      case 'professional': return <User className="w-5 h-5" />;
      case 'organization': return <Users className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
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

  const handleListingClick = (listingId) => {
    navigate(`/directory/${listingId}`);
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20">
              <Building2 className="w-20 h-20 text-amber-600 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="text-amber-600">Community</span> Business Directory
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Access our exclusive business directory to discover and connect with community-owned businesses, professionals, and organizations.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Member-Only Access</h2>
                <p className="text-amber-700 mb-4">
                  This directory is exclusively for DafiTech community members. Please log in to view and add businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/login"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Login to Access
                  </a>
                  <a
                    href="/register"
                    className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Join Community
                  </a>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Benefits of joining:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Access to exclusive business directory</li>
                  <li>• Add your business to the community</li>
                  <li>• Connect with other professionals</li>
                  <li>• Discover local businesses and services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-amber-600">Community</span> Business Directory
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover and support community-owned businesses, professionals, and organizations worldwide. 
            Connect with our members' entrepreneurs and service providers.
          </p>
          
          {/* Directory Stats and Add Business Button */}
          <div className="flex flex-col items-center gap-6">
            {/* Directory Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/20">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">{listings.length} Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{myListings.length} My Listings</span>
                </div>
              </div>
            </div>
            
            {/* Add Business Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your Business
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <strong>Success!</strong> Your business has been submitted for review. You will be notified once it's approved.
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              <strong>Error:</strong> {submitError}
            </div>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveView('public')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeView === 'public'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Businesses
            </button>
            <button
              onClick={() => setActiveView('my-listings')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeView === 'my-listings'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Submissions ({myListings.length})
            </button>
          </div>
        </div>


        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search businesses, professionals, or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="business">Business</option>
                <option value="professional">Professional</option>
                <option value="organization">Organization</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail</option>
                <option value="services">Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="non-profit">Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Add Business Button */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowAddForm(true);
                } else {
                  setSubmitError('Please login to submit your business listing.');
                }
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your Business
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : activeView === 'my-listings' ? (
          // User's listings view
          myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myListings.map((listing) => (
                <div 
                  key={listing._id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 cursor-pointer"
                  onClick={() => handleListingClick(listing._id)}
                >
                  {/* Business Images */}
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-red-500/20 to-green-500/20">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : listing.logo ? (
                      <div className="flex items-center justify-center h-full">
                        <img 
                          src={listing.logo} 
                          alt={`${listing.name} logo`} 
                          className="w-24 h-24 object-cover rounded-full shadow-lg" 
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {listing.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                    
                    {/* Logo overlay if both logo and images exist */}
                    {listing.logo && listing.images && listing.images.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <img 
                          src={listing.logo} 
                          alt={`${listing.name} logo`} 
                          className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md" 
                        />
                      </div>
                    )}
                    
                    {/* Image count indicator */}
                    {listing.images && listing.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        +{listing.images.length - 1} more
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Type Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getTypeColor(listing.type)}`}>
                      {getTypeIcon(listing.type)}
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </div>

                    {/* Business Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {listing.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Status Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Status: {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {listing.contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-amber-500" />
                          {listing.contact.email}
                        </div>
                      )}
                      {listing.contact.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-red-500" />
                          {listing.contact.phone}
                        </div>
                      )}
                      {listing.contact.address.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-green-500" />
                          {listing.contact.address.city}, {listing.contact.address.country}
                        </div>
                      )}
                    </div>

                    {/* Reaction Buttons */}
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                      <ReactionButtons
                        contentType="directory"
                        contentId={listing._id}
                        initialLikes={listing.likes?.length || 0}
                        initialDislikes={listing.dislikes?.length || 0}
                        initialViews={listing.views || 0}
                      />
                    </div>

                    {/* Verification Badges */}
                    <div className="flex items-center gap-2">
                      {listing.verified && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Star className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      )}
                      {listing.featured && (
                        <div className="flex items-center text-amber-600 text-sm">
                          <Star className="w-4 h-4 mr-1" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Click to view details hint */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-amber-600 font-medium">
                        Click to view full details
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No submissions yet</h3>
              <p className="text-gray-600 mb-8">You haven't submitted any businesses yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Business
              </button>
            </div>
          )
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div 
                key={listing._id} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 cursor-pointer"
                onClick={() => handleListingClick(listing._id)}
              >
                {/* Business Images */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-red-500/20 to-green-500/20">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : listing.logo ? (
                    <div className="flex items-center justify-center h-full">
                      <img 
                        src={listing.logo} 
                        alt={`${listing.name} logo`} 
                        className="w-24 h-24 object-cover rounded-full shadow-lg" 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {listing.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  {/* Logo overlay if both logo and images exist */}
                  {listing.logo && listing.images && listing.images.length > 0 && (
                    <div className="absolute top-4 left-4">
                      <img 
                        src={listing.logo} 
                        alt={`${listing.name} logo`} 
                        className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md" 
                      />
                    </div>
                  )}
                  
                  {/* Image count indicator */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                      +{listing.images.length - 1} more
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Type Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getTypeColor(listing.type)}`}>
                    {getTypeIcon(listing.type)}
                    {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                  </div>

                  {/* Business Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {listing.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {listing.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {listing.contact.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-amber-500" />
                        {listing.contact.email}
                      </div>
                    )}
                    {listing.contact.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-red-500" />
                        {listing.contact.phone}
                      </div>
                    )}
                    {listing.contact.address.city && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        {listing.contact.address.city}, {listing.contact.address.country}
                      </div>
                    )}
                    {listing.contact.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2 text-blue-500" />
                        <a href={listing.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="text-sm text-gray-500 capitalize mb-4">
                    {listing.category.replace('-', ' ')}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {listing.verified && (
                        <div className="flex items-center text-green-600 text-sm mr-4">
                          <Star className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      )}
                      {listing.featured && (
                        <div className="flex items-center text-amber-600 text-sm">
                          <Star className="w-4 h-4 mr-1" />
                          Featured
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {listing.status}
                    </div>
                  </div>

                  {/* Click to view details hint */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-amber-600 font-medium">
                      Click to view full details
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No businesses found</h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters.' 
                : 'No businesses have been added to the directory yet.'}
            </p>
            <p className="text-sm text-gray-500">
              Use the "Add Your Business" button above to be the first to add your business!
            </p>
          </div>
        )}
      </div>

      {/* Add Business Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Your Business</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newListing.name}
                    onChange={(e) => setNewListing({...newListing, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                  <select
                    required
                    value={newListing.type}
                    onChange={(e) => setNewListing({...newListing, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="business">Business</option>
                    <option value="professional">Professional</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={newListing.category}
                  onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newListing.description}
                  onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Describe your business, services, or organization"
                />
              </div>

              {/* Company Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Images</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewListing({...newListing, logoFile: e.target.files[0]})}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">Upload your company logo (optional)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setNewListing({...newListing, imageFiles: Array.from(e.target.files)})}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">Upload up to 5 additional images of your business (optional)</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newListing.contact.email}
                      onChange={(e) => setNewListing({
                        ...newListing,
                        contact: {...newListing.contact, email: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newListing.contact.phone}
                      onChange={(e) => setNewListing({
                        ...newListing,
                        contact: {...newListing.contact, phone: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+31686371240"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={newListing.contact.website}
                    onChange={(e) => setNewListing({
                      ...newListing,
                      contact: {...newListing.contact, website: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Address */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={newListing.contact.address.city}
                      onChange={(e) => setNewListing({
                        ...newListing,
                        contact: {
                          ...newListing.contact,
                          address: {...newListing.contact.address, city: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      required
                      value={newListing.contact.address.country}
                      onChange={(e) => setNewListing({
                        ...newListing,
                        contact: {
                          ...newListing.contact,
                          address: {...newListing.contact.address, country: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                    submitLoading 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                  }`}
                >
                  {submitLoading ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Section for Featured Listings */}
      {listings.length > 0 && listings.some(listing => listing.featured) && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Community Discussion
          </h2>
          <div className="max-w-4xl mx-auto">
            <CommentSection
              contentType="directory"
              contentId={listings.find(listing => listing.featured)?._id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;

