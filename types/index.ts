// User types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  qrImage?: string;
  slackTeamName?: string;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
}

// Expense types
export interface ExpenseParticipant {
  id: number;
  user_slack_id: string;
  name: string;
  email?: string;
  status: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  amount: number;
  notes?: string;
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  total_amount: number;
  amount_per_person: number;
  qr_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  participants: ExpenseParticipant[];
  metadata?: {
    category?: string;
    tags?: string[];
    recurring?: boolean;
    recurring_period?: 'weekly' | 'monthly' | 'yearly';
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name: string;
}

// Form types
export interface CreateExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  selectedUsers: User[];
  dueDate?: string;
  category?: string;
  tags?: string[];
  recurring?: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'yearly';
}

export interface UpdateExpenseFormData {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: Expense['status'];
}

// Filter and sort types
export interface ExpenseFilter {
  status?: Expense['status'][];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  category?: string[];
  tags?: string[];
  search?: string;
}

export interface SortOptions {
  field: 'created_at' | 'amount' | 'title' | 'status';
  order: 'asc' | 'desc';
}

// UI Component types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

// Settings types
export interface UserSettings {
  notifications: {
    slack: boolean;
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'vi';
    timezone: string;
  };
  expense: {
    defaultCategory: string;
    defaultAmount: number;
    autoReminder: boolean;
    reminderDays: number;
  };
}

// Slack types
export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive' | 'away';
  is_bot: boolean;
  is_admin: boolean;
  team_id: string;
}

export interface SlackTeam {
  id: string;
  name: string;
  domain: string;
  avatar: string;
  plan: string;
}

// Stats types
export interface ExpenseStats {
  total_expenses: number;
  total_amount: number;
  completed_payments: number;
  pending_payments: number;
  average_amount: number;
  completion_rate: number;
  monthly_trend: {
    month: string;
    amount: number;
    count: number;
  }[];
}

// Utility types
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Hook types
export interface UseApiOptions {
  retry?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T>;
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface ExpenseItem {
  userId: string;
  note?: string;
  userConfirmed?: boolean;
  collectorConfirmed?: boolean;
  confirmedAt?: Date;
  slackMessageTs?: string;
  slackChannel?: string;
} 