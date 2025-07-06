import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useNotifications } from '../hooks';
import { 
  SettingsIcon, 
  BellIcon, 
  CheckIcon, 
  CurrencyIcon, 
  UsersIcon,
  DocumentIcon,
  EyeIcon,
  CloseIcon
} from '../components/Icons';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState('');
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    slack: true,
    email: false,
    sms: false,
    push: true
  });

  // Slack connection status
  const [slackConnected, setSlackConnected] = useState(true);
  
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load saved QR code
    const savedQR = localStorage.getItem('expense_qr_code');
    if (savedQR) {
      setQrCode(savedQR);
      setQrPreview(savedQR);
    }
  }, []);

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setQrPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setQrCode(url);
    if (url && url.startsWith('http')) {
      setQrPreview(url);
    } else {
      setQrPreview('');
    }
  };

  const removeQrCode = () => {
    setQrCode('');
    setQrFile(null);
    setQrPreview('');
    localStorage.removeItem('expense_qr_code');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save QR code
      if (qrCode) {
        localStorage.setItem('expense_qr_code', qrCode);
      }
      
      // TODO: Save notification settings to server
      addNotification({
        type: 'info',
        title: 'Đang lưu cài đặt',
        message: 'Đang cập nhật cài đặt thông báo và mã QR...'
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Lưu thành công',
        message: 'Cài đặt đã được lưu và áp dụng thành công.'
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi lưu cài đặt',
        message: 'Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSlackReconnect = () => {
    // TODO: Implement Slack reconnection
    addNotification({
      type: 'info',
      title: 'Đang kết nối lại Slack',
      message: 'Đang thực hiện kết nối lại với Slack workspace...'
    });
  };

  return (
    <>
      <Head>
        <title>Cài đặt - PolitePay</title>
        <meta name="description" content="Cài đặt ứng dụng thu tiền" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="heading-xl">Cài đặt</h1>
          </div>
          <p className="text-muted">Quản lý cài đặt ứng dụng và thông báo</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-emerald-800 font-medium">Cài đặt đã được lưu thành công!</span>
            </div>
          </div>
        )}

        <div className="space-y-8">

          {/* QR Code Settings */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="heading-md ml-3">Mã QR thanh toán</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Upload file mã QR
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileChange}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label htmlFor="qr-upload" className="cursor-pointer">
                    <DocumentIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-1">
                      Nhấn để chọn file ảnh
                    </p>
                    <p className="text-xs text-muted">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* QR Preview */}
              {qrPreview && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-900">Xem trước mã QR</h3>
                    <button
                      onClick={removeQrCode}
                      className="btn btn-ghost btn-sm text-red-600"
                    >
                      <CloseIcon className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={qrPreview}
                      alt="QR Code Preview"
                      className="max-w-xs max-h-64 rounded-lg border border-slate-200"
                      onError={() => setQrPreview('')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="heading-md ml-3">Thông báo</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-slate-900">Thông báo Slack</h3>
                  <p className="text-sm text-muted">Gửi thông báo qua Slack workspace</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.slack}
                    onChange={(e) => setNotifications({...notifications, slack: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-slate-200">
                <div>
                  <h3 className="font-medium text-slate-900">Email</h3>
                  <p className="text-sm text-muted">Gửi thông báo qua email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-slate-200">
                <div>
                  <h3 className="font-medium text-slate-900">SMS</h3>
                  <p className="text-sm text-muted">Gửi thông báo qua tin nhắn</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-slate-200">
                <div>
                  <h3 className="font-medium text-slate-900">Push notification</h3>
                  <p className="text-sm text-muted">Thông báo đẩy trên trình duyệt</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Slack Integration */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="heading-md ml-3">Tích hợp Slack</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${slackConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {slackConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                    </h3>
                    <p className="text-sm text-muted">
                      {slackConnected 
                        ? 'Workspace: Politetech Team' 
                        : 'Chưa có kết nối với Slack workspace'
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleSlackReconnect}
                  className={`btn ${slackConnected ? 'btn-secondary' : 'btn-primary'} btn-md`}
                >
                  {slackConnected ? 'Kết nối lại' : 'Kết nối'}
                </button>
              </div>

              {slackConnected && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-2">Quyền được cấp:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Đọc danh sách thành viên workspace</li>
                    <li>• Gửi tin nhắn đến channel và DM</li>
                    <li>• Tạo và quản lý workflow</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary btn-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 