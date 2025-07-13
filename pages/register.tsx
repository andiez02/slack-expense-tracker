import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Register() {
  const router = useRouter();

  // Redirect to login since we only use Slack OAuth now
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <>
      <Head>
        <title>Đăng ký - PolitePay</title>
        <meta name="description" content="Đăng ký tài khoản PolitePay" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Đang chuyển hướng...</h1>
            <p className="mt-2 text-slate-600">
              Chúng tôi chỉ hỗ trợ đăng nhập qua Slack. Đang chuyển đến trang đăng nhập...
            </p>
          </div>
        </div>
      </div>
    </>
  );

  /*
  // Previous register form - commented out since we only use Slack OAuth
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterCredentials>();

  const onSubmitRegister = async (data: RegisterCredentials) => {
    const {name, email, password} = data;
    toast.promise(
      dispatch(registerUserAPI({name, email, password})),
      {
        pending: 'Đang tạo tài khoản...',
      }
    ).then((res: any) => {
      if (!res.error) router.push('/login')
    })
  }

  return (
    <>
      <Head>
        <title>Đăng ký - PolitePay</title>
        <meta name="description" content="Đăng ký tài khoản PolitePay" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center">
            <div className="flex justify-center">
              <CompanyLogo className="w-16 h-16" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-slate-900">PolitePay</h1>
            <p className="mt-2 text-lg text-slate-600 italic">caigiaphaitra</p>
            <p className="mt-4 text-sm text-slate-500">
              Tạo tài khoản để bắt đầu quản lý chi phí team
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Tạo tài khoản mới
              </h2>
              <p className="text-slate-600">
                Điền thông tin để bắt đầu
              </p>
            </div>

            <form className="space-y-2" onSubmit={handleSubmit(onSubmitRegister)}>
              <Input
                label="Họ và tên"
                type="text"
                required
                {...register('name', { required: FIELD_REQUIRED_MESSAGE })}
                placeholder="Nguyễn Văn A"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

              <Input
                label="Email"
                type="email"
                required
                {...register('email', { required: FIELD_REQUIRED_MESSAGE, pattern: {value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE} })}
                placeholder="example@company.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <Input
                label="Mật khẩu"
                type="password"
                required
                {...register('password', { required: FIELD_REQUIRED_MESSAGE, minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } })}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                required
                {...register('confirmPassword', {
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => value === watch('password') || 'Mật khẩu xác nhận không khớp'
                })}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Đã có tài khoản? Đăng nhập
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Tạo tài khoản
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Bằng cách đăng ký, bạn đồng ý với{' '}
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

          <div className="text-center">
            <p className="text-xs text-slate-400">
              © 2024 Politetech. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </>
  );
  */
} 