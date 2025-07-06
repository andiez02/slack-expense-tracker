import { FormError, CreateExpenseFormData, UpdateExpenseFormData, User } from '../types';
import { FORM_VALIDATION, ERROR_MESSAGES, REGEX } from '../constants';

// Validation utility functions
export const validators = {
  required: (value: any, fieldName: string): string | null => {
    if (value === null || value === undefined || value === '') {
      return ERROR_MESSAGES.FORM.REQUIRED;
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value && value.length < min) {
      return `${fieldName} phải có ít nhất ${min} ký tự`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value && value.length > max) {
      return `${fieldName} không được quá ${max} ký tự`;
    }
    return null;
  },

  email: (value: string, fieldName: string): string | null => {
    if (value && !REGEX.EMAIL.test(value)) {
      return ERROR_MESSAGES.FORM.EMAIL_INVALID;
    }
    return null;
  },

  number: (value: any, fieldName: string): string | null => {
    if (value !== null && value !== undefined && value !== '' && isNaN(Number(value))) {
      return `${fieldName} phải là số hợp lệ`;
    }
    return null;
  },

  min: (value: number, min: number, fieldName: string): string | null => {
    if (value < min) {
      return `${fieldName} phải lớn hơn hoặc bằng ${min.toLocaleString('vi-VN')}`;
    }
    return null;
  },

  max: (value: number, max: number, fieldName: string): string | null => {
    if (value > max) {
      return `${fieldName} không được vượt quá ${max.toLocaleString('vi-VN')}`;
    }
    return null;
  },

  url: (value: string, fieldName: string): string | null => {
    if (value && !REGEX.URL.test(value)) {
      return `${fieldName} phải là URL hợp lệ`;
    }
    return null;
  },

  date: (value: string, fieldName: string): string | null => {
    if (value && isNaN(Date.parse(value))) {
      return ERROR_MESSAGES.FORM.DATE_INVALID;
    }
    return null;
  },

  futureDate: (value: string, fieldName: string): string | null => {
    if (value) {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (inputDate < today) {
        return `${fieldName} phải là ngày trong tương lai`;
      }
    }
    return null;
  },

  arrayMinLength: (value: any[], min: number, fieldName: string): string | null => {
    if (!Array.isArray(value) || value.length < min) {
      return `${fieldName} phải có ít nhất ${min} mục`;
    }
    return null;
  },

  arrayMaxLength: (value: any[], max: number, fieldName: string): string | null => {
    if (Array.isArray(value) && value.length > max) {
      return `${fieldName} không được có quá ${max} mục`;
    }
    return null;
  },
};

// Create Expense Form Validation
export function validateCreateExpenseForm(values: CreateExpenseFormData): FormError[] {
  const errors: FormError[] = [];

  // Title validation
  const titleRequired = validators.required(values.title, 'Tiêu đề');
  if (titleRequired) {
    errors.push({ field: 'title', message: titleRequired });
  } else {
    const titleMinLength = validators.minLength(values.title, FORM_VALIDATION.TITLE.MIN_LENGTH, 'Tiêu đề');
    if (titleMinLength) errors.push({ field: 'title', message: titleMinLength });

    const titleMaxLength = validators.maxLength(values.title, FORM_VALIDATION.TITLE.MAX_LENGTH, 'Tiêu đề');
    if (titleMaxLength) errors.push({ field: 'title', message: titleMaxLength });
  }

  // Description validation
  if (values.description) {
    const descMaxLength = validators.maxLength(values.description, FORM_VALIDATION.DESCRIPTION.MAX_LENGTH, 'Mô tả');
    if (descMaxLength) errors.push({ field: 'description', message: descMaxLength });
  }

  // Amount validation
  const amountRequired = validators.required(values.amount, 'Số tiền');
  if (amountRequired) {
    errors.push({ field: 'amount', message: amountRequired });
  } else {
    const amountNumber = validators.number(values.amount, 'Số tiền');
    if (amountNumber) {
      errors.push({ field: 'amount', message: amountNumber });
    } else {
      const amount = Number(values.amount);
      const amountMin = validators.min(amount, FORM_VALIDATION.AMOUNT.MIN, 'Số tiền');
      if (amountMin) errors.push({ field: 'amount', message: amountMin });

      const amountMax = validators.max(amount, FORM_VALIDATION.AMOUNT.MAX, 'Số tiền');
      if (amountMax) errors.push({ field: 'amount', message: amountMax });
    }
  }

  // Selected users validation
  const usersRequired = validators.arrayMinLength(values.selectedUsers, FORM_VALIDATION.PARTICIPANTS.MIN, 'Người tham gia');
  if (usersRequired) {
    errors.push({ field: 'selectedUsers', message: usersRequired });
  } else {
    const usersMax = validators.arrayMaxLength(values.selectedUsers, FORM_VALIDATION.PARTICIPANTS.MAX, 'Người tham gia');
    if (usersMax) errors.push({ field: 'selectedUsers', message: usersMax });
  }

  // Due date validation (optional)
  if (values.dueDate) {
    const dueDateValid = validators.date(values.dueDate, 'Ngày hạn');
    if (dueDateValid) {
      errors.push({ field: 'dueDate', message: dueDateValid });
    } else {
      const dueDateFuture = validators.futureDate(values.dueDate, 'Ngày hạn');
      if (dueDateFuture) errors.push({ field: 'dueDate', message: dueDateFuture });
    }
  }

  // Category validation (optional)
  if (values.category) {
    const categoryRequired = validators.required(values.category, 'Danh mục');
    if (categoryRequired) errors.push({ field: 'category', message: categoryRequired });
  }

  return errors;
}

