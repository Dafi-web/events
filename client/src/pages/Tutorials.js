import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, GraduationCap, Zap, Code, Award, Clock, DollarSign, Users, Star } from 'lucide-react';
import api from '../utils/api';

const Tutorials = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myEnrollments, setMyEnrollments] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    course: '',
    courseName: '',
    fullName: user?.name || '',
    address: '',
    city: '',
    telephone: '',
    email: user?.email || ''
  });

  const [errors, setErrors] = useState({});

  const courseIcons = {
    'math-grade-5-12': <BookOpen className="w-8 h-8" />,
    'english-grade-5-12': <GraduationCap className="w-8 h-8" />,
    'physics-grade-5-12': <Zap className="w-8 h-8" />,
    'electrical-engineering': <Zap className="w-8 h-8" />,
    'mern-fullstack': <Code className="w-8 h-8" />,
    'computer-basics': <Award className="w-8 h-8" />
  };

  const courseColors = {
    'math-grade-5-12': 'from-blue-500 to-blue-600',
    'english-grade-5-12': 'from-green-500 to-green-600',
    'physics-grade-5-12': 'from-red-500 to-red-600',
    'electrical-engineering': 'from-yellow-500 to-yellow-600',
    'mern-fullstack': 'from-purple-500 to-purple-600',
    'computer-basics': 'from-indigo-500 to-indigo-600'
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
    if (isAuthenticated) {
      fetchMyEnrollments();
    }
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/tutorials/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await api.get('/team/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      const response = await api.get('/tutorials/my-enrollments');
      setMyEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleCourseSelect = (course) => {
    setFormData(prev => ({
      ...prev,
      course: course.id,
      courseName: course.name
    }));
    setShowEnrollmentForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If course is changed, update course name as well
    if (name === 'course') {
      const selectedCourse = courses.find(course => course.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseName: selectedCourse ? selectedCourse.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }
    if (!formData.telephone || formData.telephone.length < 10) {
      newErrors.telephone = 'Telephone must be at least 10 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/tutorials/enroll', formData);
      alert('Course enrollment submitted successfully!');
      setShowEnrollmentForm(false);
      setFormData({
        course: '',
        courseName: '',
        fullName: user?.name || '',
        address: '',
        city: '',
        telephone: '',
        email: user?.email || ''
      });
      fetchMyEnrollments();
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        alert('Error submitting enrollment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'enrolled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  if (showEnrollmentForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Course Enrollment</h2>
              <button
                onClick={() => setShowEnrollmentForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Course Selection */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Selection</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a course...</option>
                    {courses && courses.length > 0 ? (
                      courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} {course.nameAmharic ? `(${course.nameAmharic})` : ''} - {course.price}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading courses...</option>
                    )}
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    You can change your course selection here if needed
                  </p>
                  
                  {/* Course Pricing Display */}
                  {formData.course && (() => {
                    const selectedCourse = courses.find(c => c.id === formData.course);
                    return selectedCourse ? (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-800">Selected Course Pricing</h4>
                            <p className="text-sm text-green-700">{selectedCourse.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{selectedCourse.price}</div>
                            {selectedCourse.priceAmharic && (
                              <div className="text-sm text-green-500">({selectedCourse.priceAmharic})</div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Payment details will be provided after enrollment confirmation
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telephone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Enter your telephone number"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.telephone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEnrollmentForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn with Us</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Expand your knowledge and skills with our comprehensive educational programs. Choose from various courses designed to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      {instructors.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Instructors</h2>
              <p className="text-lg text-gray-600">Learn from experienced professionals and university lecturers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor) => (
                <div key={instructor._id} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {instructor.profileImage ? (
                      <img 
                        src={instructor.profileImage} 
                        alt={instructor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-primary-600" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{instructor.position}</p>
                  
                  {/* Education Highlights */}
                  {instructor.education && instructor.education.length > 0 && (
                    <div className="mb-4">
                      {instructor.education.map((edu, index) => (
                        <div key={index} className="text-sm text-gray-600 mb-1">
                          <div className="flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{edu.degree} in {edu.field}</span>
                            {edu.isTopUniversity && (
                              <Star className="w-4 h-4 ml-2 text-amber-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{edu.institution}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Expertise */}
                  {instructor.expertise && instructor.expertise.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {instructor.expertise.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {instructor.expertise.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{instructor.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {instructor.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* My Enrollments */}
      {isAuthenticated && myEnrollments.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">My Course Enrollments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEnrollments.map((enrollment) => (
                <div key={enrollment._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{enrollment.courseName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{enrollment.fullName}</p>
                  <p className="text-gray-500 text-xs">
                    Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Available Courses */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Courses</h2>
            <p className="text-lg text-gray-600 mb-6">Choose a course you'd like to learn by clicking on the course card below</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">📚 Click on any course card below to start your enrollment process</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="ml-4 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses available</h3>
              <p className="text-gray-500">Please check back later for available courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className={`h-32 bg-gradient-to-br ${courseColors[course.id]} flex items-center justify-center text-white`}>
                    {courseIcons[course.id]}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.name}</h3>
                    {course.nameAmharic && (
                      <h4 className="text-lg font-medium text-blue-600 mb-2">{course.nameAmharic}</h4>
                    )}
                    <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                    {course.descriptionAmharic && (
                      <p className="text-gray-500 text-xs mb-4 italic">{course.descriptionAmharic}</p>
                    )}
                    
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.duration}</span>
                        {course.durationAmharic && (
                          <span className="ml-2 text-gray-500">({course.durationAmharic})</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{course.level}</span>
                        {course.levelAmharic && (
                          <span className="ml-2 text-gray-500">({course.levelAmharic})</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-bold text-green-600 text-lg">{course.price}</span>
                        {course.priceAmharic && (
                          <span className="ml-2 text-gray-500 text-sm">({course.priceAmharic})</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="font-semibold text-green-600">{course.enrollmentCount || 0} enrolled</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Subjects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                      {course.subjectsAmharic && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.subjectsAmharic.map((subject, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our community of learners and achieve your educational goals with expert guidance.
          </p>
          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-primary-100">Please log in to enroll in courses</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Log In to Enroll
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setShowEnrollmentForm(true)}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Courses
              </button>
              <p className="text-primary-100 text-sm">
                Or scroll up to click on specific course cards
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tutorials;