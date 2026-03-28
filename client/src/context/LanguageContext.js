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
    rejected: 'Rejected',

    // Auth & password (international)
    phone: 'Phone',
    forgotPassword: 'Forgot password?',
    forgotPasswordTitle: 'Reset your password',
    forgotPasswordHint: 'Enter your account email. If it exists, we will send a reset link (check spam).',
    sendResetLink: 'Send reset link',
    emailSentGeneric: 'If an account exists for this email, you will receive password reset instructions shortly.',
    resetPasswordTitle: 'Choose a new password',
    resetPasswordHint: 'Enter a new password (at least 6 characters).',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',
    saveNewPassword: 'Reset password',
    backToLogin: 'Back to sign in',
    changePasswordTitle: 'Change password',
    changePasswordHint: 'Use your current password, then choose a new one. Works for all accounts including admins.',
    currentPassword: 'Current password',
    updatePassword: 'Update password',
    passwordChangedSuccess: 'Your password was updated successfully.',
    passwordResetSuccess: 'Your password was reset. You can sign in now.',
    signInTitle: 'Sign in to your account',
    signInOr: 'Or',
    createNewAccount: 'create a new account',
    rememberMe: 'Remember me',
    signingIn: 'Signing in…',
    errInvalidCurrentPassword: 'Current password is incorrect.',
    errExpiredToken: 'This link is invalid or has expired. Request a new reset.',
    errServer: 'Something went wrong. Please try again.',
    errPasswordMin: 'Password must be at least 6 characters.',
    passwordsMustMatch: 'Passwords must match.',
    errValidEmail: 'Please enter a valid email address.',
    errTokenRequired: 'Reset link is invalid. Open the link from your email.',
    errCurrentPasswordRequired: 'Please enter your current password.',
    password: 'Password'
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
    rejected: 'ተቀባይነት አላገኘም',

    phone: 'ስልክ',
    forgotPassword: 'የይለፍ ቃል ረሳሁ?',
    forgotPasswordTitle: 'የይለፍ ቃል ዳግም ያስጀምሩ',
    forgotPasswordHint: 'የመለያዎን ኢሜይል ያስገቡ። ካለ ዳግም ማስጀመሪያ አገናኝ እንላካለን።',
    sendResetLink: 'አገናኝ ላክ',
    emailSentGeneric: 'ለዚህ ኢሜይል መለያ ካለ፣ የይለፍ ቃል ማስጀመሪያ መመሪያዎችን እንላካለን።',
    resetPasswordTitle: 'አዲስ የይለፍ ቃል ይምረጡ',
    resetPasswordHint: 'ቢያንስ 6 ቁምፊ ላይታይ ያስገቡ።',
    newPassword: 'አዲስ የይለፍ ቃል',
    confirmNewPassword: 'አዲስ የይለፍ ቃል ያረጋግጡ',
    saveNewPassword: 'የይለፍ ቃል ያስገቡ',
    backToLogin: 'ወደ መግቢያ ተመለስ',
    changePasswordTitle: 'የይለፍ ቃል ቀይር',
    changePasswordHint: 'የአሁኑን የይለፍ ቃል ማስገባት፣ ከዚያ አዲስ ይምረጡ። ለአስተዳዳሪም ይሰራል።',
    currentPassword: 'የአሁን የይለፍ ቃል',
    updatePassword: 'የይለፍ ቃል አዘምን',
    passwordChangedSuccess: 'የይለፍ ቃልዎ ተሻሽሏል።',
    passwordResetSuccess: 'የይለፍ ቃልዎ ተቀይሯል። አሁን ይግቡ።',
    signInTitle: 'ወደ መለያዎ ይግቡ',
    signInOr: 'ወይም',
    createNewAccount: 'አዲስ መለያ ይፍጠሩ',
    rememberMe: 'አስታውሰኝ',
    signingIn: 'በመግባት ላይ…',
    errInvalidCurrentPassword: 'የአሁኑ የይለፍ ቃል ትክክል አይደለም።',
    errExpiredToken: 'አገናኙ ልክ አይደለም ወይም ጊዜ አልፏል። እንደገና ይጠይቁ።',
    errServer: 'ስህተት ተፈጥሯል። እንደገና ይሞክሩ።',
    errPasswordMin: 'የይለፍ ቃል ቢያንስ 6 ቁምፊ ላይታይ ይሁን።',
    passwordsMustMatch: 'የይለፍ ቃሎች አንድ ይሁኑ።',
    errValidEmail: 'ትክክለኛ ኢሜይል ያስገቡ።',
    errTokenRequired: 'የማስጀመሪያ አገናኝ ልክ አይደለም። ከኢሜይልዎ ይክፈቱ።',
    errCurrentPasswordRequired: 'የአሁኑን የይለፍ ቃል ያስገቡ።',
    password: 'የይለፍ ቃል'
  },

  fr: {
    home: 'Accueil',
    about: 'À propos',
    courses: 'Cours',
    news: 'Actualités',
    directory: 'Annuaire',
    tutorials: 'Tutoriels',
    joinUs: 'Nous rejoindre',
    contact: 'Contact',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    admin: 'Admin',
    profile: 'Profil',
    loading: 'Chargement…',
    error: 'Erreur',
    success: 'Succès',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    submit: 'Envoyer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    close: 'Fermer',
    phone: 'Téléphone',
    forgotPassword: 'Mot de passe oublié ?',
    forgotPasswordTitle: 'Réinitialiser le mot de passe',
    forgotPasswordHint: 'Saisissez l’e-mail du compte. Si un compte existe, nous enverrons un lien (vérifiez les spams).',
    sendResetLink: 'Envoyer le lien',
    emailSentGeneric: 'Si un compte existe pour cet e-mail, vous recevrez les instructions sous peu.',
    resetPasswordTitle: 'Choisir un nouveau mot de passe',
    resetPasswordHint: 'Au moins 6 caractères.',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le mot de passe',
    saveNewPassword: 'Réinitialiser',
    backToLogin: 'Retour à la connexion',
    changePasswordTitle: 'Changer le mot de passe',
    changePasswordHint: 'Saisissez l’ancien mot de passe puis le nouveau. Valable pour tous les comptes, y compris les administrateurs.',
    currentPassword: 'Mot de passe actuel',
    updatePassword: 'Mettre à jour',
    passwordChangedSuccess: 'Mot de passe mis à jour.',
    passwordResetSuccess: 'Mot de passe réinitialisé. Vous pouvez vous connecter.',
    signInTitle: 'Connexion à votre compte',
    signInOr: 'Ou',
    createNewAccount: 'créer un compte',
    rememberMe: 'Se souvenir de moi',
    signingIn: 'Connexion…',
    errInvalidCurrentPassword: 'Mot de passe actuel incorrect.',
    errExpiredToken: 'Lien invalide ou expiré. Demandez un nouveau lien.',
    errServer: 'Une erreur s’est produite. Réessayez.',
    errPasswordMin: 'Le mot de passe doit contenir au moins 6 caractères.',
    passwordsMustMatch: 'Les mots de passe doivent correspondre.',
    errValidEmail: 'Veuillez saisir une adresse e-mail valide.',
    errTokenRequired: 'Lien invalide. Ouvrez le lien reçu par e-mail.',
    errCurrentPasswordRequired: 'Saisissez votre mot de passe actuel.',
    password: 'Mot de passe'
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
    return translations[language]?.[key] ?? translations.en?.[key] ?? key;
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
      { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

