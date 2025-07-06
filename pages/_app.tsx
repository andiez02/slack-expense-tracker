import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'
import { AuthProvider } from '../contexts/AuthContext'
import { NotificationContainer } from '../components/ui/Notification'
import { useNotifications } from '../hooks'

// Notification Provider Component
function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { notifications, removeNotification } = useNotifications();
  
  return (
    <>
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Pages that don't need Layout wrapper
  const noLayoutPages = ['/login', '/register'];
  const useLayout = !noLayoutPages.includes(router.pathname);
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          {useLayout ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 