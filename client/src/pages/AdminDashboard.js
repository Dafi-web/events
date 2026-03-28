import React, { useState, useEffect } from 'react';
import { 
  Users, 
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
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [allDirectoryListings, setAllDirectoryListings] = useState([]);
  const [tutorialEnrollments, setTutorialEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [courseError, setCourseError] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'general',
    order: 0,
    isPublished: true,
    pages: [{ title: '', body: '', practices: [] }]
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
      const [coursesRes, usersRes, newsRes, directoryRes, allDirectoryRes, tutorialsRes] = await Promise.all([
        api.get('/courses/admin/all'),
        api.get('/users?limit=50'),
        api.get('/news?limit=50'),
        api.get('/directory/admin/pending'),
        api.get('/directory/admin/all'),
        api.get('/tutorials/enrollments?limit=50')
      ]);
      
      setCourses(coursesRes.data.courses || []);
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

  const resetCourseForm = () => {
    setNewCourse({
      title: '',
      summary: '',
      description: '',
      category: 'general',
      order: 0,
      isPublished: true,
      pages: [{ title: '', body: '', practices: [] }]
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setCourseError('');
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setCourseError('');

    const validPages = (newCourse.pages || [])
      .filter((p) => p.title.trim() && p.body.trim())
      .map((p) => ({
        title: p.title.trim(),
        body: p.body,
        practices: (p.practices || [])
          .filter((pr) => pr && String(pr.title || '').trim())
          .map((pr) => ({
            title: String(pr.title).trim(),
            instructions: pr.instructions || '',
            starterCode: pr.starterCode || '',
            solution: pr.solution || '',
            language: ['html', 'css', 'javascript', 'mixed'].includes(pr.language)
              ? pr.language
              : 'html'
          }))
      }));
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      setCourseError('Title and description are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newCourse.title.trim());
      formData.append('summary', (newCourse.summary || '').trim());
      formData.append('description', newCourse.description);
      formData.append('category', newCourse.category);
      formData.append('order', String(newCourse.order ?? 0));
      formData.append('isPublished', newCourse.isPublished);
      formData.append('pages', JSON.stringify(validPages));

      if (editingCourse) {
        formData.append(
          'existingImages',
          JSON.stringify(editingCourse.images || [])
        );
        formData.append(
          'existingVideos',
          JSON.stringify(editingCourse.videos || [])
        );
      }

      selectedImages.forEach((image) => formData.append('images', image));
      selectedVideos.forEach((video) => formData.append('videos', video));

      const endpoint = editingCourse ? `/courses/${editingCourse._id}` : '/courses';
      const method = editingCourse ? 'put' : 'post';
      await api[method](endpoint, formData);

      setShowCreateCourse(false);
      setEditingCourse(null);
      resetCourseForm();
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err) => err.message).join(', ');
        setCourseError(`Validation: ${errorMessages}`);
      } else {
        setCourseError(error.response?.data?.msg || 'Failed to save course.');
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
      setCourseError(errors.join(' '));
      setSelectedVideos([]);
    } else {
      setSelectedVideos(validFiles);
      setCourseError('');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title || '',
      summary: course.summary || '',
      description: course.description || '',
      category: course.category || 'general',
      order: course.order ?? 0,
      isPublished: course.isPublished !== false,
      pages:
        course.pages && course.pages.length
          ? course.pages.map((p) => ({
              title: p.title,
              body: p.body,
              practices: (p.practices || []).map((pr) => ({
                title: pr.title || '',
                instructions: pr.instructions || '',
                starterCode: pr.starterCode || '',
                solution: pr.solution || '',
                language: pr.language || 'html'
              }))
            }))
          : [{ title: '', body: '', practices: [] }]
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setShowCreateCourse(true);
    setCourseError('');
  };

  const handleCancelCourseForm = () => {
    setShowCreateCourse(false);
    setEditingCourse(null);
    resetCourseForm();
  };

  const addCoursePage = () => {
    setNewCourse({
      ...newCourse,
      pages: [...(newCourse.pages || []), { title: '', body: '', practices: [] }]
    });
  };

  const addPracticeToPage = (pageIdx) => {
    const pages = [...(newCourse.pages || [])];
    const practices = [...(pages[pageIdx].practices || [])];
    practices.push({
      title: '',
      instructions: '',
      starterCode: '',
      solution: '',
      language: 'html'
    });
    pages[pageIdx] = { ...pages[pageIdx], practices };
    setNewCourse({ ...newCourse, pages });
  };

  const removePracticeFromPage = (pageIdx, prIdx) => {
    const pages = [...(newCourse.pages || [])];
    const practices = (pages[pageIdx].practices || []).filter((_, i) => i !== prIdx);
    pages[pageIdx] = { ...pages[pageIdx], practices };
    setNewCourse({ ...newCourse, pages });
  };

  const updatePracticeField = (pageIdx, prIdx, field, value) => {
    const pages = [...(newCourse.pages || [])];
    const practices = [...(pages[pageIdx].practices || [])];
    practices[prIdx] = { ...practices[prIdx], [field]: value };
    pages[pageIdx] = { ...pages[pageIdx], practices };
    setNewCourse({ ...newCourse, pages });
  };

  const updateCoursePage = (index, field, value) => {
    const pages = [...(newCourse.pages || [])];
    pages[index] = { ...pages[index], [field]: value };
    setNewCourse({ ...newCourse, pages });
  };

  const removeCoursePage = (index) => {
    const pages = (newCourse.pages || []).filter((_, i) => i !== index);
    setNewCourse({
      ...newCourse,
      pages: pages.length ? pages : [{ title: '', body: '', practices: [] }]
    });
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
    { id: 'courses', label: 'Courses', icon: GraduationCap, count: courses.length },
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
                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Online school — courses</h2>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourse(null);
                          resetCourseForm();
                          setShowCreateCourse(true);
                        }}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add course
                      </button>
                    </div>

                    {showCreateCourse && (
                      <form onSubmit={handleSaveCourse} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                        <h3 className="text-lg font-semibold">
                          {editingCourse ? 'Edit course' : 'New course'}
                        </h3>

                        {courseError && (
                          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                            {courseError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Course title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                            required
                          />
                          <select
                            value={newCourse.category}
                            onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="general">General</option>
                            <option value="stem">STEM</option>
                            <option value="languages">Languages</option>
                            <option value="arts">Arts</option>
                            <option value="business">Business</option>
                            <option value="technology">Technology</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Short summary (card subtitle)"
                            value={newCourse.summary}
                            onChange={(e) => setNewCourse({ ...newCourse, summary: e.target.value })}
                            className="px-3 py-2 border rounded-lg md:col-span-2"
                          />
                          <input
                            type="number"
                            placeholder="Sort order (lower first)"
                            value={newCourse.order}
                            onChange={(e) =>
                              setNewCourse({ ...newCourse, order: parseInt(e.target.value, 10) || 0 })
                            }
                            className="px-3 py-2 border rounded-lg"
                          />
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={newCourse.isPublished}
                              onChange={(e) =>
                                setNewCourse({ ...newCourse, isPublished: e.target.checked })
                              }
                            />
                            Published (visible to students)
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Overview / about (plain text)
                          </label>
                          <textarea
                            placeholder="Describe what students will learn..."
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={5}
                            required
                          />
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Reading pages (lessons)</span>
                            <button
                              type="button"
                              onClick={addCoursePage}
                              className="text-sm text-primary-600 hover:text-primary-800"
                            >
                              + Add page
                            </button>
                          </div>
                          <div className="space-y-4">
                            {(newCourse.pages || []).map((page, idx) => (
                              <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-semibold text-gray-500">Page {idx + 1}</span>
                                  {(newCourse.pages || []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeCoursePage(idx)}
                                      className="text-xs text-red-600 hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Page title"
                                  value={page.title}
                                  onChange={(e) => updateCoursePage(idx, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                                <textarea
                                  placeholder="Page content (readings, notes, instructions)..."
                                  value={page.body}
                                  onChange={(e) => updateCoursePage(idx, 'body', e.target.value)}
                                  className="w-full px-3 py-2 border rounded-lg text-sm"
                                  rows={4}
                                />
                                <div className="pt-2 border-t border-gray-100 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-600">Code practices</span>
                                    <button
                                      type="button"
                                      onClick={() => addPracticeToPage(idx)}
                                      className="text-xs text-primary-600 hover:text-primary-800"
                                    >
                                      + Add practice
                                    </button>
                                  </div>
                                  {(page.practices || []).map((pr, pidx) => (
                                    <div
                                      key={pidx}
                                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Practice {pidx + 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => removePracticeFromPage(idx, pidx)}
                                          className="text-xs text-red-600 hover:text-red-800"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Practice title"
                                        value={pr.title}
                                        onChange={(e) =>
                                          updatePracticeField(idx, pidx, 'title', e.target.value)
                                        }
                                        className="w-full px-2 py-1.5 border rounded text-xs"
                                      />
                                      <textarea
                                        placeholder="Instructions for the learner"
                                        value={pr.instructions}
                                        onChange={(e) =>
                                          updatePracticeField(idx, pidx, 'instructions', e.target.value)
                                        }
                                        className="w-full px-2 py-1.5 border rounded text-xs"
                                        rows={2}
                                      />
                                      <select
                                        value={pr.language || 'html'}
                                        onChange={(e) =>
                                          updatePracticeField(idx, pidx, 'language', e.target.value)
                                        }
                                        className="w-full px-2 py-1.5 border rounded text-xs"
                                      >
                                        <option value="html">html (full page in preview)</option>
                                        <option value="mixed">mixed (HTML + inline JS/CSS)</option>
                                        <option value="css">css (preview wraps your CSS)</option>
                                        <option value="javascript">javascript (console output preview)</option>
                                      </select>
                                      <textarea
                                        placeholder="Starter code"
                                        value={pr.starterCode}
                                        onChange={(e) =>
                                          updatePracticeField(idx, pidx, 'starterCode', e.target.value)
                                        }
                                        className="w-full px-2 py-1.5 border rounded text-xs font-mono"
                                        rows={4}
                                      />
                                      <textarea
                                        placeholder="Solution (optional)"
                                        value={pr.solution}
                                        onChange={(e) =>
                                          updatePracticeField(idx, pidx, 'solution', e.target.value)
                                        }
                                        className="w-full px-2 py-1.5 border rounded text-xs font-mono"
                                        rows={3}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Images (gallery & cover uses first image)
                            </label>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700"
                            />
                            {selectedImages.length > 0 && (
                              <p className="mt-2 text-sm text-gray-600">
                                {selectedImages.length} new image(s)
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Videos (lessons)
                            </label>
                            <input
                              type="file"
                              multiple
                              accept="video/*"
                              onChange={handleVideoChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700"
                            />
                            {selectedVideos.length > 0 && (
                              <p className="mt-2 text-sm text-gray-600">
                                {selectedVideos.length} new video(s)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={handleCancelCourseForm}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            {editingCourse ? 'Update course' : 'Create course'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-gray-600 text-sm">
                                {course.category} • order {course.order ?? 0}{' '}
                                {course.isPublished ? (
                                  <span className="text-green-600">• live</span>
                                ) : (
                                  <span className="text-amber-600">• draft</span>
                                )}
                              </p>
                              <p className="text-gray-500 mt-2 line-clamp-2">{course.summary || course.description}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {(course.videos || []).length} video(s) · {(course.pages || []).length}{' '}
                                reading page(s) · {(course.images || []).length} image(s)
                              </p>
                            </div>
                            <div className="flex space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditCourse(course)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit course"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem('courses', course._id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete course"
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

