import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { TestConvexConnection } from '../components/TestConvexConnection';

export const ComprehensiveConvexTest = () => {
  const [isUsingConvex, setIsUsingConvex] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  
  // Test Convex query
  const examQuestions = useQuery(api.exams.getExamQuestions, { limit: 10 });
  
  useEffect(() => {
    // Check if we're using Convex by testing the API
    try {
      if (api && typeof api === 'object' && api.exams && api.exams.getExamQuestions) {
        console.log('✅ Convex API detected');
        setIsUsingConvex(true);
      } else {
        console.log('❌ Convex API not detected');
        setIsUsingConvex(false);
      }
    } catch (error) {
      console.log('❌ Error accessing Convex API:', error);
      setIsUsingConvex(false);
    }
  }, []);
  
  useEffect(() => {
    if (examQuestions !== undefined) {
      setTestResults({
        status: 'loaded',
        count: examQuestions?.length || 0,
        sample: examQuestions?.slice(0, 3) || []
      });
    }
  }, [examQuestions]);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Convex Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <TestConvexConnection />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Convex Usage Test</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Are we using Convex?</h3>
            {isUsingConvex === null ? (
              <p className="text-gray-500">Checking...</p>
            ) : isUsingConvex ? (
              <p className="text-green-600 font-medium">✅ Yes, using Convex database</p>
            ) : (
              <p className="text-red-600 font-medium">❌ No, using fallback</p>
            )}
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium">Data Loading Test</h3>
            {testResults ? (
              <div>
                <p className={`font-medium ${testResults.count > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                  Loaded {testResults.count} questions from {testResults.count > 0 ? 'Convex' : 'fallback'}
                </p>
                {testResults.sample.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Sample Questions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {testResults.sample.map((q: any, index: number) => (
                        <li key={index} className="text-sm">
                          {q.question.substring(0, 80)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Loading data...</p>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If you see "Convex not available, using fallback" in the browser console, 
              it means the application is still using static data instead of Convex.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};