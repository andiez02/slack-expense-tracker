// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_SLACK_CLIENT_ID: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || '',
  NEXT_PUBLIC_SLACK_REDIRECT_URI: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI || '',
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
} as const;

// App configuration
export const APP_CONFIG = {
  name: 'PolitePay',
  description: 'Slack Expense Tracker - caigiaphaitra',
  version: ENV.NEXT_PUBLIC_VERSION,
  author: 'PoliteTech',
  
  // API Configuration
  api: {
    baseURL: ENV.NEXT_PUBLIC_API_URL,
    timeout: 30000, // 30 seconds
    retry: {
      attempts: 3,
      delay: 1000, // 1 second
    },
  },
  
  // Authentication
  auth: {
    tokenKey: 'auth_token',
    userKey: 'user_data',
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },
  
  // Slack Configuration
  slack: {
    clientId: ENV.NEXT_PUBLIC_SLACK_CLIENT_ID,
    redirectUri: ENV.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    scopes: [
      'users:read',
      'chat:write',
      'im:write',
      'team:read',
      'channels:read',
      'groups:read',
      'mpim:read',
    ],
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      storageKey: 'theme',
    },
    language: {
      default: 'vi',
      storageKey: 'language',
      supported: ['vi', 'en'],
    },
    pagination: {
      defaultLimit: 10,
      maxLimit: 100,
    },
    toast: {
      duration: 5000,
      position: 'top-right',
    },
  },
  
  // File Upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  
  // Expense Configuration
  expense: {
    defaultAmount: 50000,
    minAmount: 1000,
    maxAmount: 100000000,
    maxParticipants: 100,
    reminderDays: 3,
    categories: [
      'food',
      'coffee',
      'lunch',
      'dinner',
      'gift',
      'birthday',
      'celebration',
      'office',
      'travel',
      'other',
    ],
  },
  
  // Feature Flags
  features: {
    darkMode: true,
    multiLanguage: true,
    notifications: true,
    analytics: ENV.NODE_ENV === 'production',
    sentry: ENV.NODE_ENV === 'production',
    recurringExpenses: false, // Coming soon
    advancedFilters: true,
    exportData: false, // Coming soon
  },
  
  // Performance
  performance: {
    debounceDelay: 300,
    throttleDelay: 100,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  },
  
  // Development
  development: {
    showErrorDetails: ENV.NODE_ENV === 'development',
    enableConsoleLogging: ENV.NODE_ENV === 'development',
    enableReduxDevTools: ENV.NODE_ENV === 'development',
    mockApi: false,
  },
} as const;

// Utility functions for configuration
export const configUtils = {
  /**
   * Check if we're in development mode
   */
  isDevelopment: () => ENV.NODE_ENV === 'development',
  
  /**
   * Check if we're in production mode
   */
  isProduction: () => ENV.NODE_ENV === 'production',
  
  /**
   * Check if we're in test mode
   */
  isTest: () => ENV.NODE_ENV === 'test',
  
  /**
   * Get API URL with path
   */
  getApiUrl: (path: string = '') => {
    const baseUrl = APP_CONFIG.api.baseURL.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  },
  
  /**
   * Get full URL for the app
   */
  getAppUrl: (path: string = '') => {
    const baseUrl = ENV.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
  },
  
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled: (feature: keyof typeof APP_CONFIG.features): boolean => {
    return APP_CONFIG.features[feature];
  },
  
  /**
   * Get Slack OAuth URL
   */
  getSlackOAuthUrl: (state?: string) => {
    const params = new URLSearchParams({
      client_id: APP_CONFIG.slack.clientId,
      scope: APP_CONFIG.slack.scopes.join(','),
      redirect_uri: APP_CONFIG.slack.redirectUri,
      ...(state && { state }),
    });
    
    return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  },
  
  /**
   * Get configuration for environment
   */
  getEnvironmentConfig: () => {
    const env = ENV.NEXT_PUBLIC_ENVIRONMENT;
    
    const configs = {
      development: {
        apiUrl: 'http://localhost:3001',
        enableLogging: true,
        enableDevTools: true,
        mockApi: false,
      },
      staging: {
        apiUrl: 'https://staging-api.politepay.com',
        enableLogging: true,
        enableDevTools: false,
        mockApi: false,
      },
      production: {
        apiUrl: 'https://api.politepay.com',
        enableLogging: false,
        enableDevTools: false,
        mockApi: false,
      },
    };
    
    return configs[env as keyof typeof configs] || configs.development;
  },
  
  /**
   * Validate required environment variables
   */
  validateEnvironment: () => {
    const required = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_APP_URL',
    ];
    
    const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  },
  
  /**
   * Get configuration value by path
   */
  getConfigValue: (path: string) => {
    const keys = path.split('.');
    let value: any = APP_CONFIG;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        return undefined;
      }
    }
    
    return value;
  },
};

// Export commonly used config values
export const {
  api: API_CONFIG,
  auth: AUTH_CONFIG,
  slack: SLACK_CONFIG,
  ui: UI_CONFIG,
  upload: UPLOAD_CONFIG,
  expense: EXPENSE_CONFIG,
  features: FEATURES,
  performance: PERFORMANCE_CONFIG,
  development: DEV_CONFIG,
} = APP_CONFIG;

// Initialize configuration validation in non-test environments
if (ENV.NODE_ENV !== 'test') {
  try {
    configUtils.validateEnvironment();
  } catch (error) {
    if (configUtils.isDevelopment()) {
      // Only log configuration warnings in development mode
      console.warn('Configuration validation failed:', error);
    } else {
      throw error;
    }
  }
} 