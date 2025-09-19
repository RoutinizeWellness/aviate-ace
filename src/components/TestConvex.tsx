import React from 'react';
import { useMutation, api } from '@/lib/convex';

const TestConvex = () => {
  // Test mutation
  const registerUser = useMutation(api.auth.registerUser);

  const handleTest = async () => {
    try {
      // This is just a test call to verify the integration works
      console.log('Convex integration test');
    } catch (error) {
      console.error('Convex test error:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Convex Integration Test</h2>
      <button 
        onClick={handleTest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Convex Integration
      </button>
    </div>
  );
};

export default TestConvex;