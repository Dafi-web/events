import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, Globe, Edit, Save, X, Camera, Lock,
  Linkedin, Instagram, Twitter, Facebook, Youtube
} from 'lucide-react';
import api from '../utils/api';
import { translateAuthMsg } from '../utils/authMsg';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    profession: '',
    bio: '',
    company: '',
    jobTitle: '',
    experience: '',
    education: '',
    languages: [],
    skills: [],
    interests: [],
    socialLinks: {
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: '',
      website: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        profession: user.profession || '',
        bio: user.bio || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        experience: user.experience || '',
        education: user.education || '',
        languages: user.languages || [],
        skills: user.skills || [],
        interests: user.interests || [],
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || '',
          facebook: user.socialLinks?.facebook || '',
          website: user.socialLinks?.website || '',
          youtube: user.socialLinks?.youtube || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting profile data:', formData);
      const response = await api.put('/users/profile', formData);
      updateUser(response.data);
      setIsEditing(false);
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdFeedback({ type: '', text: '' });
    if (pwd.new.length < 6) {
      setPwdFeedback({ type: 'err', text: t('errPasswordMin') });
      return;
    }
    if (pwd.new !== pwd.confirm) {
      setPwdFeedback({ type: 'err', text: t('passwordsMustMatch') });
      return;
    }
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwd.current,
        newPassword: pwd.new
      });
      setPwdFeedback({ type: 'ok', text: t('passwordChangedSuccess') });
      setPwd({ current: '', new: '', confirm: '' });
    } catch (err) {
      const code = err.response?.data?.msg;
      setPwdFeedback({ type: 'err', text: translateAuthMsg(code, t) });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || '',
      profession: user.profession || '',
      bio: user.bio || '',
      company: user.company || '',
      jobTitle: user.jobTitle || '',
      experience: user.experience || '',
      education: user.education || '',
      languages: user.languages || [],
      skills: user.skills || [],
      interests: user.interests || [],
      socialLinks: {
        linkedin: user.socialLinks?.linkedin || '',
        instagram: user.socialLinks?.instagram || '',
        twitter: user.socialLinks?.twitter || '',
        facebook: user.socialLinks?.facebook || '',
        website: user.socialLinks?.website || '',
        youtube: user.socialLinks?.youtube || ''
      }
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-primary-600" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-primary-100">{user.profession}</p>
                  <p className="text-primary-200 text-sm">{user.country}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>{t('cancel')}</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? t('loading') : t('save')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('edit')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-600 shrink-0" />
                {t('changePasswordTitle')}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{t('changePasswordHint')}</p>
              <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                {pwdFeedback.text && (
                  <div
                    className={`text-sm px-3 py-2 rounded-md ${
                      pwdFeedback.type === 'ok'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {pwdFeedback.text}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('currentPassword')}
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={pwd.current}
                    onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('newPassword')}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={pwd.new}
                    onChange={(e) => setPwd((p) => ({ ...p, new: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('confirmNewPassword')}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
                >
                  {pwdLoading ? t('loading') : t('updatePassword')}
                </button>
              </form>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <p className="text-gray-900">{user.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <p className="text-gray-900">{user.profession}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.company || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.jobTitle || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    {isEditing ? (
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe your professional experience..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.experience || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    {isEditing ? (
                      <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your educational background..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.education || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.languages.join(', ')}
                        onChange={(e) => handleArrayChange('languages', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="English, Amharic, French..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.languages?.join(', ') || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.skills.join(', ')}
                        onChange={(e) => handleArrayChange('skills', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="JavaScript, React, Project Management..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.skills?.join(', ') || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {platform === 'linkedin' && <Linkedin className="w-4 h-4 inline mr-2" />}
                        {platform === 'instagram' && <Instagram className="w-4 h-4 inline mr-2" />}
                        {platform === 'twitter' && <Twitter className="w-4 h-4 inline mr-2" />}
                        {platform === 'facebook' && <Facebook className="w-4 h-4 inline mr-2" />}
                        {platform === 'youtube' && <Youtube className="w-4 h-4 inline mr-2" />}
                        {platform === 'website' && <Globe className="w-4 h-4 inline mr-2" />}
                        {platform}
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          name={`socialLinks.${platform}`}
                          value={url}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={`https://${platform}.com/username`}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {user.socialLinks?.[platform] ? (
                            <a 
                              href={user.socialLinks[platform]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {user.socialLinks[platform]}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
