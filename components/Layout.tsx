import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  DashboardIcon,
  CreateIcon,
  HistoryIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  CompanyLogo
} from './Icons';
import { useAuth } from '@/contexts/AuthContext';

// Ranking Icon Component
const RankingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon, current: router.pathname === '/dashboard' },
    { name: 'Tạo đợt thu', href: '/create', icon: CreateIcon, current: router.pathname === '/create' },
    { name: 'Lịch sử', href: '/history', icon: HistoryIcon, current: router.pathname === '/history' },
    { name: 'Cài đặt', href: '/settings', icon: SettingsIcon, current: router.pathname === '/settings' },
  ];

  const handleLogout = async () => {
    await logout(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          {/* Logo */}
          <a href="/ranking" className="flex items-center px-6 py-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <CompanyLogo className="w-8 h-8" />
              <div className="flex flex-col text-center">
                <span className="ml-3 text-2xl font-semibold text-slate-900">PolitePay</span>
                <span className="ml-3 text-sm font-light italic text-slate-500">caigiaphaitra</span>
              </div>
            </div>
          </a>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    item.current
                      ? 'nav-link-active'
                      : 'nav-link'
                  }
                >
                  <IconComponent className="mr-3 w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-100">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{currentUser?.email || 'user@company.com'}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500">{currentUser?.slackTeamName || 'Workspace'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <CloseIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
              {/* Mobile Logo */}
              <div className="flex items-center px-6 mb-6">
                <CompanyLogo className="w-8 h-8" />
                <div className="flex flex-col text-center">
                  <span className="ml-3 text-2xl font-semibold text-slate-900">PolitePay</span>
                  <span className="ml-3 text-sm font-light italic text-slate-500">caigiaphaitra</span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="px-4 space-y-1">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={
                        item.current
                          ? 'nav-link-active'
                          : 'nav-link'
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <IconComponent className="mr-3 w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 md:hidden bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center">
              <CompanyLogo className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="ml-2 font-semibold text-slate-900">PolitePay</span>
                <span className="ml-2 text-xs font-light italic text-slate-500">caigiaphaitra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 