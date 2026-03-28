import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    courses: 'Courses',
    news: 'News',
    directory: 'Directory',
    tutorials: 'Tutorials',
    joinUs: 'Join Us',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',
    profile: 'Profile',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    
    // Home Page
    welcomeTitle: 'Welcome to DafiTech Super Academy',
    welcomeSubtitle: 'Connecting professionals worldwide through business, online courses, and learning',
    upcomingEvents: 'Upcoming Events',
    latestNews: 'Latest News',
    featuredCourses: 'Featured Courses',
    joinCommunity: 'Join Our Global Community',
    
    // About Page
    ourMission: 'Our Mission',
    ourVision: 'Our Vision',
    ourValues: 'Our Values',
    platformFeatures: 'Platform Features',
    
    // Events
    createEvent: 'Create Event',
    rsvpGoing: 'RSVP Going',
    rsvpMaybe: 'Maybe',
    eventDetails: 'Event Details',
    eventDate: 'Event Date',
    eventTime: 'Event Time',
    eventLocation: 'Location',
    attendees: 'Attendees',
    
    // Directory
    addBusiness: 'Add Business',
    businessName: 'Business Name',
    businessType: 'Business Type',
    category: 'Category',
    description: 'Description',
    contactInfo: 'Contact Information',
    verified: 'Verified',
    featured: 'Featured',
    
    // Tutorials
    enrollNow: 'Enroll Now',
    courseDetails: 'Course Details',
    instructor: 'Instructor',
    duration: 'Duration',
    price: 'Price',
    level: 'Level',
    subjects: 'Subjects',
    
    // Contact
    getInTouch: 'Get in Touch',
    sendMessage: 'Send Message',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    
    // Footer
    followUs: 'Follow Us',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    allRightsReserved: 'All rights reserved',
    
    // Admin
    dashboard: 'Dashboard',
    manageCourses: 'Manage Courses',
    manageUsers: 'Manage Users',
    manageNews: 'Manage News',
    manageDirectory: 'Manage Directory',
    manageTutorials: 'Manage Tutorials',
    approve: 'Approve',
    reject: 'Reject',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  },
  
  am: {
    // Navigation
    home: 'መነሻ',
    about: 'ስለ እኛ',
    courses: 'ኮርሶች',
    news: 'ዜና',
    directory: 'ዝርዝር',
    tutorials: 'ትምህርቶች',
    joinUs: 'ተቀላቀሉ',
    contact: 'አግኙን',
    login: 'ግባ',
    register: 'ተመዝግብ',
    logout: 'ውጣ',
    admin: 'አስተዳዳሪ',
    profile: 'መገለጫ',
    
    // Common
    loading: 'በመጫን ላይ...',
    error: 'ስህተት',
    success: 'ተሳክቷል',
    save: 'አስቀምጥ',
    cancel: 'ሰርዝ',
    delete: 'ሰርዝ',
    edit: 'አርትዖት',
    view: 'አይቅ',
    search: 'ፈልግ',
    filter: 'አጣራ',
    submit: 'ላክ',
    back: 'ተመለስ',
    next: 'ቀጣይ',
    previous: 'ቀዳሚ',
    close: 'ዝጋ',
    
    // Home Page
    welcomeTitle: 'ወደ DafiTech Super Academy እንኳን ደህና መጡ',
    welcomeSubtitle: 'በንግድ፣ በመስመር ላይ ኮርሶች እና በትምህርት በኩል ባለሙያዎችን በዓለም አቀፍ ደረጃ በማገናኘት',
    upcomingEvents: 'የሚመጡ መርሃ ግብሮች',
    latestNews: 'የቅርብ ጊዜ ዜና',
    featuredCourses: 'የተመረጡ ትምህርቶች',
    joinCommunity: 'የእኛን ዓለም አቀፍ ማህበረሰብ ይቀላቀሉ',
    
    // About Page
    ourMission: 'የእኛ ተልእኮ',
    ourVision: 'የእኛ ራዕይ',
    ourValues: 'የእኛ እሴቶች',
    platformFeatures: 'የመድረክ ባህሪያት',
    
    // Events
    createEvent: 'መርሃ ግብር ፍጠር',
    rsvpGoing: 'እሄዳለሁ',
    rsvpMaybe: 'ምናልባት',
    eventDetails: 'የመርሃ ግብር ዝርዝሮች',
    eventDate: 'የመርሃ ግብር ቀን',
    eventTime: 'የመርሃ ግብር ሰዓት',
    eventLocation: 'አካባቢ',
    attendees: 'ተሳታፊዎች',
    
    // Directory
    addBusiness: 'ንግድ ጨምር',
    businessName: 'የንግድ ስም',
    businessType: 'የንግድ አይነት',
    category: 'ምድብ',
    description: 'መግለጫ',
    contactInfo: 'የግንኙነት መረጃ',
    verified: 'ተረጋግጧል',
    featured: 'ተመረጠ',
    
    // Tutorials
    enrollNow: 'አሁን ተመዝግብ',
    courseDetails: 'የትምህርት ዝርዝሮች',
    instructor: 'አስተማሪ',
    duration: 'ጊዜ',
    price: 'ዋጋ',
    level: 'ደረጃ',
    subjects: 'ርዕሶች',
    
    // Contact
    getInTouch: 'አግኙን',
    sendMessage: 'መልዕክት ላክ',
    name: 'ስም',
    email: 'ኢሜይል',
    subject: 'ርዕስ',
    message: 'መልዕክት',
    
    // Footer
    followUs: 'እንከተለን',
    quickLinks: 'ፈጣን አገናኞች',
    contactInfo: 'የግንኙነት መረጃ',
    allRightsReserved: 'ሁሉም መብቶች የተጠበቁ ናቸው',
    
    // Admin
    dashboard: 'ዳሽቦርድ',
    manageCourses: 'ኮርሶችን አስተዳድር',
    manageUsers: 'ተጠቃሚዎችን አስተዳድር',
    manageNews: 'ዜናዎችን አስተዳድር',
    manageDirectory: 'ዝርዝርን አስተዳድር',
    manageTutorials: 'ትምህርቶችን አስተዳድር',
    approve: 'ፀድቅ',
    reject: 'አትቀበል',
    pending: 'በመጠባበቅ ላይ',
    approved: 'ፀድቋል',
    rejected: 'ተቀባይነት አላገኘም'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    return localStorage.getItem('dafitech-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('dafitech-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'am', name: 'አማርኛ', flag: '🇪🇹' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

