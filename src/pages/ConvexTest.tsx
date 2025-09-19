import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ConvexTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  
  // Test query
  const testQuery = useQuery(api.auth.getUser, { userId: "test" } as any);
  
  // Test mutation
  const [testMutation] = useMutation(api.auth.loginUser);
  
  useEffect(() => {
    console.log("Convex Test Page Loaded");
    console.log("Environment VITE_CONVEX_URL:", import.meta.env.VITE_CONVEX_URL);
  }, []);
  
  const runTest = async () => {
    setIsTesting(true);
    setTestResult('Testing Convex connectivity...');
    
    try {
      // Test 1: Check environment variable
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      if (!convexUrl) {
        throw new Error("VITE_CONVEX_URL is not set");
      }
      
      setTestResult(`Convex URL: ${convexUrl}`);
      
      // Test 2: Try a simple mutation
      try {
        console.log("Testing Convex mutation...");
        const result = await testMutation({ email: "test@example.com" });
        setTestResult(prev => prev + `\n✅ Mutation test successful: ${JSON.stringify(result)}`);
      } catch (mutationError) {
        console.warn("Mutation test failed:", mutationError);
        setTestResult(prev => prev + `\n⚠️ Mutation test failed: ${mutationError.message}`);
      }
      
    } catch (error) {
      console.error("Convex test failed:", error);
      setTestResult(`❌ Convex test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Convex Connection Test</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <p className="mb-2"><strong>VITE_CONVEX_URL:</strong> {import.meta.env.VITE_CONVEX_URL || 'Not set'}</p>
          <p className="mb-2"><strong>Node Environment:</strong> {import.meta.env.MODE || 'Not set'}</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          <button 
            onClick={runTest}
            disabled={isTesting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Run Connection Test'}
          </button>
          
          {testResult && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p className="mb-2">Check the browser console for detailed logs.</p>
          <p className="mb-2">If Convex is not connecting, verify that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>VITE_CONVEX_URL is set correctly in environment variables</li>
            <li>The Convex deployment is active</li>
            <li>There are no network connectivity issues</li>
            <li>The browser is not blocking requests to the Convex domain</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConvexTest;