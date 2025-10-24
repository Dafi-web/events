import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  Building2, 
  GraduationCap,
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AdminDirectoryManager from '../components/AdminDirectoryManager';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [allDirectoryListings, setAllDirectoryListings] = useState([]);
  const [tutorialEnrollments, setTutorialEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [eventError, setEventError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      name: '',
      country: ''
    },
    category: 'cultural',
    isFree: true,
    pricing: {
      general: { amount: 0, currency: 'usd' },
      student: { amount: 0, currency: 'usd' },
      vip: { amount: 0, currency: 'usd' }
    }
  });
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'community',
    featured: false
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes, newsRes, directoryRes, allDirectoryRes, tutorialsRes] = await Promise.all([
        api.get('/events?limit=50'),
        api.get('/users?limit=50'),
        api.get('/news?limit=50'),
        api.get('/directory/admin/pending'),
        api.get('/directory/admin/all'),
        api.get('/tutorials/enrollments?limit=50')
      ]);
      
      setEvents(eventsRes.data.events || eventsRes.data);
      setUsers(usersRes.data.users || usersRes.data);
      setNews(newsRes.data.news || newsRes.data);
      console.log('📋 Directory response:', directoryRes.data);
      setDirectory(directoryRes.data);
      setAllDirectoryListings(allDirectoryRes.data.listings || []);
      setTutorialEnrollments(tutorialsRes.data.enrollments || tutorialsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventError('');
    
    try {
      const formData = new FormData();
      
      // Add basic event data
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('date', newEvent.date);
      formData.append('time', newEvent.time);
      formData.append('location', JSON.stringify(newEvent.location));
      formData.append('category', newEvent.category);
      formData.append('isFree', newEvent.isFree);
      formData.append('pricing', JSON.stringify(newEvent.pricing));
      
      // Add images
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      // Add videos
      console.log('Adding videos to FormData:', selectedVideos.length);
      selectedVideos.forEach((video, index) => {
        console.log(`Adding video ${index + 1} to FormData:`, {
          name: video.name,
          size: video.size,
          type: video.type
        });
        formData.append('videos', video);
      });

      const endpoint = editingEvent ? `/events/${editingEvent._id}` : '/events';
      const method = editingEvent ? 'put' : 'post';
      
      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      console.log(`Sending ${method.toUpperCase()} request to ${endpoint}`);
      await api[method](endpoint, formData);
      
      setShowCreateEvent(false);
      setEditingEvent(null);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: {
          name: '',
          country: ''
        },
        category: 'cultural',
        isFree: true,
        pricing: {
          general: { amount: 0, currency: 'usd' },
          student: { amount: 0, currency: 'usd' },
          vip: { amount: 0, currency: 'usd' }
        }
      });
      setSelectedImages([]);
      setSelectedVideos([]);
      setEventError('');
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving event:', error);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
          setEventError(`Validation Error: ${errorMessages}`);
        } else if (error.response?.data?.error) {
          // Handle multer errors (file too large, etc.)
          setEventError(error.response.data.error);
        } else {
          setEventError(error.response?.data?.msg || 'Failed to save event. Please try again.');
        }
      } else if (error.response?.status === 503) {
        // Handle service configuration errors
        if (error.response?.data?.error === 'UPLOAD_SERVICE_NOT_CONFIGURED') {
          setEventError('File upload service is not configured. Please contact the administrator to set up Cloudinary.');
        } else if (error.response?.data?.error === 'STRIPE_NOT_CONFIGURED') {
          setEventError('Payment processing is not configured. Please contact the administrator to set up Stripe.');
        } else {
          setEventError(error.response?.data?.msg || 'Service temporarily unavailable. Please try again later.');
        }
      } else {
        setEventError(error.response?.data?.msg || 'Failed to save event. Please try again.');
      }
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await api.post('/news', { ...newNews, published: true });
      setShowCreateNews(false);
      setNewNews({
        title: '',
        content: '',
        excerpt: '',
        category: 'community',
        featured: false
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const handleApproveDirectory = async (id) => {
    try {
      await api.put(`/directory/admin/${id}/approve`, { verified: true });
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving directory item:', error);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/${type}/${id}`);
        fetchDashboardData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAttendeeCount = (event) => {
    return event.attendees ? event.attendees.filter(a => a.status === 'going').length : 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Video files selected:', files.length);
    
    // Validate file sizes (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB
    const validFiles = [];
    const errors = [];
    
    files.forEach((file, index) => {
      console.log(`Video ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      setEventError(errors.join(' '));
      setSelectedVideos([]);
    } else {
      setSelectedVideos(validFiles);
      setEventError('');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    
    // Handle date conversion - can be either ISO string or date object
    let dateString = '';
    if (event.date) {
      if (typeof event.date === 'string') {
        dateString = event.date.split('T')[0];
      } else {
        dateString = new Date(event.date).toISOString().split('T')[0];
      }
    }
    
    setNewEvent({
      title: event.title || '',
      description: event.description || '',
      date: dateString,
      time: event.time || '',
      location: {
        name: event.location?.name || '',
        country: event.location?.country || ''
      },
      category: event.category || 'cultural',
      isFree: event.isFree !== undefined ? event.isFree : true,
      pricing: event.pricing || {
        general: { amount: 0, currency: 'usd' },
        student: { amount: 0, currency: 'usd' },
        vip: { amount: 0, currency: 'usd' }
      }
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setShowCreateEvent(true);
    setEventError('');
  };

  const handleCancelEdit = () => {
    setShowCreateEvent(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: {
        name: '',
        country: ''
      },
      category: 'cultural',
      isFree: true,
      pricing: {
        general: { amount: 0, currency: 'usd' },
        student: { amount: 0, currency: 'usd' },
        vip: { amount: 0, currency: 'usd' }
      }
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setEventError('');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar, count: events.length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'news', label: 'News', icon: Newspaper, count: news.length },
    { id: 'directory', label: 'Directory', icon: Building2, count: allDirectoryListings.length },
    { id: 'tutorials', label: 'Tutorials', icon: GraduationCap, count: tutorialEnrollments.length, link: '/admin/tutorials' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your DafiTech platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Icon className="w-8 h-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{tab.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{tab.count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  tab.link ? (
                    <a
                      key={tab.id}
                      href={tab.link}
                      className="flex items-center py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </a>
                  ) : (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </button>
                  )
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Events Tab */}
                {activeTab === 'events' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Events Management</h2>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setShowCreateEvent(true);
                        }}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Event
                      </button>
                    </div>

                    {showCreateEvent && (
                      <form onSubmit={handleCreateEvent} className="mb-6 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                          {editingEvent ? 'Edit Event' : 'Create New Event'}
                        </h3>
                        
                        {eventError && (
                          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                            {eventError}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Event Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Location Name"
                            value={newEvent.location.name}
                            onChange={(e) => setNewEvent({...newEvent, location: {...newEvent.location, name: e.target.value}})}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            value={newEvent.location.country}
                            onChange={(e) => setNewEvent({...newEvent, location: {...newEvent.location, country: e.target.value}})}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <select
                            value={newEvent.category}
                            onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="cultural">Cultural</option>
                            <option value="business">Business</option>
                            <option value="education">Education</option>
                            <option value="social">Social</option>
                            <option value="youth">Youth</option>
                            <option value="religious">Religious</option>
                          </select>
                          <textarea
                            placeholder="Event Description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            className="px-3 py-2 border rounded-lg col-span-full"
                            rows={3}
                            required
                          />

                          {/* Event Pricing Section */}
                          <div className="col-span-full">
                            <label className="flex items-center mb-4">
                              <input
                                type="checkbox"
                                checked={!newEvent.isFree}
                                onChange={(e) => setNewEvent({...newEvent, isFree: !e.target.checked})}
                                className="mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">This is a paid event</span>
                            </label>

                            {!newEvent.isFree && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">General Admission</label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={newEvent.pricing.general.amount}
                                      onChange={(e) => setNewEvent({
                                        ...newEvent,
                                        pricing: {
                                          ...newEvent.pricing,
                                          general: { ...newEvent.pricing.general, amount: parseFloat(e.target.value) || 0 }
                                        }
                                      })}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-sm"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Price</label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={newEvent.pricing.student.amount}
                                      onChange={(e) => setNewEvent({
                                        ...newEvent,
                                        pricing: {
                                          ...newEvent.pricing,
                                          student: { ...newEvent.pricing.student, amount: parseFloat(e.target.value) || 0 }
                                        }
                                      })}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-sm"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">VIP Price</label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={newEvent.pricing.vip.amount}
                                      onChange={(e) => setNewEvent({
                                        ...newEvent,
                                        pricing: {
                                          ...newEvent.pricing,
                                          vip: { ...newEvent.pricing.vip, amount: parseFloat(e.target.value) || 0 }
                                        }
                                      })}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-sm"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* File Upload Section */}
                          <div className="col-span-full space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Images (max 10, up to 500MB each)
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/tiff,image/tif,image/ico,image/heic,image/heif,image/avif,image/apng"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                All image formats supported (JPG, PNG, GIF, WebP, etc.)
                              </p>
                              {selectedImages.length > 0 && (
                                <p className="mt-2 text-sm text-gray-600">
                                  {selectedImages.length} image(s) selected
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Videos (max 5, up to 20MB each)
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="video/*,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,video/ogg,video/3gpp,video/x-ms-wmv,video/x-flv,video/x-matroska,video/x-ms-asf,video/x-m4v,video/x-ms-wm,video/x-ms-wmx"
                                onChange={handleVideoChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                All video formats supported (MP4, MOV, AVI, WebM, etc.) • Maximum 20MB per file
                              </p>
                              {selectedVideos.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    {selectedVideos.length} video(s) selected:
                                  </p>
                                  <ul className="text-xs text-gray-500 mt-1">
                                    {selectedVideos.map((video, index) => (
                                      <li key={index}>
                                        {video.name} ({(video.size / 1024 / 1024).toFixed(1)}MB)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            {editingEvent ? 'Update Event' : 'Create Event'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-4">
                      {events.map(event => (
                        <div key={event._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-gray-600 text-sm">{formatDate(event.date)} at {event.time}</p>
                              <p className="text-gray-600 text-sm">{event.location?.name}</p>
                              <p className="text-gray-500 mt-2">{event.description}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="flex items-center text-sm text-gray-600">
                                  <Users className="w-4 h-4 mr-1" />
                                  {getAttendeeCount(event)} attending
                                </span>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {event.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditEvent(event)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit Event"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('events', event._id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete Event"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Users Management</h2>
                    <div className="space-y-4">
                      {users.map(user => (
                        <div key={user._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-gray-600 text-sm">{user.email}</p>
                              <p className="text-gray-600 text-sm">{user.country} • {user.profession}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {user.role !== 'admin' && (
                                <button className="text-green-600 hover:text-green-800">
                                  <UserCheck className="w-5 h-5" />
                                </button>
                              )}
                              <button className="text-red-600 hover:text-red-800">
                                <UserX className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* News Tab */}
                {activeTab === 'news' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">News Management</h2>
                      <button
                        onClick={() => setShowCreateNews(true)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create News
                      </button>
                    </div>

                    {showCreateNews && (
                      <form onSubmit={handleCreateNews} className="mb-6 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Create New Article</h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Article Title"
                            value={newNews.title}
                            onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                          />
                          <select
                            value={newNews.category}
                            onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="community">Community</option>
                            <option value="youth">Youth</option>
                            <option value="culture">Culture</option>
                            <option value="development">Development</option>
                            <option value="news">News</option>
                            <option value="story">Story</option>
                          </select>
                          <textarea
                            placeholder="Article Content"
                            value={newNews.content}
                            onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={6}
                            required
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newNews.featured}
                              onChange={(e) => setNewNews({...newNews, featured: e.target.checked})}
                              className="mr-2"
                            />
                            Featured Article
                          </label>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            onClick={() => setShowCreateNews(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            Publish Article
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-4">
                      {news.map(article => (
                        <div key={article._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{article.title}</h3>
                              <p className="text-gray-600 text-sm">
                                By {article.author?.name || 'Unknown'} • {formatDate(article.createdAt)}
                              </p>
                              <p className="text-gray-500 mt-2">{article.excerpt}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                article.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {article.category} {article.featured ? '• Featured' : ''}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('news', article._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directory Tab */}
                {activeTab === 'directory' && (
                  <AdminDirectoryManager />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

