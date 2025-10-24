const Analytics = require('../models/Analytics');
const { body, validationResult } = require('express-validator');

// Middleware to track page views and user actions
const trackAnalytics = (event, options = {}) => {
  return async (req, res, next) => {
    try {
      // Skip tracking for admin routes or if disabled
      if (process.env.DISABLE_ANALYTICS === 'true' || req.path.startsWith('/admin')) {
        return next();
      }

      // Extract user information
      const userId = req.user?.id || null;
      
      // Extract device information from user agent
      const userAgent = req.get('User-Agent') || '';
      const device = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);
      const os = getOS(userAgent);

      // Extract location information (basic)
      const ipAddress = req.ip || req.connection.remoteAddress;
      const location = await getLocationFromIP(ipAddress);

      // Prepare analytics data
      const analyticsData = {
        event,
        user: userId,
        sessionId: req.sessionID,
        page: req.path,
        location,
        device,
        browser,
        os,
        ipAddress,
        userAgent,
        metadata: {
          method: req.method,
          ...options.metadata
        }
      };

      // Add resource information if available
      if (options.resourceId && options.resourceModel) {
        analyticsData.resource = options.resourceId;
        analyticsData.resourceModel = options.resourceModel;
      }

      // Track the event (async, don't wait)
      Analytics.track(analyticsData);

    } catch (error) {
      console.error('Analytics middleware error:', error);
      // Don't break the request flow
    }

    next();
  };
};

// Helper function to determine device type
const getDeviceType = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Helper function to determine browser
const getBrowser = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  if (ua.includes('opera')) return 'Opera';
  return 'Unknown';
};

// Helper function to determine OS
const getOS = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios')) return 'iOS';
  return 'Unknown';
};

// Helper function to get location from IP (basic implementation)
const getLocationFromIP = async (ip) => {
  // This is a basic implementation
  // In production, you might want to use a service like MaxMind or IPinfo
  try {
    // For now, return basic info
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC'
    };
  } catch (error) {
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC'
    };
  }
};

// Specific tracking middleware functions
const trackPageView = (page) => trackAnalytics('page_view', { metadata: { page } });
const trackUserRegister = trackAnalytics('user_register');
const trackUserLogin = trackAnalytics('user_login');
const trackEventRSVP = trackAnalytics('event_rsvp');
const trackDirectoryView = trackAnalytics('directory_view');
const trackDirectorySubmit = trackAnalytics('directory_submit');
const trackTutorialEnroll = trackAnalytics('tutorial_enroll');
const trackContactForm = trackAnalytics('contact_form');
const trackSearch = trackAnalytics('search_performed');
const trackProfileView = trackAnalytics('profile_view');

module.exports = {
  trackAnalytics,
  trackPageView,
  trackUserRegister,
  trackUserLogin,
  trackEventRSVP,
  trackDirectoryView,
  trackDirectorySubmit,
  trackTutorialEnroll,
  trackContactForm,
  trackSearch,
  trackProfileView
};
