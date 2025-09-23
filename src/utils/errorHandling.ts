import { toast } from '@/hooks/use-toast';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  context?: Record<string, any>;
  recoverable: boolean;
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONVEX_CONNECTION_FAILED: 'CONVEX_CONNECTION_FAILED',
  QUESTION_LOAD_FAILED: 'QUESTION_LOAD_FAILED',
  EXAM_START_FAILED: 'EXAM_START_FAILED',
  EXAM_SUBMIT_FAILED: 'EXAM_SUBMIT_FAILED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATA_CORRUPTION: 'DATA_CORRUPTION',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

const errorMessages: Record<ErrorCode, Omit<AppError, 'timestamp' | 'context'>> = {
  [ErrorCodes.NETWORK_ERROR]: {
    code: ErrorCodes.NETWORK_ERROR,
    message: 'Network connection failed',
    userMessage: 'Problema de conexión. Verifica tu conexión a internet e intenta de nuevo.',
    severity: 'medium',
    recoverable: true
  },
  [ErrorCodes.CONVEX_CONNECTION_FAILED]: {
    code: ErrorCodes.CONVEX_CONNECTION_FAILED,
    message: 'Failed to connect to Convex backend',
    userMessage: 'No se pudo conectar al servidor. Usando modo sin conexión.',
    severity: 'low',
    recoverable: true
  },
  [ErrorCodes.QUESTION_LOAD_FAILED]: {
    code: ErrorCodes.QUESTION_LOAD_FAILED,
    message: 'Failed to load questions',
    userMessage: 'Error al cargar las preguntas. Intenta recargar la página.',
    severity: 'high',
    recoverable: true
  },
  [ErrorCodes.EXAM_START_FAILED]: {
    code: ErrorCodes.EXAM_START_FAILED,
    message: 'Failed to start exam session',
    userMessage: 'No se pudo iniciar el examen. Intenta de nuevo.',
    severity: 'medium',
    recoverable: true
  },
  [ErrorCodes.EXAM_SUBMIT_FAILED]: {
    code: ErrorCodes.EXAM_SUBMIT_FAILED,
    message: 'Failed to submit exam',
    userMessage: 'Error al enviar el examen. Tus respuestas se han guardado localmente.',
    severity: 'high',
    recoverable: true
  },
  [ErrorCodes.AUTHENTICATION_FAILED]: {
    code: ErrorCodes.AUTHENTICATION_FAILED,
    message: 'Authentication failed',
    userMessage: 'Error de autenticación. Por favor, inicia sesión de nuevo.',
    severity: 'high',
    recoverable: true
  },
  [ErrorCodes.VALIDATION_ERROR]: {
    code: ErrorCodes.VALIDATION_ERROR,
    message: 'Validation error',
    userMessage: 'Los datos proporcionados no son válidos.',
    severity: 'medium',
    recoverable: true
  },
  [ErrorCodes.PERMISSION_DENIED]: {
    code: ErrorCodes.PERMISSION_DENIED,
    message: 'Permission denied',
    userMessage: 'No tienes permisos para realizar esta acción.',
    severity: 'medium',
    recoverable: false
  },
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: {
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
    message: 'Rate limit exceeded',
    userMessage: 'Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.',
    severity: 'medium',
    recoverable: true
  },
  [ErrorCodes.DATA_CORRUPTION]: {
    code: ErrorCodes.DATA_CORRUPTION,
    message: 'Data corruption detected',
    userMessage: 'Se detectó un problema con los datos. Contacta al soporte técnico.',
    severity: 'high',
    recoverable: false
  },
  [ErrorCodes.TIMEOUT_ERROR]: {
    code: ErrorCodes.TIMEOUT_ERROR,
    message: 'Operation timed out',
    userMessage: 'La operación tardó demasiado. Intenta de nuevo.',
    severity: 'medium',
    recoverable: true
  }
};

export class AppErrorHandler {
  static handle(error: unknown, fallbackCode: ErrorCode = ErrorCodes.NETWORK_ERROR): AppError {
    let appError: Omit<AppError, 'timestamp' | 'context'>;
    
    if (error instanceof Error) {
      // Try to match known error patterns
      if (error.message.includes('network') || error.message.includes('fetch')) {
        appError = errorMessages[ErrorCodes.NETWORK_ERROR];
      } else if (error.message.includes('convex') || error.message.includes('backend')) {
        appError = errorMessages[ErrorCodes.CONVEX_CONNECTION_FAILED];
      } else if (error.message.includes('question')) {
        appError = errorMessages[ErrorCodes.QUESTION_LOAD_FAILED];
      } else if (error.message.includes('timeout')) {
        appError = errorMessages[ErrorCodes.TIMEOUT_ERROR];
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        appError = errorMessages[ErrorCodes.PERMISSION_DENIED];
      } else {
        appError = errorMessages[fallbackCode];
      }
    } else {
      appError = errorMessages[fallbackCode];
    }
    
    // Create full AppError with timestamp and context
    const fullError: AppError = {
      ...appError,
      timestamp: Date.now(),
      context: {
        originalError: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }
    };
    
    // Log the actual error for debugging
    console.error('AppError:', {
      code: fullError.code,
      originalError: error,
      message: fullError.message,
      context: fullError.context
    });
    
    return fullError;
  }
  
  static showToast(error: AppError): void {
    toast({
      title: "Error",
      description: error.userMessage,
      variant: error.severity === 'high' ? 'destructive' : 'default',
    });
  }
  
  static handleAndShow(error: unknown, fallbackCode?: ErrorCode): AppError {
    const appError = this.handle(error, fallbackCode);
    this.showToast(appError);
    return appError;
  }
}