// Update Expense Form Validation
export function validateUpdateExpenseForm(values: UpdateExpenseFormData): FormError[] {
  const errors: FormError[] = [];

  // Title validation (if provided)
  if (values.title !== undefined) {
    if (values.title === '') {
      errors.push({ field: 'title', message: ERROR_MESSAGES.FORM.TITLE_REQUIRED });
    } else {
      const titleMinLength = validators.minLength(values.title, FORM_VALIDATION.TITLE.MIN_LENGTH, 'Tiêu đề');
      if (titleMinLength) errors.push({ field: 'title', message: titleMinLength });

      const titleMaxLength = validators.maxLength(values.title, FORM_VALIDATION.TITLE.MAX_LENGTH, 'Tiêu đề');
      if (titleMaxLength) errors.push({ field: 'title', message: titleMaxLength });
    }
  }

  // Description validation (if provided)
  if (values.description !== undefined && values.description) {
    const descMaxLength = validators.maxLength(values.description, FORM_VALIDATION.DESCRIPTION.MAX_LENGTH, 'Mô tả');
    if (descMaxLength) errors.push({ field: 'description', message: descMaxLength });
  }

  // Amount validation (if provided)
  if (values.amount !== undefined) {
    if (values.amount === null || values.amount === undefined) {
      errors.push({ field: 'amount', message: ERROR_MESSAGES.FORM.AMOUNT_REQUIRED });
    } else {
      const amountNumber = validators.number(values.amount, 'Số tiền');
      if (amountNumber) {
        errors.push({ field: 'amount', message: amountNumber });
      } else {
        const amount = Number(values.amount);
        const amountMin = validators.min(amount, FORM_VALIDATION.AMOUNT.MIN, 'Số tiền');
        if (amountMin) errors.push({ field: 'amount', message: amountMin });

        const amountMax = validators.max(amount, FORM_VALIDATION.AMOUNT.MAX, 'Số tiền');
        if (amountMax) errors.push({ field: 'amount', message: amountMax });
      }
    }
  }

  // Due date validation (if provided)
  if (values.dueDate !== undefined && values.dueDate) {
    const dueDateValid = validators.date(values.dueDate, 'Ngày hạn');
    if (dueDateValid) {
      errors.push({ field: 'dueDate', message: dueDateValid });
    } else {
      const dueDateFuture = validators.futureDate(values.dueDate, 'Ngày hạn');
      if (dueDateFuture) errors.push({ field: 'dueDate', message: dueDateFuture });
    }
  }

  return errors;
}

// User Profile Validation
export function validateUserProfile(values: Partial<User>): FormError[] {
  const errors: FormError[] = [];

  // Name validation
  if (values.name !== undefined) {
    const nameRequired = validators.required(values.name, 'Tên');
    if (nameRequired) {
      errors.push({ field: 'name', message: nameRequired });
    } else {
      const nameMinLength = validators.minLength(values.name, 2, 'Tên');
      if (nameMinLength) errors.push({ field: 'name', message: nameMinLength });

      const nameMaxLength = validators.maxLength(values.name, 100, 'Tên');
      if (nameMaxLength) errors.push({ field: 'name', message: nameMaxLength });
    }
  }

  // Email validation
  if (values.email !== undefined) {
    const emailRequired = validators.required(values.email, 'Email');
    if (emailRequired) {
      errors.push({ field: 'email', message: emailRequired });
    } else {
      const emailValid = validators.email(values.email, 'Email');
      if (emailValid) errors.push({ field: 'email', message: emailValid });
    }
  }

  return errors;
}

// QR Code URL Validation
export function validateQRCodeUrl(url: string): FormError[] {
  const errors: FormError[] = [];

  if (url) {
    const urlValid = validators.url(url, 'URL QR Code');
    if (urlValid) {
      errors.push({ field: 'qr_url', message: urlValid });
    }
  }

  return errors;
}

// Generic form field validation
export function validateField(
  value: any,
  rules: Array<{
    type: keyof typeof validators;
    params?: any[];
    message?: string;
  }>,
  fieldName: string
): string | null {
  for (const rule of rules) {
    const validator = validators[rule.type];
    if (validator) {
      const params = rule.params || [];
      const error = (validator as any)(value, ...params, fieldName);
      if (error) {
        return rule.message || error;
      }
    }
  }
  return null;
}

// Validation helper for forms
export function createValidator<T extends Record<string, any>>(
  schema: Record<keyof T, Array<{
    type: keyof typeof validators;
    params?: any[];
    message?: string;
  }>>
) {
  return (values: T): FormError[] => {
    const errors: FormError[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = values[field as keyof T];
      const error = validateField(value, rules, field);
      if (error) {
        errors.push({ field, message: error });
      }
    }

    return errors;
  };
} 