// API Constants
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    CURRENT_USER: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
    VALIDATE_TOKEN: '/api/auth/validate',
    TEAM_MEMBERS: '/api/auth/team/members',
  },
  // Expenses
  EXPENSES: {
    LIST: '/api/expenses',
    CREATE: '/api/expenses/create',
    DETAIL: (id: number) => `/api/expenses/${id}`,
    UPDATE: (id: number) => `/api/expenses/${id}`,
    DELETE: (id: number) => `/api/expenses/${id}`,
    STATS: '/api/expenses/stats',
    PARTICIPANTS: (id: number) => `/api/expenses/${id}/participants`,
    SEND_REMINDER: (id: number) => `/api/expenses/${id}/send-reminder`,
  },
  // Slack
  SLACK: {
    USERS: '/api/slack/users',
    SEND_MESSAGE: '/api/slack/send-expense-message',
    INTERACTIONS: '/api/slack/interactions',
    CHANNELS: '/api/slack/channels',
  },
  // Settings
  SETTINGS: {
    GET: '/api/settings',
    UPDATE: '/api/settings',
    RESET: '/api/settings/reset',
  },
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CREATE: '/create',
  HISTORY: '/history',
  SETTINGS: '/settings',
  EXPENSE_DETAIL: (id: number) => `/expense/${id}`,
  AUTH: {
    SLACK_CALLBACK: '/auth/slack/callback',
  },
} as const;

// Status Constants
export const EXPENSE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

// UI Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export const LANGUAGE = {
  EN: 'en',
  VI: 'vi',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Form Constants
export const FORM_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  AMOUNT: {
    MIN: 1000, // 1,000 VND
    MAX: 100000000, // 100,000,000 VND
  },
  PARTICIPANTS: {
    MIN: 1,
    MAX: 100,
  },
} as const;

// Time Constants
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  DISPLAY_DATE: 'DD/MM/YYYY',
  DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm',
} as const;

// Currency Constants
export const CURRENCY = {
  VND: {
    CODE: 'VND',
    SYMBOL: '₫',
    DECIMAL_PLACES: 0,
    THOUSAND_SEPARATOR: '.',
    DECIMAL_SEPARATOR: ',',
  },
  USD: {
    CODE: 'USD',
    SYMBOL: '$',
    DECIMAL_PLACES: 2,
    THOUSAND_SEPARATOR: ',',
    DECIMAL_SEPARATOR: '.',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  EXPENSE_QR_CODE: 'expense_qr_code',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'user_settings',
  LAST_ROUTE: 'last_route',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  EXPENSE: {
    AMOUNT: 50000,
    CATEGORY: 'other',
    REMINDER_DAYS: 3,
  },
  SETTINGS: {
    NOTIFICATIONS: {
      slack: true,
      email: false,
      push: true,
      reminders: true,
    },
    DISPLAY: {
      theme: 'light',
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    EXPENSE: {
      defaultCategory: 'other',
      defaultAmount: 50000,
      autoReminder: true,
      reminderDays: 3,
    },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu nhập vào không hợp lệ.',
  FORM: {
    TITLE_REQUIRED: 'Vui lòng nhập tiêu đề',
    TITLE_TOO_SHORT: 'Tiêu đề phải có ít nhất 3 ký tự',
    TITLE_TOO_LONG: 'Tiêu đề không được quá 100 ký tự',
    AMOUNT_REQUIRED: 'Vui lòng nhập số tiền',
    AMOUNT_INVALID: 'Số tiền không hợp lệ',
    AMOUNT_TOO_LOW: 'Số tiền phải lớn hơn 1,000 VND',
    AMOUNT_TOO_HIGH: 'Số tiền không được vượt quá 100,000,000 VND',
    PARTICIPANTS_REQUIRED: 'Vui lòng chọn ít nhất một người tham gia',
    PARTICIPANTS_TOO_MANY: 'Không được chọn quá 100 người tham gia',
    EMAIL_INVALID: 'Email không hợp lệ',
    DATE_INVALID: 'Ngày không hợp lệ',
    REQUIRED: 'Trường này là bắt buộc',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPENSE_CREATED: 'Tạo đợt thu tiền thành công',
  EXPENSE_UPDATED: 'Cập nhật đợt thu tiền thành công',
  EXPENSE_DELETED: 'Xóa đợt thu tiền thành công',
  PAYMENT_CONFIRMED: 'Xác nhận thanh toán thành công',
  REMINDER_SENT: 'Gửi nhắc nhở thành công',
  SETTINGS_SAVED: 'Lưu cài đặt thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
} as const;

// Categories
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Ăn uống' },
  { value: 'coffee', label: 'Cà phê' },
  { value: 'lunch', label: 'Ăn trưa' },
  { value: 'dinner', label: 'Ăn tối' },
  { value: 'gift', label: 'Quà tặng' },
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'celebration', label: 'Ăn mừng' },
  { value: 'office', label: 'Văn phòng' },
  { value: 'travel', label: 'Du lịch' },
  { value: 'other', label: 'Khác' },
] as const;

// Recurring Periods
export const RECURRING_PERIODS = [
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'yearly', label: 'Hàng năm' },
] as const;

// File Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  URL: /^https?:\/\/[^\s]+$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  debounceDelay: 300,
  throttleDelay: 100,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
} as const; 