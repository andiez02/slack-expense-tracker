import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks';
import { CompanyLogo, SpinnerIcon } from '../components/Icons';
import { Button, Input } from '../components/ui';
import { LoginCredentials } from '../types';
import { authAPI } from '../lib/api';

export default function Login() {
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        addNotification({
          type: 'success',
          title: 'Đăng nhập thành công',
          message: 'Chào mừng bạn trở lại!'
        });
        router.push('/');
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi đăng nhập',
        message: error.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - PolitePay</title>
        <meta name="description" content="Đăng nhập vào PolitePay" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Logo và tiêu đề */}
          <div className="text-center">
            <div className="flex justify-center">
              <CompanyLogo className="w-16 h-16" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-slate-900">PolitePay</h1>
            <p className="mt-2 text-lg text-slate-600 italic">caigiaphaitra</p>
            <p className="mt-4 text-sm text-slate-500">
              Quản lý chi phí team một cách thông minh
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Chào mừng trở lại!
              </h2>
              <p className="text-slate-600">
                Đăng nhập để tiếp tục
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Tên đăng nhập"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
              />

              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="text-sm">
                  <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Đăng ký tài khoản mới
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                loading={loading}
              >
                {loading ? (
                  <>
                    <SpinnerIcon className="w-5 h-5 text-white" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              Tính năng chính
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">💰</span>
                </div>
                <span className="text-sm text-slate-600">
                  Quản lý chi phí team dễ dàng
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">🔔</span>
                </div>
                <span className="text-sm text-slate-600">
                  Thông báo tự động qua Slack
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-sm">📊</span>
                </div>
                <span className="text-sm text-slate-600">
                  Theo dõi lịch sử chi tiêu
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              © 2024 Politetech. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 