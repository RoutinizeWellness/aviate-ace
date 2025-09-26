export interface TrialRecord {
  id: string;
  ipAddress: string;
  userId: string;
  timestamp: number;
  userAgent?: string;
  isActive: boolean;
  revokedAt?: number;
  revokedBy?: string;
  revokeReason?: string;
}

export interface TrialCheckResult {
  canUseTrial: boolean;
  reason: string;
  existingRecord?: TrialRecord;
}

export class TrialLimitationService {
  private static readonly TRIAL_STORAGE_KEY = 'ip_trial_records';
  private static readonly ADMIN_OVERRIDE_KEY = 'admin_trial_overrides';

  /**
   * Get user's IP address (simplified for demo - in production use proper IP detection)
   */
  private static async getUserIP(): Promise<string> {
    try {
      // In production, you'd use a proper IP detection service
      // For demo purposes, we'll use a fallback
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Fallback to a simulated IP based on browser fingerprint
      const fingerprint = this.getBrowserFingerprint();
      return `192.168.1.${Math.abs(fingerprint) % 255}`;
    }
  }

  /**
   * Generate a simple browser fingerprint for IP simulation
   */
  private static getBrowserFingerprint(): number {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return fingerprint.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  /**
   * Get all trial records from localStorage
   */
  private static getTrialRecords(): TrialRecord[] {
    try {
      const records = localStorage.getItem(this.TRIAL_STORAGE_KEY);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Error reading trial records:', error);
      return [];
    }
  }

  /**
   * Save trial records to localStorage
   */
  private static saveTrialRecords(records: TrialRecord[]): void {
    try {
      localStorage.setItem(this.TRIAL_STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving trial records:', error);
    }
  }

  /**
   * Get admin overrides from localStorage
   */
  private static getAdminOverrides(): string[] {
    try {
      const overrides = localStorage.getItem(this.ADMIN_OVERRIDE_KEY);
      return overrides ? JSON.parse(overrides) : [];
    } catch (error) {
      console.error('Error reading admin overrides:', error);
      return [];
    }
  }

  /**
   * Check if an IP address can use the trial
   */
  public static async checkTrialEligibility(userId: string): Promise<TrialCheckResult> {
    const ipAddress = await this.getUserIP();
    const records = this.getTrialRecords();
    const overrides = this.getAdminOverrides();

    // Check if this IP has admin override
    if (overrides.includes(ipAddress)) {
      return {
        canUseTrial: true,
        reason: 'Admin override active for this IP'
      };
    }

    // Find existing active trial for this IP
    const existingRecord = records.find(record => 
      record.ipAddress === ipAddress && 
      record.isActive
    );

    if (existingRecord) {
      // If it's the same user, they can continue their trial
      if (existingRecord.userId === userId) {
        return {
          canUseTrial: true,
          reason: 'Continuing existing trial',
          existingRecord
        };
      }

      // Different user on same IP - trial already used
      return {
        canUseTrial: false,
        reason: 'Trial already used by another account from this IP address',
        existingRecord
      };
    }

    // No existing trial for this IP - eligible
    return {
      canUseTrial: true,
      reason: 'Eligible for new trial'
    };
  }

  /**
   * Register a new trial for the current IP
   */
  public static async registerTrial(userId: string): Promise<TrialRecord> {
    const ipAddress = await this.getUserIP();
    const records = this.getTrialRecords();

    const newRecord: TrialRecord = {
      id: `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress,
      userId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      isActive: true
    };

    records.push(newRecord);
    this.saveTrialRecords(records);

    return newRecord;
  }

  /**
   * Revoke a trial (admin function)
   */
  public static revokeTrial(trialId: string, revokedBy: string, reason: string): boolean {
    const records = this.getTrialRecords();
    const recordIndex = records.findIndex(record => record.id === trialId);

    if (recordIndex === -1) {
      return false;
    }

    records[recordIndex] = {
      ...records[recordIndex],
      isActive: false,
      revokedAt: Date.now(),
      revokedBy,
      revokeReason: reason
    };

    this.saveTrialRecords(records);
    return true;
  }

  /**
   * Add admin override for an IP (allows unlimited trials)
   */
  public static addAdminOverride(ipAddress: string): void {
    const overrides = this.getAdminOverrides();
    if (!overrides.includes(ipAddress)) {
      overrides.push(ipAddress);
      localStorage.setItem(this.ADMIN_OVERRIDE_KEY, JSON.stringify(overrides));
    }
  }

  /**
   * Remove admin override for an IP
   */
  public static removeAdminOverride(ipAddress: string): void {
    const overrides = this.getAdminOverrides();
    const filteredOverrides = overrides.filter(ip => ip !== ipAddress);
    localStorage.setItem(this.ADMIN_OVERRIDE_KEY, JSON.stringify(filteredOverrides));
  }

  /**
   * Get trial statistics (admin function)
   */
  public static getTrialStatistics(): {
    totalTrials: number;
    activeTrials: number;
    revokedTrials: number;
    uniqueIPs: number;
    adminOverrides: number;
  } {
    const records = this.getTrialRecords();
    const overrides = this.getAdminOverrides();
    const uniqueIPs = new Set(records.map(record => record.ipAddress)).size;

    return {
      totalTrials: records.length,
      activeTrials: records.filter(record => record.isActive).length,
      revokedTrials: records.filter(record => !record.isActive).length,
      uniqueIPs,
      adminOverrides: overrides.length
    };
  }

  /**
   * Get all trial records (admin function)
   */
  public static getAllTrialRecords(): TrialRecord[] {
    return this.getTrialRecords();
  }

  /**
   * Clear all trial data (admin function - use with caution)
   */
  public static clearAllTrialData(): void {
    localStorage.removeItem(this.TRIAL_STORAGE_KEY);
    localStorage.removeItem(this.ADMIN_OVERRIDE_KEY);
  }

  /**
   * Get current user's IP and trial status
   */
  public static async getCurrentUserTrialInfo(userId: string): Promise<{
    ipAddress: string;
    eligibility: TrialCheckResult;
  }> {
    const ipAddress = await this.getUserIP();
    const eligibility = await this.checkTrialEligibility(userId);

    return {
      ipAddress,
      eligibility
    };
  }
}