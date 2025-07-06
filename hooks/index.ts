import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  UseQueryResult, 
  UseMutationResult, 
  UseApiOptions,
  UserSettings,
  CreateExpenseFormData,
  UpdateExpenseFormData,
  ExpenseFilter,
  SortOptions,
  NotificationData,
  FormError
} from '../types';
import { authAPI, ApiError } from '../lib/api';
import { PERFORMANCE_CONFIG } from '../constants';

// Generic query hook z
export function useQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { retry = 0, onError, onSuccess } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [queryFn, onError, onSuccess]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Generic mutation hook
export function useMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseApiOptions = {}
): UseMutationResult<T, V> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { onError, onSuccess } = options;

  const mutate = useCallback(async (variables: V) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onError, onSuccess]);

  return {
    mutate,
    data,
    loading,
    error,
  };
}

// Auth hooks
export function useAuth() {
  return useQuery(
    async () => {
      const response = await authAPI.getCurrentUser();
      return response.data;
    },
    []
  );
}

export function useTeamMembers() {
  return useQuery(
    async () => {
      const response = await authAPI.getTeamMembers();
      return response.data;
    },
    []
  );
}

// Expense hooks
// export function useExpenses(
//   page: number = 1,
//   limit: number = 10,
//   filters?: ExpenseFilter,
//   sort?: SortOptions
// ) {
//   return useQuery(
//     async () => {
//       const response = await expenseAPI.getExpenses(page, limit, filters, sort);
//       return response;
//     },
//     [page, limit, filters, sort]
//   );
// }

// export function useExpense(id: number) {
//   return useQuery(
//     async () => {
//       const response = await expenseAPI.getExpense(id);
//       return response.data;
//     },
//     [id]
//   );
// }

// export function useExpenseStats(dateRange?: { start: string; end: string }) {
//   return useQuery(
//     async () => {
//       const response = await expenseAPI.getExpenseStats(dateRange);
//       return response.data;
//     },
//     [dateRange]
//   );
// }

// export function useCreateExpense() {
//   const router = useRouter();
  
//   return useMutation(
//     async (data: CreateExpenseFormData) => {
//       const response = await expenseAPI.createExpense(data);
//       return response.data;
//     },
//     {
//       onSuccess: (expense) => {
//         router.push(`/expense/${expense?.id}`);
//       },
//     }
//   );
// }

// export function useUpdateExpense() {
//   return useMutation(
//     async ({ id, data }: { id: number; data: UpdateExpenseFormData }) => {
//       const response = await expenseAPI.updateExpense(id, data);
//       return response.data;
//     }
//   );
// }

// export function useDeleteExpense() {
//   return useMutation(
//     async (id: number) => {
//       await expenseAPI.deleteExpense(id);
//       return id;
//     }
//   );
// }

// export function useSendReminder() {
//   return useMutation(
//     async ({ expenseId, participantIds }: { expenseId: number; participantIds?: number[] }) => {
//       await expenseAPI.sendReminder(expenseId, participantIds);
//     }
//   );
// }


// Form hooks
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => FormError[]
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when value changes
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field, true);
  }, [setFieldTouched]);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema(values);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  }, [values, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ApiError && error.data?.errors) {
        setErrors(Object.entries(error.data.errors).map(([field, message]) => ({ 
          field, 
          message: typeof message === 'string' ? message : String(message) 
        })));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    validate,
    reset,
    handleSubmit,
  };
}

// Notification hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: NotificationData = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}

// Debounced value hook
export function useDebounce<T>(value: T, delay: number = PERFORMANCE_CONFIG.debounceDelay): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Only log in development mode to avoid console noise
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading localStorage key "' + key + '":', error);
      }
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Only log in development mode to avoid console noise
      if (process.env.NODE_ENV === 'development') {
        console.error('Error setting localStorage key "' + key + '":', error);
      }
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // Only log in development mode to avoid console noise
      if (process.env.NODE_ENV === 'development') {
        console.error('Error removing localStorage key "' + key + '":', error);
      }
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Click outside hook
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

// Intersection observer hook
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
} 