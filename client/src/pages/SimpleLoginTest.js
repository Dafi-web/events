import React, { useState } from 'react';

const SimpleLoginTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      console.log('🧪 Starting simple login test...');
      
      // Direct fetch request (bypassing axios)
      const response = await fetch('https://events-6m8q.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      
      if (response.ok) {
        setResult(`✅ Login successful! Token: ${data.token.substring(0, 20)}...`);
      } else {
        setResult(`❌ Login failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setResult(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithAxios = async () => {
    setLoading(true);
    setResult('Testing with axios...');
    
    try {
      console.log('🧪 Starting axios test...');
      
      // Import axios dynamically
      const axios = (await import('../utils/api')).default;
      
      const response = await axios.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      
      console.log('📡 Axios response:', response.data);
      setResult(`✅ Axios login successful! Token: ${response.data.token.substring(0, 20)}...`);
    } catch (error) {
      console.error('❌ Axios error:', error);
      setResult(`❌ Axios error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Simple Login Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test with Fetch API'}
          </button>
          
          <button
            onClick={testWithAxios}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test with Axios'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Open browser console (F12) to see detailed logs.</p>
          <p>This tests both fetch and axios to identify the issue.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginTest;
