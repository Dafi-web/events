import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import api from '../utils/api';

const CommentCard = ({ 
  comment, 
  isReply = false, 
  user, 
  isAuthenticated, 
  replyingTo, 
  setReplyingTo, 
  replyText, 
  setReplyText, 
  submitting, 
  handleSubmitReply, 
  handleReaction, 
  setComments 
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  
  // Debug logging
  console.log('CommentCard - comment.likes type:', typeof comment.likes, 'value:', comment.likes);
  console.log('CommentCard - comment.dislikes type:', typeof comment.dislikes, 'value:', comment.dislikes);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleReplies = async () => {
    if (!showReplies) {
      setReplyLoading(true);
      try {
        console.log('Fetching replies for comment:', comment._id, 'replyCount:', comment.replyCount);
        const response = await api.get(`/comments/replies/${comment._id}`);
        console.log('Replies response:', response.data);
        // Update comment with replies
        setComments(prevComments => 
          prevComments.map(c => 
            c._id === comment._id 
              ? { ...c, replies: response.data.replies || [] }
              : c
          )
        );
      } catch (error) {
        console.error('Error fetching replies:', error);
        // Set empty replies array on error
        setComments(prevComments => 
          prevComments.map(c => 
            c._id === comment._id 
              ? { ...c, replies: [] }
              : c
          )
        );
      } finally {
        setReplyLoading(false);
      }
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : ''} bg-white rounded-lg border border-gray-200 p-4`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-gray-900">{comment.author?.name || 'Anonymous'}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-gray-700 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleReaction(comment._id, 'like')}
              className={`flex items-center space-x-1 text-sm ${
                Array.isArray(comment.likes) && comment.likes.includes(user?._id) ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{Array.isArray(comment.likes) ? comment.likes.length : 0}</span>
            </button>
            
            <button
              onClick={() => handleReaction(comment._id, 'dislike')}
              className={`flex items-center space-x-1 text-sm ${
                Array.isArray(comment.dislikes) && comment.dislikes.includes(user?._id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{Array.isArray(comment.dislikes) ? comment.dislikes.length : 0}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}

            {!isReply && (
              <button
                onClick={handleToggleReplies}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {replyLoading ? 'Loading...' : 
                   comment.replyCount > 0 ? 
                     `${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}` : 
                     'View Replies'
                  }
                </span>
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment._id && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              {console.log('Rendering reply form for comment:', comment._id, 'replyingTo:', replyingTo)}
              <textarea
                value={replyText}
                onChange={(e) => {
                  console.log('Reply text changed:', e.target.value, 'Length:', e.target.value.length);
                  setReplyText(e.target.value);
                }}
                placeholder="Write a reply... (max 100 characters)"
                disabled={submitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows="3"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${replyText.length > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                  {replyText.length}/100 characters
                  {replyText.length > 100 && ' (exceeds limit)'}
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || submitting}
                    className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {showReplies && (
            <div className="mt-3">
              {replyLoading ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Loading replies...
                </div>
              ) : comment.replies && comment.replies.length > 0 ? (
                <div className="space-y-3">
                  {console.log('Rendering replies:', comment.replies)}
                  {comment.replies.map((reply) => (
                    <CommentCard 
                      key={reply._id} 
                      comment={reply} 
                      isReply={true}
                      user={user}
                      isAuthenticated={isAuthenticated}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      submitting={submitting}
                      handleSubmitReply={handleSubmitReply}
                      handleReaction={handleReaction}
                      setComments={setComments}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No replies yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ contentType, contentId }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  console.log('CommentSection state:', { 
    replyingTo, 
    replyText, 
    submitting, 
    isAuthenticated 
  });

  console.log(`[CommentSection-${contentId}] rendered with:`, { contentType, contentId, isAuthenticated, commentsCount: comments.length });

  const handleLoginClick = () => {
    navigate('/login');
  };

  const fetchComments = useCallback(async () => {
    try {
      console.log(`[${contentId}] Fetching comments for:`, contentType, contentId);
      const response = await api.get(`/comments/${contentType}/${contentId}`);
      console.log(`[${contentId}] Comments response:`, response.data);
      console.log(`[${contentId}] Comments with reply counts:`, response.data.comments.map(c => ({ id: c._id, replyCount: c.replyCount, hasReplies: !!c.replies })));
      setComments(response.data.comments);
    } catch (error) {
      console.error(`[${contentId}] Error fetching comments:`, error);
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId, fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    console.log(`[${contentId}] Submitting comment:`, { content: newComment, contentType, contentId });
    setSubmitting(true);
    try {
      await api.post('/comments', {
        content: newComment,
        contentType,
        contentId
      });
      
      // Refresh comments instead of manually updating
      await fetchComments();
      setNewComment('');
      console.log(`[${contentId}] Comment submitted successfully`);
    } catch (error) {
      console.error(`[${contentId}] Error submitting comment:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !isAuthenticated) return;
    
    // Validate length on submit
    if (replyText.length > 100) {
      alert('Reply must be 100 characters or less');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting reply:', {
        content: replyText,
        contentType,
        contentId,
        parentComment: replyingTo
      });
      const response = await api.post('/comments', {
        content: replyText,
        contentType,
        contentId,
        parentComment: replyingTo
      });
      console.log('Reply submitted successfully:', response.data);
      
      // Refresh comments to show the new reply
      await fetchComments();
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    if (!isAuthenticated) return;

    try {
      const response = await api.post(`/comments/${commentId}/${reactionType}`);
      
      // Update the comment in the state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId 
            ? { ...comment, likes: response.data.likes, dislikes: response.data.dislikes }
            : comment
        )
      );
    } catch (error) {
      console.error('Error toggling reaction:', error);
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


  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-full overflow-hidden isolate">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-red-50">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-6 h-6 mr-3 text-amber-600" />
          Community Discussion ({comments.length})
        </h3>
        <p className="text-sm text-gray-600 mt-2">Share your thoughts and connect with the community</p>
      </div>

      <div className="p-6 max-w-full overflow-hidden">
        {/* Comment form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment... (max 5000 characters)"
              maxLength={5000}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows="4"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">
                {newComment.length}/5000 characters
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting || newComment.length > 5000}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">Please log in to leave a comment</p>
            <button 
              onClick={handleLoginClick}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Log In
            </button>
          </div>
        )}

        {/* Comments list */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard 
                key={comment._id} 
                comment={comment}
                user={user}
                isAuthenticated={isAuthenticated}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                submitting={submitting}
                handleSubmitReply={handleSubmitReply}
                handleReaction={handleReaction}
                setComments={setComments}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-red-50 rounded-lg border-2 border-dashed border-amber-200">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No comments yet</h4>
            <p className="text-gray-600 mb-4">Be the first to share your thoughts with the community!</p>
            {!isAuthenticated && (
              <button 
                onClick={handleLoginClick}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Log In to Comment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
