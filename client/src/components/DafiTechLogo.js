import React from 'react';

const DafiTechLogo = ({ className = "", size = "h-8", showName = true, animated = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Image */}
      <div className={`${size} w-auto flex items-center ${animated ? 'animate-logo-bounce-rotate' : ''}`} style={animated ? { animationDuration: '2.5s' } : {}}>
        <img 
          src="/logos/dafitech-logo.png" 
          alt="DafiTech Super Academy" 
          className={`h-full w-auto object-contain ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}`}
          onError={(e) => {
            // Fallback to CSS logo if image not found
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Fallback CSS Logo */}
        <div className="hidden">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-800 rounded-l-full flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 bg-orange-500 rounded-l-full flex items-center justify-center animate-pulse" style={{animationDelay: '0.5s'}}>
                <div className="w-1 h-4 bg-blue-800 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Name */}
      {showName && (
        <div
          className={`flex flex-col leading-tight ${animated ? 'animate-fade-in-up' : ''}`}
          style={animated ? { animationDelay: '0.5s' } : {}}
        >
          <span className="inline-flex flex-wrap items-baseline gap-x-0.5">
            <span
              className={`text-blue-800 font-bold text-xs sm:text-sm ${animated ? 'animate-color-shift hover:text-blue-600 transition-colors duration-300' : ''}`}
              style={animated ? { animationDelay: '1s' } : {}}
            >
              Dafi
            </span>
            <span
              className={`text-orange-500 font-bold text-xs sm:text-sm ${animated ? 'animate-color-shift-orange hover:text-orange-400 transition-colors duration-300' : ''}`}
              style={animated ? { animationDelay: '1.1s' } : {}}
            >
              Tech
            </span>
            <span
              className={`text-slate-700 font-bold text-xs sm:text-sm tracking-tight ${animated ? '' : ''}`}
            >
              {' '}
              Super Academy
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default DafiTechLogo;