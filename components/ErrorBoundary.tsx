import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DEV_CONFIG } from '../config';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    if (DEV_CONFIG.enableConsoleLogging) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to error reporting service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
            <div className='flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>

            <h2 className='text-lg font-semibold text-gray-900 text-center mb-2'>
              Oops! Có lỗi xảy ra
            </h2>

            <p className='text-gray-600 text-center mb-6'>
              Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ
              hỗ trợ nếu lỗi tiếp tục xảy ra.
            </p>

            {DEV_CONFIG.showErrorDetails && this.state.error && (
              <details className='mb-4 p-3 bg-gray-100 rounded-lg'>
                <summary className='cursor-pointer text-sm font-medium text-gray-700'>
                  Chi tiết lỗi (Development)
                </summary>
                <div className='mt-2 text-xs text-gray-600 overflow-auto max-h-40'>
                  <div className='font-medium'>Error:</div>
                  <div className='mb-2'>{this.state.error.message}</div>

                  <div className='font-medium'>Stack:</div>
                  <pre className='whitespace-pre-wrap'>
                    {this.state.error.stack}
                  </pre>

                  {this.state.errorInfo && (
                    <>
                      <div className='font-medium mt-2'>Component Stack:</div>
                      <pre className='whitespace-pre-wrap'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className='flex space-x-3'>
              <button
                onClick={this.handleRetry}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Thử lại
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors'
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
