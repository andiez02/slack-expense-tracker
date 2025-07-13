import Head from 'next/head';
import { useEffect } from 'react';
import {
  DashboardIcon,
  CreateIcon,
  HistoryIcon,
  UsersIcon,
  CurrencyIcon,
  TrendingUpIcon,
} from '../components/Icons';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/lib/api';

export default function Dashboard() {
  const { currentUser: user } = useAuth();

  useEffect(() => {
    dashboardAPI.getDashboard();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - PolitePay</title>
        <meta name='description' content='Quản lý chi phí team' />
      </Head>

      <div className='min-h-screen bg-slate-50'>
        {/* Header */}
        <div className='bg-white border-b border-slate-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center'>
                <DashboardIcon className='w-6 h-6 text-blue-600 mr-3' />
                <h1 className='text-xl font-semibold text-slate-900'>
                  Dashboard
                </h1>
              </div>
              {user && (
                <div className='flex items-center'>
                  <span className='text-sm text-slate-600 mr-2'>Xin chào,</span>
                  <span className='text-sm font-medium text-slate-900'>
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Quick Actions */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            <a
              href='/create'
              className='bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                  <CreateIcon className='w-6 h-6 text-blue-600' />
                </div>
                <div className='ml-4'>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    Tạo đợt thu
                  </h3>
                  <p className='text-sm text-slate-600'>Tạo đợt thu tiền mới</p>
                </div>
              </div>
            </a>

            <a
              href='/history'
              className='bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors'>
                  <HistoryIcon className='w-6 h-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    Lịch sử
                  </h3>
                  <p className='text-sm text-slate-600'>Xem lịch sử chi tiêu</p>
                </div>
              </div>
            </a>

            <a
              href='/settings'
              className='bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 group'
            >
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors'>
                  <UsersIcon className='w-6 h-6 text-purple-600' />
                </div>
                <div className='ml-4'>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    Cài đặt
                  </h3>
                  <p className='text-sm text-slate-600'>Quản lý tài khoản</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 