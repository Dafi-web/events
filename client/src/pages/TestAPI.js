import React, { useState } from 'react';
import api from '../utils/api';

const TestAPI = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('🧪 Testing API connection...');
      
      // Test 1: Health check
      const healthRes = await api.get('/health');
      console.log('✅ Health check:', healthRes.data);
      
      // Test 2: API info
      const apiRes = await api.get('/api');
      console.log('✅ API info:', apiRes.data);
      
      // Test 3: Login test
      const loginRes = await api.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login test:', loginRes.data);
      
      setResult('All tests passed! API is working correctly.');
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">API Test</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Open browser console (F12) to see detailed logs.</p>
          <p>This will test all API endpoints to identify the issue.</p>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;
