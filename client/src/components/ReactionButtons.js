import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, Heart, Eye } from 'lucide-react';
import api from '../utils/api';

const ReactionButtons = ({ contentType, contentId, initialLikes = 0, initialDislikes = 0, initialViews = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [views, setViews] = useState(initialViews);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReactions = useCallback(async () => {
    try {
      // Convert contentType to plural form for API calls
      const apiContentType = contentType === 'event' ? 'events' : contentType;
      const response = await api.get(`/reactions/${apiContentType}/${contentId}`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      
      // Check if user has reacted
      if (user && isAuthenticated) {
        // Convert contentType to plural form for API calls
        const apiContentType = contentType === 'event' ? 'events' : contentType;
        const content = await api.get(`/${apiContentType}/${contentId}`);
        const contentData = content.data;
        
        if (Array.isArray(contentData.likes) && contentData.likes.includes(user._id)) {
          setUserReaction('like');
        } else if (Array.isArray(contentData.dislikes) && contentData.dislikes.includes(user._id)) {
          setUserReaction('dislike');
        } else {
          setUserReaction(null);
        }
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, [contentType, contentId, user, isAuthenticated]);

  const trackView = useCallback(async () => {
    try {
      // Check if we've already tracked this view in this session
      const viewKey = `${contentType}-${contentId}`;
      const hasViewed = sessionStorage.getItem(`viewed-${viewKey}`);
      
      if (!hasViewed) {
        // Convert contentType to plural form for API calls
        const apiContentType = contentType === 'event' ? 'events' : contentType;
        // Increment view count on the server
        await api.post(`/${apiContentType}/${contentId}/view`);
        // Mark as viewed in this session
        sessionStorage.setItem(`viewed-${viewKey}`, 'true');
        // Update local view count
        setViews(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  useEffect(() => {
    // Track view when component mounts
    trackView();
  }, [trackView]);


  const handleReaction = async (reactionType) => {
    if (!isAuthenticated) {
      // Show login prompt or redirect
      return;
    }

    setLoading(true);
    try {
      // Convert contentType to plural form for API calls
      const apiContentType = contentType === 'event' ? 'events' : contentType;
      const response = await api.post(`/reactions/${apiContentType}/${contentId}/${reactionType}`);
      
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserReaction(response.data.userReaction);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => handleReaction('like');
  const handleDislike = () => handleReaction('dislike');

  return (
    <div className="flex items-center space-x-6">
      {/* Views */}
      <div className="flex items-center space-x-1 text-gray-500">
        <Eye className="w-4 h-4" />
        <span className="text-sm">{views}</span>
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={loading || !isAuthenticated}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
          userReaction === 'like'
            ? 'bg-blue-100 text-blue-600 border border-blue-200'
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">{likes}</span>
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        disabled={loading || !isAuthenticated}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
          userReaction === 'dislike'
            ? 'bg-red-100 text-red-600 border border-red-200'
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">{dislikes}</span>
      </button>

      {/* Net Score */}
      <div className="flex items-center space-x-1 text-gray-600">
        <Heart className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {likes - dislikes > 0 ? '+' : ''}{likes - dislikes}
        </span>
      </div>
    </div>
  );
};

export default ReactionButtons;
