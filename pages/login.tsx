import Head from 'next/head';
import { CompanyLogo, SlackIcon, SpinnerIcon } from '../components/Icons';
// import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
// import { LoginCredentials } from '../types';
// import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
// import { toast } from 'react-toastify';

// import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '@/utils/validators';
import { API_ROOT } from '@/utils/constants';

export default function Login() {

  const router = useRouter();
  // const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  // const onSubmitLogin = async (data: LoginCredentials) => {
  //   const {email, password} = data;
  //   toast.promise(
  //     dispatch(loginUserAPI({email, password})),
  //     {
  //       pending: 'Đang đăng nhập...',
  //     }
  //   ).then((res: any) => {
  //     if (!res.error) router.push('/')
  //   })
  // }

  const handleSlackLogin = () => {
    // Get the intended destination from query params or default to home
    const { redirect } = router.query;
    const redirectTo = redirect && typeof redirect === 'string' ? redirect : '/';
    const currentUrl = `${window.location.origin}${redirectTo}`;
    const slackAuthUrl = `${API_ROOT}/auth/slack?state=${encodeURIComponent(currentUrl)}`;
    window.location.href = slackAuthUrl;
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

          {/* Error Message */}
          {router.query.error === 'slack_oauth_failed' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">
                Đăng nhập Slack thất bại. Vui lòng thử lại.
              </p>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Chào mừng trở lại!
              </h2>
              <p className="text-slate-600">
                Đăng nhập với Slack để tiếp tục
              </p>
            </div>

            {/* Slack Login Button */}
            <Button
              type="button"
              onClick={handleSlackLogin}
              className="w-full flex items-center justify-center gap-3 bg-slack hover:bg-slack-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#4A154B' }}
            >
              <SlackIcon className="w-5 h-5" />
              Đăng nhập với Slack
            </Button>

            {/* Comment out traditional login form */}
            {/*
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Hoặc</span>
              </div>
            </div>

            <form className="space-y-2" onSubmit={handleSubmit(onSubmitLogin)}>
              <Input
                label="Email"
                type="text"
                required
                {...register('email', { required: FIELD_REQUIRED_MESSAGE, pattern: {value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE} })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <Input
                label="Mật khẩu"
                type="password"
                required
                {...register('password', { required: FIELD_REQUIRED_MESSAGE })}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

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
              >
                Đăng nhập
              </Button>
            </form>
            */}

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