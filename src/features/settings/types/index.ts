// Settings Types

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  timezone?: string;
  dateFormat?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  taskReminders: boolean;
  mentionNotifications: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  compactMode?: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout?: number;
  passwordExpiryDays?: number;
  loginNotifications?: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  activityTracking: boolean;
}

export interface UserSettings {
  preferences: UserPreferences;
  notifications: NotificationPreferences;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
}
