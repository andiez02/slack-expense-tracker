import { useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { 
  SettingsIcon, 
  BellIcon, 
  CheckIcon, 
  UsersIcon,
  DocumentIcon,
} from '../components/Icons';
import { slackbotAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    slack: true,
    email: false,
    sms: false,
    push: true
  });

  // Slack connection status
  const [slackConnected, setSlackConnected] = useState(false);

  const clearFileSelection = () => {
    setQrFile(null);
    // Reset file input element
    const fileInput = document.getElementById('qr-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
    }
  };

  const handleUploadQr = async () => {
    if (!qrFile) return;
    
    console.log('📤 Uploading QR image...', qrFile.name);
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('qrImage', qrFile);
      
      // Call API to upload QR image
      console.log('📤 Calling updateUser with QR formData...');
      const result = await updateUser(formData);
      console.log('✅ QR upload successful, result:', result);
      
      // Clear file selection and FormData
      clearFileSelection();
      
      toast.success('Upload QR thành công!');
    } catch (error: any) {
      console.error('❌ Error uploading QR image:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi upload QR');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Save notification settings to server
      
      toast.success('Cài đặt đã được lưu thành công!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleSlackReconnect = async () => {
    try {
      const channels = await slackbotAPI.getJoinedChannels();
      const firstChannel = channels.data?.channels[0].id;
      const members = await slackbotAPI.getJoinedChannelMembers(firstChannel);
      
      toast.success('Kết nối Slack thành công!');
    } catch (error: any) {
      console.error('Error connecting to Slack:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi kết nối Slack');
    }
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



        <div className="space-y-8">

          {/* QR Code Settings */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="heading-md ml-3">Mã QR thanh toán</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Current QR Display */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900">Mã QR hiện tại</h3>
                
                {currentUser?.qrImage ? (
                  <div className="relative">
                    <div className="aspect-square w-full max-w-[240px] mx-auto bg-white rounded-xl border-2 border-slate-200 p-4 shadow-sm">
                      <img
                        src={currentUser.qrImage}
                        alt="Current QR Code"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square w-full max-w-[240px] mx-auto border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center p-6">
                    <DocumentIcon className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500 font-medium mb-1">Chưa có mã QR</p>
                    <p className="text-xs text-slate-400">Upload ảnh để hiển thị</p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900">Cập nhật mã QR</h3>
                
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                      id="qr-upload"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      PNG, JPG, GIF • Tối đa 10MB
                    </p>
                  </div>
                  
                  {qrFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {qrFile.name}
                          </p>
                          <p className="text-xs text-blue-700">
                            {(qrFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={handleUploadQr}
                          disabled={loading}
                          className="btn btn-primary btn-sm"
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Đang tải...
                            </div>
                          ) : (
                            'Upload'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 