/**
 * Performance monitoring utilities for the aviation training platform
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isEnabled: boolean;

  constructor() {
    // Enable performance monitoring in development or when explicitly enabled
    this.isEnabled = import.meta.env.DEV || 
                    localStorage.getItem('enablePerformanceMonitoring') === 'true';
  }

  /**
   * Start measuring performance for a given operation
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };

    this.metrics.set(name, metric);
  }

  /**
   * End measuring performance for a given operation
   */
  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log performance in development
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name}: ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }

    // Send to analytics in production (if configured)
    if (import.meta.env.PROD && metric.duration > 1000) {
      this.reportSlowOperation(metric);
    }

    return metric.duration;
  }

  /**
   * Measure an async operation
   */
  async measure<T>(name: string, operation: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await operation();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Measure a synchronous operation
   */
  measureSync<T>(name: string, operation: () => T, metadata?: Record<string, any>): T {
    this.start(name, metadata);
    try {
      const result = operation();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Report slow operations to analytics
   */
  private reportSlowOperation(metric: PerformanceMetric): void {
    // In a real application, you would send this to your analytics service
    console.warn(`Slow operation detected: ${metric.name} took ${metric.duration}ms`);
    
    // Example: Send to analytics service
    // analytics.track('slow_operation', {
    //   operation: metric.name,
    //   duration: metric.duration,
    //   metadata: metric.metadata
    // });
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring React component render performance
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const name = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent = React.memo<P>((props: P) => {
    const renderStart = React.useRef<number>();
    
    // Measure render start
    renderStart.current = performance.now();
    
    // Measure render end
    React.useEffect(() => {
      if (renderStart.current) {
        const duration = performance.now() - renderStart.current;
        if (import.meta.env.DEV && duration > 16) { // Warn if render takes more than 16ms
          console.warn(`🐌 Slow render: ${name} took ${duration.toFixed(2)}ms`);
        }
      }
    });
    
    return React.createElement(Component, props);
  });
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${name})`;
  return WrappedComponent as React.ComponentType<P>;
}

/**
 * Hook for measuring component lifecycle performance
 */
export function usePerformanceMonitoring(componentName: string) {
  const mountTime = React.useRef<number>();
  
  React.useEffect(() => {
    mountTime.current = performance.now();
    performanceMonitor.start(`${componentName}_mount`);
    
    return () => {
      performanceMonitor.end(`${componentName}_mount`);
    };
  }, [componentName]);
  
  const measureOperation = React.useCallback(
    <T>(operationName: string, operation: () => T): T => {
      return performanceMonitor.measureSync(`${componentName}_${operationName}`, operation);
    },
    [componentName]
  );
  
  const measureAsyncOperation = React.useCallback(
    <T>(operationName: string, operation: () => Promise<T>): Promise<T> => {
      return performanceMonitor.measure(`${componentName}_${operationName}`, operation);
    },
    [componentName]
  );
  
  return {
    measureOperation,
    measureAsyncOperation
  };
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  static getMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }
  
  static logMemoryUsage(label: string): void {
    const memory = this.getMemoryUsage();
    if (memory && import.meta.env.DEV) {
      console.log(`🧠 Memory (${label}):`, {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
      });
    }
  }
  
  static isMemoryPressureHigh(): boolean {
    const memory = this.getMemoryUsage();
    if (!memory) return false;
    
    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    return usageRatio > 0.8; // Consider high if using more than 80% of available memory
  }
}

// Export React import for the decorator
import React from 'react';