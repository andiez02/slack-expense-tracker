import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef, useCallback } from 'react'
import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

import '../styles/globals.css'

function AppContent({ Component, pageProps }: { Component: AppProps['Component']; pageProps: AppProps['pageProps'] }) {
  const router = useRouter();
  const { currentUser, setCurrentUser, getCurrentUser } = useAuth();
  console.log('🥦 ~ AppContent ~ currentUser:', currentUser)
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const oauthProcessed = useRef(false);
  const isInitializing = useRef(false);

  // Pages that don't need Layout wrapper
  const noLayoutPages = ['/login', '/register', '/ranking'];

  // Public pages that don't require authentication
  const publicPages = ['/login', '/register', '/ranking'];

  const requiresAuth = !publicPages.includes(router.pathname);

  // Memoized getCurrentUser to prevent recreating on every render
  const memoizedGetCurrentUser = useCallback(async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;

    try {
      await getCurrentUser();
    } catch (error: any) {
      // Only clear token and redirect on actual auth errors (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('accessToken');
        if (requiresAuth && router.pathname !== '/login') {
          // Pass current route as redirect parameter
          const redirectParam = router.pathname !== '/' && router.pathname !== '/ranking' ? `?redirect=${encodeURIComponent(router.pathname)}` : '';
          router.push(`/login${redirectParam}`);
        }
      }
      // For other errors (network, server errors), don't redirect
      // This prevents unwanted redirects during temporary issues
    } finally {
      isInitializing.current = false;
    }
  }, [getCurrentUser, requiresAuth, router]);

  // Handle OAuth success and token
  useEffect(() => {
    const handleOAuthSuccess = () => {
      const { oauth_success, access_token, user_data, state } = router.query;

      if (oauth_success === 'true' && access_token && user_data && !oauthProcessed.current) {
        oauthProcessed.current = true;

        try {
          const userData = JSON.parse(decodeURIComponent(user_data as string));

          // Store token in localStorage for Slack OAuth
          localStorage.setItem('accessToken', access_token as string);

          // Set user data directly to context 
          setCurrentUser(userData);

          toast.success('Đăng nhập Slack thành công!');

          // Mark auth as checked since we just authenticated
          setIsAuthChecked(true);

          // Determine redirect destination from state or default to ranking
          let redirectTo = '/ranking';
          if (state && typeof state === 'string') {
            try {
              const stateUrl = new URL(decodeURIComponent(state));
              const pathname = stateUrl.pathname;
              // Only redirect to safe paths, avoid login/register
              if (pathname && pathname !== '/login' && pathname !== '/register') {
                redirectTo = pathname;
              }
            } catch (error) {
              // If state parsing fails, use default
            }
          }

          // Clear URL params and redirect to intended destination
          router.replace(redirectTo, undefined, { shallow: true });
        } catch (error) {
          toast.error('Có lỗi xảy ra khi xử lý đăng nhập Slack');
          setIsAuthChecked(true);
          router.replace('/login', undefined, { shallow: true });
        }
      }
    };

    if (router.isReady && !oauthProcessed.current) {
      handleOAuthSuccess();
    }
  }, [router.isReady, router.query, setCurrentUser, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Skip if in OAuth flow
      if (router.query.oauth_success === 'true' || oauthProcessed.current) {
        return;
      }

      // Skip if already have current user
      if (currentUser) {
        setIsAuthChecked(true);
        return;
      }

      // Check if we have localStorage token
      const hasToken = !!localStorage.getItem('accessToken');

      if (hasToken) {
        await memoizedGetCurrentUser();
      }

      setIsAuthChecked(true);
    };

    // Only run if not yet checked and router is ready
    if (!isAuthChecked && router.isReady && !oauthProcessed.current) {
      initializeAuth();
    }
  }, [isAuthChecked, router.isReady, router.query.oauth_success, currentUser, memoizedGetCurrentUser]);

  // Handle route protection and redirects
  useEffect(() => {
    // Only run after auth has been checked
    if (!isAuthChecked) return;

    // If user is not authenticated
    if (!currentUser) {
      // If on homepage or any protected route except ranking/login/register, redirect to ranking
      if (router.pathname === '/' || (requiresAuth && router.pathname !== '/login' && router.pathname !== '/register')) {
        // Only redirect to login if specifically trying to access protected routes (not homepage)
        if (router.pathname !== '/' && router.pathname !== '/ranking') {
          const redirectParam = `?redirect=${encodeURIComponent(router.pathname)}`;
          router.push(`/login${redirectParam}`);
        } else if (router.pathname === '/') {
          // Redirect homepage to ranking for unauthenticated users
          router.push('/ranking');
        }
        return;
      }
    }

    // If user is authenticated and on public page, redirect to intended destination or ranking
    if (currentUser && publicPages.includes(router.pathname) && router.pathname !== '/ranking') {
      const { redirect } = router.query;
      const redirectTo = redirect && typeof redirect === 'string' ? redirect : '/ranking';
      router.push(redirectTo);
    }
  }, [currentUser, router.pathname, router.query, requiresAuth, isAuthChecked, router]);

  // Window focus refresh - simplified and debounced
  useEffect(() => {
    if (!currentUser || !localStorage.getItem('accessToken')) return;

    let timeoutId: NodeJS.Timeout;

    const handleWindowFocus = () => {
      // Debounce to prevent multiple calls
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (!isInitializing.current) {
          try {
            await getCurrentUser();
          } catch (error) {
            // Handle error silently
          }
        }
      }, 1000); // 1 second debounce
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      clearTimeout(timeoutId);
    };
  }, [currentUser, getCurrentUser]);

  // Periodic refresh - only when user is active and authenticated
  useEffect(() => {
    if (!currentUser || !localStorage.getItem('accessToken')) return;

    const interval = setInterval(async () => {
      // Only refresh if document is visible and not already initializing
      if (document.visibilityState === 'visible' && !isInitializing.current) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.log(error);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser, getCurrentUser]);

  const useLayout = !noLayoutPages.includes(router.pathname);

  // Show loading while checking authentication
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show loading or redirect while checking authentication for protected routes
  if (requiresAuth && !currentUser) {
    return null;
  }

  return (
    <ErrorBoundary>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  )
} 
