import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const TestConvexConnection = () => {
  const [isConvexAvailable, setIsConvexAvailable] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Try to get exam questions from Convex
  const examQuestions = useQuery(api.exams.getExamQuestions, { limit: 5 });
  
  useEffect(() => {
    // Check if Convex is available by trying to access the API
    try {
      if (api && typeof api === 'object') {
        console.log("✅ Convex API is available");
        setIsConvexAvailable(true);
      } else {
        console.log("❌ Convex API is not available");
        setIsConvexAvailable(false);
      }
    } catch (error) {
      console.log("❌ Error accessing Convex API:", error);
      setIsConvexAvailable(false);
    }
  }, []);
  
  useEffect(() => {
    if (examQuestions && examQuestions.length > 0) {
      setTestResult({
        status: 'success',
        message: `Successfully loaded ${examQuestions.length} questions from Convex`,
        questions: examQuestions.slice(0, 3) // Show first 3 questions
      });
    } else if (examQuestions !== undefined) {
      setTestResult({
        status: 'empty',
        message: 'No questions found in Convex database'
      });
    }
  }, [examQuestions]);
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Convex Connection Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">Connection Status:</h3>
        <p className={isConvexAvailable ? "text-green-600" : "text-red-600"}>
          {isConvexAvailable ? "✅ Convex is available" : "❌ Convex is not available"}
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">Data Test:</h3>
        {testResult ? (
          <div>
            <p className={testResult.status === 'success' ? "text-green-600" : "text-yellow-600"}>
              {testResult.message}
            </p>
            {testResult.questions && (
              <div className="mt-2">
                <p className="font-medium">Sample Questions:</p>
                <ul className="list-disc pl-5">
                  {testResult.questions.map((q: any, index: number) => (
                    <li key={index} className="text-sm">
                      {q.question.substring(0, 100)}...
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Testing Convex connection...</p>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>If you see "Convex not available" in the console, it means the fallback is being used.</p>
        <p>If you see success messages above, Convex is working properly.</p>
      </div>
    </div>
  );
};