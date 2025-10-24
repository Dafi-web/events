import React from 'react';
import { Link } from 'react-router-dom';

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Join Our Community</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl text-gray-600 mb-8">
            Ready to become part of the DafiTech community? Register to connect with fellow members worldwide.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;

