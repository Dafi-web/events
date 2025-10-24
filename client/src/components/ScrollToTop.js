import React, { useState, useEffect } from 'react';
import { ChevronUp, ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button when page is scrolled down 300px and track scroll progress
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50 group">
          {/* Progress Ring */}
          <div className="relative w-14 h-14 mb-2">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="rgba(251, 191, 36, 0.2)"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-150 ease-out"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Main Button */}
          <button
            onClick={scrollToTop}
            className="absolute bottom-0 right-0 w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-amber-300 group-hover:scale-105"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 mx-auto transition-transform duration-300 group-hover:scale-110" />
          </button>

          {/* Floating particles effect on hover */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1 left-1 w-1 h-1 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
