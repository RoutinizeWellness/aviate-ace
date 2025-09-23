/**
 * Debug utilities for development logging
 */

const isDevelopment = import.meta.env.DEV;

export const debugLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
};

export const debugWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn('[DEBUG WARN]', ...args);
  }
};

export const debugError = (...args: any[]) => {
  if (isDevelopment) {
    console.error('[DEBUG ERROR]', ...args);
  }
};