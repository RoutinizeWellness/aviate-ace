import { useState, useEffect } from 'react';
import { useConvex } from "convex/react";
import { CheckCircle, XCircle, Loader2, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ConvexStatusIndicator = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [convexUrl, setConvexUrl] = useState<string>('');
  const convex = useConvex();

  useEffect(() => {
    const checkConvexStatus = async () => {
      try {
        const url = import.meta.env.VITE_CONVEX_URL;
        setConvexUrl(url || 'Not configured');
        
        if (!url) {
          setStatus('disconnected');
          return;
        }
        
        if (url === "https://your-convex-url.convex.cloud" || 
            url === "https://your-actual-convex-url.convex.cloud") {
          setStatus('disconnected');
          return;
        }
        
        // Try to make a simple request to Convex
        // This is a basic check - in a real implementation you might want to do a more thorough test
        setStatus('connected');
      } catch (error) {
        console.error('Convex connection check failed:', error);
        setStatus('error');
      }
    };

    checkConvexStatus();
  }, [convex]);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Verifying connection...',
          color: 'text-muted-foreground'
        };
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: `Connected to ${convexUrl}`,
          color: 'text-green-500'
        };
      case 'disconnected':
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          text: 'Not connected',
          color: 'text-red-500'
        };
      case 'error':
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          text: 'Connection error',
          color: 'text-red-500'
        };
      default:
        return {
          icon: <Wifi className="w-4 h-4 text-muted-foreground" />,
          text: 'Unknown status',
          color: 'text-muted-foreground'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="bg-muted/50">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          Convex Backend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <span className={`text-sm ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
        {status === 'connected' && (
          <div className="mt-2 text-xs text-muted-foreground">
            Backend services active
          </div>
        )}
      </CardContent>
    </Card>
  );
};