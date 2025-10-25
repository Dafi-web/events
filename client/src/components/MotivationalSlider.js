import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const MotivationalSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const motivationalMessages = [
    {
      id: 1,
      message: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Success"
    },
    {
      id: 2,
      message: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams"
    },
    {
      id: 3,
      message: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      category: "Innovation"
    },
    {
      id: 4,
      message: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Passion"
    },
    {
      id: 5,
      message: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
      category: "Education"
    },
    {
      id: 6,
      message: "Your limitation—it's only your imagination.",
      author: "Unknown",
      category: "Motivation"
    },
    {
      id: 7,
      message: "Great things never come from comfort zones.",
      author: "Unknown",
      category: "Growth"
    },
    {
      id: 8,
      message: "Dream it. Wish it. Do it.",
      author: "Unknown",
      category: "Action"
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === motivationalMessages.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [motivationalMessages.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === motivationalMessages.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? motivationalMessages.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-200/30 to-purple-200/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-blue-600">Daily</span> <span className="text-purple-600">Inspiration</span>
            </h2>
            <Star className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fuel your journey with words that inspire, motivate, and empower
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          {/* Main Slide */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 min-h-[300px] flex items-center">
            <div className="w-full text-center">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Message */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-6">
                "{motivationalMessages[currentSlide].message}"
              </blockquote>

              {/* Author */}
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-700">
                  — {motivationalMessages[currentSlide].author}
                </p>
                <span className="inline-block mt-2 px-4 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
                  {motivationalMessages[currentSlide].category}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous message"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next message"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {motivationalMessages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / motivationalMessages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationalSlider;
