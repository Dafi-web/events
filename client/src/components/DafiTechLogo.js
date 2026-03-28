import React from 'react';

const DafiTechLogo = ({ className = "", size = "h-8", showName = true, animated = true }) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 min-w-0 ${className}`}>
      {/* Logo Image */}
      <div className={`${size} w-auto shrink-0 flex items-center ${animated ? 'animate-logo-bounce-rotate' : ''}`} style={animated ? { animationDuration: '2.5s' } : {}}>
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
          className={`flex flex-col leading-none min-w-0 max-w-[11rem] sm:max-w-none ${animated ? 'animate-fade-in-up' : ''}`}
          style={animated ? { animationDelay: '0.5s' } : {}}
        >
          <span className="flex items-baseline gap-0 flex-wrap">
            <span
              className={`text-blue-800 font-bold text-sm sm:text-base ${animated ? 'animate-color-shift hover:text-blue-600 transition-colors duration-300' : ''}`}
              style={animated ? { animationDelay: '1s' } : {}}
            >
              Dafi
            </span>
            <span
              className={`text-orange-500 font-bold text-sm sm:text-base ${animated ? 'animate-color-shift-orange hover:text-orange-400 transition-colors duration-300' : ''}`}
              style={animated ? { animationDelay: '1.1s' } : {}}
            >
              Tech
            </span>
          </span>
          <span className="text-slate-700 font-semibold text-[10px] sm:text-xs tracking-tight mt-0.5 leading-tight">
            Super Academy
          </span>
        </div>
      )}
    </div>
  );
};

export default DafiTechLogo;