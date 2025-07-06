import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotifications } from '../hooks';
import { 
  CheckIcon, 
  ClockIcon, 
  CloseIcon, 
  SpinnerIcon, 
  BellIcon, 
  DocumentIcon,
  CurrencyIcon,
  UsersIcon 
} from './Icons';

interface ExpenseParticipant {
  id: number;
  user_slack_id: string;
  name: string;
  status: 'pending' | 'paid';
  paid_at?: string;
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  qr_url?: string;
  created_at: string;
  participants: ExpenseParticipant[];
}

interface ExpenseDetailModalProps {
  expenseId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

function UserStatusRow({ participant, amount }: { participant: ExpenseParticipant; amount: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      {/* User Avatar & Info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-slate-700 text-sm font-medium">
            {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-slate-900">{participant.name}</h4>
          <p className="text-sm text-muted">@{participant.user_slack_id}</p>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right mr-4">
        <p className="font-semibold text-slate-900">{amount.toLocaleString('vi-VN')} VND</p>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        {participant.status === 'paid' ? (
          <div className="flex items-center">
            <span className="badge-success">
              <CheckIcon className="w-3 h-3 mr-1" />
              Đã trả
            </span>
            {participant.paid_at && (
              <p className="text-xs text-muted ml-2">
                {new Date(participant.paid_at).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
        ) : (
          <span className="badge-warning">
            <ClockIcon className="w-3 h-3 mr-1" />
            Chưa trả
          </span>
        )}
      </div>
    </div>
  );
}

export default function ExpenseDetailModal({ expenseId, isOpen, onClose }: ExpenseDetailModalProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(false);
  
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isOpen && expenseId) {
      fetchExpenseDetail(expenseId);
    }
  }, [isOpen, expenseId]);

  const fetchExpenseDetail = async (id: number) => {
    setLoading(true);
    try {
      // TODO: Implement API call to fetch expense detail
      // const response = await axios.get(`/api/expenses/${id}`);
      // setExpense(response.data);
      
      // Mock data for now
      setExpense({
        id: id,
        title: 'Tiền cà phê tháng 12',
        amount: 50000,
        qr_url: 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=QR+Code',
        created_at: '2023-12-01T10:00:00Z',
        participants: [
          { id: 1, user_slack_id: 'nguyenvana', name: 'Nguyễn Văn A', status: 'paid', paid_at: '2023-12-01T11:00:00Z' },
          { id: 2, user_slack_id: 'tranthib', name: 'Trần Thị B', status: 'pending' },
          { id: 3, user_slack_id: 'lethic', name: 'Lê Thị C', status: 'paid', paid_at: '2023-12-02T09:00:00Z' },
          { id: 4, user_slack_id: 'phamthid', name: 'Phạm Thị D', status: 'pending' },
          { id: 5, user_slack_id: 'levane', name: 'Lê Văn E', status: 'paid', paid_at: '2023-12-01T15:00:00Z' },
        ]
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi tải dữ liệu',
        message: 'Không thể tải thông tin chi tiết đợt thu tiền. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    try {
      // TODO: Implement API call to send reminder
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      
      const pendingUsers = expense?.participants.filter(p => p.status === 'pending') || [];
      addNotification({
        type: 'success',
        title: 'Đã gửi nhắc nhở',
        message: `Đã gửi nhắc nhở qua Slack đến ${pendingUsers.length} người chưa thanh toán.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi gửi nhắc nhở',
        message: 'Có lỗi xảy ra khi gửi nhắc nhở. Vui lòng thử lại.'
      });
    } finally {
      setSendingReminder(false);
    }
  };

  if (!isOpen) return null;

  const paidCount = expense?.participants.filter(p => p.status === 'paid').length || 0;
  const totalCount = expense?.participants.length || 0;
  const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
  const totalCollected = paidCount * (expense?.amount || 0);
  const remainingAmount = (totalCount - paidCount) * (expense?.amount || 0);
  const pendingUsers = expense?.participants.filter(p => p.status === 'pending') || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="ml-4">
                  <h2 className="heading-lg">{expense?.title || 'Chi tiết đợt thu'}</h2>
                  <p className="text-sm text-muted">
                    {expense && new Date(expense.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm w-10 h-10 rounded-full p-0"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <SpinnerIcon className="h-8 w-8 text-blue-600 mx-auto" />
                  <p className="mt-4 text-muted">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : !expense ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-md mb-2">Không tìm thấy đợt thu tiền</h3>
                <p className="text-muted">Đợt thu tiền này có thể đã bị xóa hoặc không tồn tại.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Statistics */}
                  <div className="card">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CurrencyIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="heading-md ml-3">Thống kê</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-2xl font-bold text-slate-900">{expense.amount.toLocaleString('vi-VN')}</p>
                        <p className="text-sm text-muted">VND/người</p>
                      </div>
                      <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-600">{totalCollected.toLocaleString('vi-VN')}</p>
                        <p className="text-sm text-emerald-700">Đã thu</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600">{remainingAmount.toLocaleString('vi-VN')}</p>
                        <p className="text-sm text-amber-700">Còn lại</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">{progress.toFixed(0)}%</p>
                        <p className="text-sm text-blue-700">Hoàn thành</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Tiến độ thanh toán</span>
                        <span className="font-medium text-slate-900">{paidCount}/{totalCount} người</span>
                      </div>
                      <div className="progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <UsersIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="heading-md ml-3">Danh sách người tham gia</h3>
                      </div>
                      
                      {pendingUsers.length > 0 && (
                        <button
                          onClick={handleSendReminder}
                          disabled={sendingReminder}
                          className="btn btn-primary btn-sm"
                        >
                          {sendingReminder ? (
                            <div className="flex items-center">
                              <SpinnerIcon className="mr-2 h-3 w-3 text-white" />
                              Đang gửi...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <BellIcon className="w-3 h-3 mr-2" />
                              Nhắc nhở ({pendingUsers.length})
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {expense.participants.map((participant) => (
                        <UserStatusRow
                          key={participant.id}
                          participant={participant}
                          amount={expense.amount}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* QR Code */}
                  {expense.qr_url && (
                    <div className="card text-center">
                      <h3 className="heading-md mb-4">QR Code thanh toán</h3>
                      <div className="w-48 h-48 mx-auto mb-4 border-2 border-slate-200 rounded-xl overflow-hidden">
                        <img 
                          src={expense.qr_url} 
                          alt="QR Code thanh toán" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted">
                        Quét mã để thanh toán {expense.amount.toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="card">
                    <h3 className="heading-md mb-4">Thao tác nhanh</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleSendReminder}
                        disabled={sendingReminder || pendingUsers.length === 0}
                        className="btn btn-primary btn-md w-full"
                      >
                        <BellIcon className="w-4 h-4 mr-2" />
                        Gửi tin nhắn Slack
                      </button>
                      
                      <button
                        className="btn btn-secondary btn-md w-full"
                        onClick={() => addNotification({
                          type: 'info',
                          title: 'Tính năng đang phát triển',
                          message: 'Chức năng chỉnh sửa thông tin sẽ được cập nhật trong phiên bản tiếp theo.'
                        })}
                      >
                        <DocumentIcon className="w-4 h-4 mr-2" />
                        Chỉnh sửa thông tin
                      </button>
                    </div>
                  </div>

                  {/* Summary Info */}
                  <div className="card">
                    <h3 className="heading-md mb-4">Tóm tắt</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Tổng người tham gia:</span>
                        <span className="font-medium">{totalCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Đã thanh toán:</span>
                        <span className="font-medium text-emerald-600">{paidCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Chưa thanh toán:</span>
                        <span className="font-medium text-amber-600">{pendingUsers.length}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-muted">Tổng tiền dự kiến:</span>
                          <span className="font-bold text-slate-900">
                            {(totalCount * expense.amount).toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 