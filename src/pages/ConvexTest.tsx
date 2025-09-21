import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TestConvexConnection } from '@/components/TestConvexConnection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ConvexTest = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Convex Connection Test</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
          <TestConvexConnection />
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Convex Database Status</h3>
          <p className="mb-3">
            If Convex is properly connected, you should see success messages above indicating that 
            questions are being loaded from the Convex database.
          </p>
          <p className="mb-3">
            We've already seeded the database with {120} questions using the command:
          </p>
          <code className="bg-gray-800 text-green-400 p-3 rounded block mb-3">
            npx convex run seedQuestions:seedRealAviationQuestions
          </code>
          <p>
            If you're still seeing the "Convex not available" fallback message, try refreshing the page 
            or checking that the VITE_CONVEX_URL environment variable is properly set.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConvexTest;