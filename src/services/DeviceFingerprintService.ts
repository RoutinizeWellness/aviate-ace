import { useLanguage } from '@/contexts/LanguageContext';

interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  plugins: string[];
  canvas: string;
  webgl: string;
  createdAt: number;
}

interface DeviceRegistration {
  userId: string;
  deviceFingerprint: DeviceFingerprint;
  registeredAt: number;
  lastAccessAt: number;
  isActive: boolean;
}

export class DeviceFingerprintService {
  private static readonly STORAGE_KEY = 'device_registration';
  private static readonly FINGERPRINT_KEY = 'device_fingerprint';

  /**
   * Generates a comprehensive device fingerprint
   */
  static async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    const canvas = await this.getCanvasFingerprint();
    const webgl = await this.getWebGLFingerprint();
    const plugins = this.getPluginFingerprint();

    const fingerprint: DeviceFingerprint = {
      id: this.generateFingerprintId(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      plugins,
      canvas,
      webgl,
      createdAt: Date.now(),
    };

    return fingerprint;
  }

  /**
   * Registers a device for a user
   */
  static async registerDevice(userId: string): Promise<DeviceRegistration> {
    const fingerprint = await this.generateDeviceFingerprint();
    
    const registration: DeviceRegistration = {
      userId,
      deviceFingerprint: fingerprint,
      registeredAt: Date.now(),
      lastAccessAt: Date.now(),
      isActive: true,
    };

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(registration));
    localStorage.setItem(this.FINGERPRINT_KEY, JSON.stringify(fingerprint));

    return registration;
  }

  /**
   * Validates if current device matches registered device for user
   */
  static async validateDevice(userId: string): Promise<{
    isValid: boolean;
    reason?: string;
    similarity: number;
  }> {
    try {
      const storedRegistration = localStorage.getItem(this.STORAGE_KEY);
      
      if (!storedRegistration) {
        return {
          isValid: false,
          reason: 'No device registered',
          similarity: 0,
        };
      }

      const registration: DeviceRegistration = JSON.parse(storedRegistration);
      
      // Check if registration is for the same user
      if (registration.userId !== userId) {
        return {
          isValid: false,
          reason: 'Device registered to different user',
          similarity: 0,
        };
      }

      // Generate current fingerprint
      const currentFingerprint = await this.generateDeviceFingerprint();
      
      // Compare fingerprints
      const similarity = this.calculateSimilarity(
        registration.deviceFingerprint,
        currentFingerprint
      );

      // Device is valid if similarity is above threshold (80%)
      const isValid = similarity >= 0.8;

      if (isValid) {
        // Update last access time
        registration.lastAccessAt = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(registration));
      }

      return {
        isValid,
        reason: isValid ? undefined : 'Device fingerprint mismatch',
        similarity,
      };

    } catch (error) {
      console.error('Error validating device:', error);
      return {
        isValid: false,
        reason: 'Validation error',
        similarity: 0,
      };
    }
  }

  /**
   * Updates device registration for user (when switching devices)
   */
  static async updateDeviceRegistration(userId: string): Promise<DeviceRegistration> {
    // Clear existing registration
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
    
    // Register new device
    return await this.registerDevice(userId);
  }

  /**
   * Gets registered device info for user
   */
  static getRegisteredDevice(): DeviceRegistration | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting registered device:', error);
      return null;
    }
  }

  /**
   * Clears device registration (logout)
   */
  static clearDeviceRegistration(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
  }

  /**
   * Calculates similarity between two fingerprints
   */
  private static calculateSimilarity(fp1: DeviceFingerprint, fp2: DeviceFingerprint): number {
    let matches = 0;
    let total = 0;

    // Critical matches (high weight)
    const criticalFields = ['userAgent', 'screenResolution', 'platform'];
    criticalFields.forEach(field => {
      total += 3; // High weight
      if (fp1[field] === fp2[field]) {
        matches += 3;
      }
    });

    // Important matches (medium weight)
    const importantFields = ['timezone', 'language', 'canvas', 'webgl'];
    importantFields.forEach(field => {
      total += 2; // Medium weight
      if (fp1[field] === fp2[field]) {
        matches += 2;
      }
    });

    // Standard matches (low weight)
    const standardFields = ['cookieEnabled', 'doNotTrack'];
    standardFields.forEach(field => {
      total += 1; // Low weight
      if (fp1[field] === fp2[field]) {
        matches += 1;
      }
    });

    // Plugin similarity
    total += 2;
    const pluginSimilarity = this.calculateArraySimilarity(fp1.plugins, fp2.plugins);
    matches += pluginSimilarity * 2;

    return total > 0 ? matches / total : 0;
  }

  /**
   * Calculates similarity between two arrays
   */
  private static calculateArraySimilarity(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Generates unique fingerprint ID
   */
  private static generateFingerprintId(): string {
    return `fp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Gets canvas fingerprint
   */
  private static async getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return 'no-canvas';

      canvas.width = 200;
      canvas.height = 50;

      // Draw text with different fonts and colors
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Aviation Training Platform 🛩️', 2, 15);
      
      ctx.font = '11px Times';
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Device fingerprint test', 4, 35);

      return canvas.toDataURL();
    } catch (error) {
      return 'canvas-error';
    }
  }

  /**
   * Gets WebGL fingerprint
   */
  private static async getWebGLFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      
      if (!gl) return 'no-webgl';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';

      const vendor = gl.getParameter((debugInfo as any).UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL);

      return `${vendor}~${renderer}`;
    } catch (error) {
      return 'webgl-error';
    }
  }

  /**
   * Gets plugin fingerprint
   */
  private static getPluginFingerprint(): string[] {
    const plugins: string[] = [];
    
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      plugins.push(`${plugin.name}~${plugin.description || 'no-desc'}`);
    }

    return plugins.sort();
  }

  /**
   * Gets a human-readable device description
   */
  static getDeviceDescription(fingerprint: DeviceFingerprint): string {
    const ua = fingerprint.userAgent;
    
    // Extract browser info
    let browser = 'Unknown Browser';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    
    // Extract OS info
    let os = 'Unknown OS';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return `${browser} on ${os} (${fingerprint.screenResolution})`;
  }
}

/**
 * React hook for device fingerprinting
 */
export const useDeviceFingerprint = () => {
  const { t } = useLanguage();

  const registerDevice = async (userId: string) => {
    try {
      return await DeviceFingerprintService.registerDevice(userId);
    } catch (error) {
      console.error('Failed to register device:', error);
      throw new Error(t('errors.deviceRegistrationFailed') || 'Failed to register device');
    }
  };

  const validateDevice = async (userId: string) => {
    try {
      return await DeviceFingerprintService.validateDevice(userId);
    } catch (error) {
      console.error('Failed to validate device:', error);
      throw new Error(t('errors.deviceValidationFailed') || 'Failed to validate device');
    }
  };

  const updateDevice = async (userId: string) => {
    try {
      return await DeviceFingerprintService.updateDeviceRegistration(userId);
    } catch (error) {
      console.error('Failed to update device:', error);
      throw new Error(t('errors.deviceUpdateFailed') || 'Failed to update device registration');
    }
  };

  const getRegisteredDevice = () => {
    return DeviceFingerprintService.getRegisteredDevice();
  };

  const clearDevice = () => {
    DeviceFingerprintService.clearDeviceRegistration();
  };

  return {
    registerDevice,
    validateDevice,
    updateDevice,
    getRegisteredDevice,
    clearDevice,
  };
};