import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppErrorHandler, ErrorCodes, type ErrorCode } from '@/utils/errorHandling';

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    fallbackCode: ErrorCode = ErrorCodes.NETWORK_ERROR,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      fallbackMessage,
      onError
    } = options;

    const appError = AppErrorHandler.handle(error, fallbackCode);
    
    if (showToast) {
      toast({
        title: "Error",
        description: fallbackMessage || appError.userMessage,
        variant: appError.severity === 'high' ? 'destructive' : 'default',
      });
    }

    if (onError) {
      onError(new Error(appError.message));
    }

    return appError;
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    fallbackCode: ErrorCode = ErrorCodes.NETWORK_ERROR,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, fallbackCode, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};