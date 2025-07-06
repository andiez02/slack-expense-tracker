import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import UserSelector from '../components/UserSelector';
import { useNotifications } from '../hooks';
import { 
  DocumentIcon, 
  CheckIcon, 
  UsersIcon, 
  CurrencyIcon,
  CreateIcon,
  SpinnerIcon
} from '../components/Icons';

interface User {
  id: string;
  name: string;
  slack_id: string;
}

export default function CreateExpense() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { addNotification } = useNotifications();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
    }
    
    if (selectedUsers.length === 0) {
      newErrors.users = 'Vui lòng chọn ít nhất một người tham gia';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const totalAmount = Number(amount);
      const amountPerPerson = totalAmount / selectedUsers.length;
      
      const expenseData = {
        title: title.trim(),
        description: description.trim(),
        total_amount: totalAmount,
        amount_per_person: Math.round(amountPerPerson),
        participants: selectedUsers.map(user => ({
          user_slack_id: user.slack_id,
          name: user.name,
          amount: Math.round(amountPerPerson)
        }))
      };
      
      // TODO: Implement API call
      addNotification({
        type: 'info',
        title: 'Đang tạo đợt thu tiền',
        message: `Tạo đợt thu "${title.trim()}" cho ${selectedUsers.length} người...`
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        type: 'success',
        title: 'Tạo thành công!',
        message: `Đợt thu tiền "${title.trim()}" đã được tạo và thông báo đã được gửi đến ${selectedUsers.length} người.`
      });
      
      setSuccess(true);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi tạo đợt thu',
        message: 'Có lỗi xảy ra khi tạo đợt thu tiền. Vui lòng thử lại.'
      });
      setErrors({ submit: 'Có lỗi xảy ra khi tạo đợt thu tiền' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAmount('');
    setSelectedUsers([]);
    setErrors({});
    setSuccess(false);
  };

  if (success) {
    return (
      <>
        <Head>
          <title>Tạo đợt thu mới - PolitePay</title>
          <meta name="description" content="Tạo đợt thu tiền mới cho team" />
        </Head>
        
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="heading-lg mb-4">Tạo thành công!</h2>
            <p className="text-muted mb-6">
              Đợt thu tiền "{title}" đã được tạo và thông báo đã được gửi đến {selectedUsers.length} người.
            </p>
            <div className="space-y-3">
              <a 
                href="/" 
                className="btn btn-primary btn-lg w-full"
              >
                Về Dashboard
              </a>
              <button
                onClick={resetForm}
                className="btn btn-secondary btn-lg w-full"
              >
                Tạo đợt thu khác
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tạo đợt thu mới - PolitePay</title>
        <meta name="description" content="Tạo đợt thu tiền mới cho team" />
      </Head>
      
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <CreateIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="heading-lg">Tạo đợt thu mới</h1>
              </div>
              
              <a 
                href="/" 
                className="btn btn-ghost btn-sm"
              >
                Về Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Information */}
                <div className="card">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DocumentIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="heading-md ml-3">Thông tin cơ bản</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Tiêu đề đợt thu *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="VD: Tiền ăn trưa team ngày 15/12"
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="input"
                        placeholder="VD: Đặt cơm quán Bà Năm cho team"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Tổng số tiền (VND) *
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`input ${errors.amount ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="300000"
                        min="0"
                      />
                      {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                    </div>
                  </div>
                </div>

                {/* Select Users */}
                <div className="card">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="heading-md ml-3">Chọn người tham gia</h2>
                  </div>
                  
                                      <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Người tham gia *
                      </label>
                      <UserSelector
                        selectedUsers={selectedUsers}
                        onSelectionChange={(users) => setSelectedUsers(users as User[])}
                      />
                      {errors.users && <p className="mt-1 text-sm text-red-600">{errors.users}</p>}
                      
                      {selectedUsers.length > 0 && (
                        <p className="mt-2 text-sm text-slate-600">
                          Số tiền mỗi người: {amount && !isNaN(Number(amount)) ? 
                            Math.round(Number(amount) / selectedUsers.length).toLocaleString('vi-VN') : '0'} VND
                        </p>
                      )}
                    </div>
                </div>

                {/* Submit */}
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="heading-md">Tạo đợt thu</h3>
                      <p className="text-muted mt-1">
                        Kiểm tra lại thông tin và tạo đợt thu tiền
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <SpinnerIcon className="mr-2 h-4 w-4 text-white" />
                          Đang tạo...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreateIcon className="w-4 h-4 mr-2" />
                          Tạo đợt thu
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {errors.submit && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Summary */}
                <div className="card">
                  <h3 className="heading-md mb-4">Tổng quan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Số người:</span>
                      <span className="font-medium">{selectedUsers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Tổng tiền:</span>
                      <span className="font-bold text-slate-900">
                        {amount && !isNaN(Number(amount)) ? 
                          Number(amount).toLocaleString('vi-VN') : '0'} VND
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-muted">Mỗi người:</span>
                        <span className="font-bold text-emerald-600">
                          {amount && !isNaN(Number(amount)) && selectedUsers.length > 0 ? 
                            Math.round(Number(amount) / selectedUsers.length).toLocaleString('vi-VN') : '0'} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participants Preview */}
                {selectedUsers.length > 0 && (
                  <div className="card">
                    <h3 className="heading-md mb-4">Danh sách người tham gia</h3>
                    <div className="space-y-2">
                      {selectedUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-900">{user.name}</span>
                          <span className="text-sm text-emerald-600 font-semibold">
                            {amount && !isNaN(Number(amount)) ? 
                              Math.round(Number(amount) / selectedUsers.length).toLocaleString('vi-VN') : '0'} VND
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="card bg-blue-50 border-blue-200">
                  <h3 className="heading-md mb-3 text-blue-900">💡 Mẹo</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Thêm mô tả để mọi người hiểu rõ chi phí</li>
                    <li>• Kiểm tra danh sách trước khi tạo</li>
                    <li>• Thông báo sẽ được gửi qua Slack</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 