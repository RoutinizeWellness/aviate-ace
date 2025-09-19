import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GrantAdminAccess: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  
  const forceGrantAdminAccess = useMutation(api.auth.forceGrantAdminAccess);

  const handleGrantAccess = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await forceGrantAdminAccess({});
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'Error granting admin access' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="surface-mid border-border/50 max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Grant Admin Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This tool will grant admin privileges to the user with email "tiniboti@gmail.com".
        </p>
        
        <Button 
          onClick={handleGrantAccess} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Granting Access...' : 'Grant Admin Access'}
        </Button>
        
        {result && (
          <div className={`p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">{result.success ? 'Success!' : 'Error:'}</p>
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};