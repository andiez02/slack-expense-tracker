import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks';
import { CompanyLogo } from '../components/Icons';
import { Button, Input } from '../components/ui';
import { RegisterCredentials } from '../types';
import { authAPI } from '../lib/api';

export default function Register() {
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        addNotification({
          type: 'success',
          title: 'Đăng ký thành công',
          message: 'Chào mừng bạn đến với PolitePay!'
        });
        router.push('/');
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi đăng ký',
        message: error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
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
        <title>Đăng ký - PolitePay</title>
        <meta name="description" content="Đăng ký tài khoản PolitePay" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <CompanyLogo className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Tạo tài khoản mới
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                đăng nhập nếu đã có tài khoản
              </a>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Tên người dùng"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />

              <Input
                label="Họ và tên"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Đăng ký
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 