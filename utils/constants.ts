export const API_ROOT = 'http://localhost:4044/api/v1'

// Format number with dot as thousand separator
export const formatNumber = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN');
  }
  
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Convert to number and format
  return parseInt(numericValue).toLocaleString('vi-VN');
};

// Remove formatting to get raw number
export const parseFormattedNumber = (value: string): string => {
  return value.replace(/\./g, '');
};

// Format currency with VNĐ
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};