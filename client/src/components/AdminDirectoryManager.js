import React, { useState, useEffect } from 'react';
import { Building2, User, Users, Check, X, Eye, Star, Clock, MapPin, Phone, Mail, Globe, Trash2 } from 'lucide-react';
import api from '../utils/api';

const AdminDirectoryManager = () => {
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPendingListings();
    fetchAllListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      console.log('🔍 Fetching pending listings...');
      const response = await api.get('/directory/admin/pending');
      console.log('📋 Pending listings response:', response.data);
      setPendingListings(response.data);
    } catch (error) {
      console.error('❌ Error fetching pending listings:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchAllListings = async () => {
    try {
      console.log('🔍 Fetching all listings...');
      const response = await api.get('/directory/admin/all');
      console.log('📋 All listings response:', response.data);
      setAllListings(response.data.listings);
    } catch (error) {
      console.error('❌ Error fetching all listings:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, verified = false, featured = false) => {
    try {
      await api.put(`/directory/admin/${id}/approve`, { verified, featured });
      fetchPendingListings();
      fetchAllListings();
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/directory/admin/${id}/reject`);
      fetchPendingListings();
      fetchAllListings();
    } catch (error) {
      console.error('Error rejecting listing:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this directory listing? This action cannot be undone.')) {
      try {
        await api.delete(`/directory/${id}`);
        fetchPendingListings();
        fetchAllListings();
        console.log('✅ Directory listing deleted successfully');
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const listings = activeTab === 'pending' ? pendingListings : allListings;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Business Directory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Pending ({pendingListings.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Listings ({allListings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-4 h-32"></div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Type Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(listing.type)}`}>
                      {getTypeIcon(listing.type)}
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </div>

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(listing.status)}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </div>

                    {/* Verification Badges */}
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

                  {/* Business Images */}
                  {(listing.logo || (listing.images && listing.images.length > 0)) && (
                    <div className="flex items-center gap-4 mb-4">
                      {listing.logo && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={listing.logo} 
                            alt={`${listing.name} logo`} 
                            className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" 
                          />
                          <span className="text-sm text-gray-600">Logo</span>
                        </div>
                      )}
                      {listing.images && listing.images.length > 0 && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={listing.images[0]} 
                            alt={`${listing.name}`} 
                            className="w-12 h-12 object-cover rounded border-2 border-gray-200" 
                          />
                          <span className="text-sm text-gray-600">
                            Images ({listing.images.length})
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
                  <p className="text-gray-700 mb-3 line-clamp-2">{listing.description}</p>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {listing.contact.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {listing.contact.email}
                      </div>
                    )}
                    {listing.contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {listing.contact.phone}
                      </div>
                    )}
                    {listing.contact.address.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {listing.contact.address.city}, {listing.contact.address.country}
                      </div>
                    )}
                    {listing.contact.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={listing.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    <div>Category: <span className="capitalize">{listing.category.replace('-', ' ')}</span></div>
                    <div>Owner: {listing.owner?.name} ({listing.owner?.email})</div>
                    <div>Submitted: {formatDate(listing.createdAt)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-6">
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowDetailModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  {listing.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(listing._id, false, false)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(listing._id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {listing.status === 'approved' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(listing._id, true, listing.featured)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
                          listing.verified 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        {listing.verified ? 'Verified' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleApprove(listing._id, listing.verified, true)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
                          listing.featured 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        {listing.featured ? 'Featured' : 'Feature'}
                      </button>
                    </div>
                  )}

                  {/* Delete button for all listings */}
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold mt-2"
                    title="Delete this listing permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'pending' ? 'No pending listings' : 'No listings found'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'pending' 
              ? 'All business listings have been reviewed.' 
              : 'No business listings have been submitted yet.'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Listing Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <p className="text-gray-900">{selectedListing.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(selectedListing.type)}`}>
                        {getTypeIcon(selectedListing.type)}
                        {selectedListing.type.charAt(0).toUpperCase() + selectedListing.type.slice(1)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900 capitalize">{selectedListing.category.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedListing.description}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {selectedListing.contact.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedListing.contact.email}</p>
                      </div>
                    )}
                    {selectedListing.contact.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedListing.contact.phone}</p>
                      </div>
                    )}
                    {selectedListing.contact.website && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <a href={selectedListing.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {selectedListing.contact.website}
                        </a>
                      </div>
                    )}
                    {selectedListing.contact.address.street && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="text-gray-900">{selectedListing.contact.address.street}</p>
                      </div>
                    )}
                    {(selectedListing.contact.address.city || selectedListing.contact.address.country) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-gray-900">
                          {selectedListing.contact.address.city && `${selectedListing.contact.address.city}, `}
                          {selectedListing.contact.address.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedListing.owner?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedListing.owner?.email}</p>
                  </div>
                </div>
              </div>

              {/* Status and Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedListing.status)}`}>
                      {selectedListing.status.charAt(0).toUpperCase() + selectedListing.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedListing.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedListing.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => {
                    handleDelete(selectedListing._id);
                    setShowDetailModal(false);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete Listing
                </button>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Close
                  </button>
                  {selectedListing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedListing._id, false, false);
                          setShowDetailModal(false);
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedListing._id);
                          setShowDetailModal(false);
                        }}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDirectoryManager;
