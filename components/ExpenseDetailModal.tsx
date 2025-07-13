import { useState, useEffect } from 'react';
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
import { expenseAPI, slackbotAPI, userAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

interface ExpenseItem {
  userId: string;
  userConfirmed?: boolean;
  collectorConfirmed?: boolean;
  confirmedAt?: Date;
  note?: string;
}

interface Expense {
  id: string;
  title: string;
  description?: string;
  channelId: string;
  qrImage?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  items: ExpenseItem[];
}

interface ExpenseDetailModalProps {
  expenseId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdate?: (updatedExpense: Expense) => void;
}

function UserStatusRow({ item, expenseId, isCollector, onConfirmPayment }: { 
  item: ExpenseItem; 
  expenseId: string;
  isCollector: boolean;
  onConfirmPayment: (userId: string) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userAPI.getMemberBySlackId(item.userId);
      setUser(response);
    };
    fetchUser();
  }, [item.userId]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirmPayment(item.userId);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      {/* User Avatar & Info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-slate-700 text-sm font-medium">
            {user?.avatar ? <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" /> : <span className="text-slate-700 text-sm font-medium">{user?.name?.substring(0, 2).toUpperCase()}</span>}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-slate-900">{user?.real_name}</h4>
          <p className="text-sm text-muted">@{user?.name}</p>
        </div>
      </div>

      {/* Note */}
      {item.note && (
        <div className="text-right mr-4">
          <p className="text-sm text-slate-600">{item.note}</p>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center space-x-2">
        {!item.userConfirmed ? (
          <span className="badge-warning">
            <ClockIcon className="w-3 h-3 mr-1" />
            Chưa trả
          </span>
        ) : !item.collectorConfirmed ? (
          <>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Chờ xác nhận
            </span>
            {isCollector && (
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="btn btn-primary btn-sm ml-2"
              >
                {confirming ? (
                  <div className="flex items-center">
                    <SpinnerIcon className="mr-1 h-3 w-3 text-white" />
                    Đang xác nhận...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckIcon className="w-3 h-3 mr-1" />
                    Xác nhận nhận tiền
                  </div>
                )}
              </button>
            )}
          </>
        ) : (
          <span className="badge-success">
            <CheckIcon className="w-3 h-3 mr-1" />
            Đã xác nhận
          </span>
        )}
      </div>
    </div>
  );
}

export default function ExpenseDetailModal({ expenseId, isOpen, onClose, onExpenseUpdate }: ExpenseDetailModalProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [channelName, setChannelName] = useState<string>('');
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (isOpen && expenseId) {
      fetchExpenseDetail(expenseId);
    }
  }, [isOpen, expenseId]);

  const fetchExpenseDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await expenseAPI.getExpenseById(id);
      setExpense(response);
      
      // Fetch channel name if channelId exists
      if (response.channelId) {
        try {
          const channels = await slackbotAPI.getJoinedChannels();
          const channel = channels.channels.find((ch: any) => ch.id === response.channelId);
          setChannelName(channel?.name || response.channelId);
        } catch (error) {
          console.error('Error fetching channel name:', error);
          setChannelName(response.channelId);
        }
      }
    } catch (error) {
      console.error('Error fetching expense detail:', error);
      setExpense(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (payerUserId: string) => {
    if (!expense) return;

    // Optimistically update local state first
    const updatedExpense = {
      ...expense,
      items: expense.items.map(item => 
        item.userId === payerUserId 
          ? { ...item, collectorConfirmed: true }
          : item
      )
    };
    
    // Update local modal state
    setExpense(updatedExpense);
    
    // Update parent history page state
    onExpenseUpdate?.(updatedExpense);

    try {
      // Then make API call
      await expenseAPI.confirmPaymentViaWeb(expense.id, payerUserId);
      
      // Show success message
      toast.success('Đã xác nhận nhận được tiền!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      // Revert optimistic update on error
      setExpense(expense);
      onExpenseUpdate?.(expense);
      
      alert('❌ Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
    }
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    try {
      // TODO: Implement API call to send reminder to unpaid users
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      
      const pendingUsers = expense?.items.filter(item => !item.userConfirmed) || [];
      console.log('Sending reminder to:', pendingUsers);
    } catch (error) {
      console.error('Error sending reminder:', error);
    } finally {
      setSendingReminder(false);
    }
  };

  if (!isOpen) return null;

  const unpaidCount = expense?.items.filter(item => !item.userConfirmed).length || 0;
  const paidPendingCount = expense?.items.filter(item => item.userConfirmed && !item.collectorConfirmed).length || 0;
  const confirmedCount = expense?.items.filter(item => item.userConfirmed && item.collectorConfirmed).length || 0;
  const totalCount = expense?.items.length || 0;
  const progress = totalCount > 0 ? (confirmedCount / totalCount) * 100 : 0;
  const pendingUsers = expense?.items.filter(item => !item.userConfirmed || !item.collectorConfirmed) || [];

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
                    {expense && new Date(expense.createdAt).toLocaleDateString('vi-VN', {
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
                        <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
                        <p className="text-sm text-muted">Người tham gia</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600">{unpaidCount}</p>
                        <p className="text-sm text-amber-700">Chưa thanh toán</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">{paidPendingCount}</p>
                        <p className="text-sm text-blue-700">Chờ xác nhận</p>
                      </div>
                      <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-600">{confirmedCount}</p>
                        <p className="text-sm text-emerald-700">Đã xác nhận</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted">Tiến độ thanh toán</span>
                        <span className="font-medium text-slate-900">{confirmedCount}/{totalCount} người</span>
                      </div>
                      <div className="progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {expense.description && (
                    <div className="card">
                      <h3 className="heading-md mb-3">Mô tả</h3>
                      <p className="text-slate-700">{expense.description}</p>
                    </div>
                  )}

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
                      {expense.items.map((item, index) => (
                        <UserStatusRow
                          key={`${item.userId}-${index}`}
                          item={item}
                          expenseId={expense.id}
                          isCollector={currentUser?.id === expense.createdBy.id}
                          onConfirmPayment={(userId) => handleConfirmPayment(userId)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* QR Code */}
                  {/* Expense Info */}
                  <div className="card">
                    <h3 className="heading-md mb-4">Thông tin</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Người tạo:</span>
                        <span className="font-medium">{expense.createdBy.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Email:</span>
                        <span className="font-medium">{expense.createdBy.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Channel:</span>
                        <span className="font-medium text-xs">{channelName || expense.channelId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Ngày tạo:</span>
                        <span className="font-medium">
                          {new Date(expense.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
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
                        <span className="text-muted">Chưa thanh toán:</span>
                        <span className="font-medium text-amber-600">{unpaidCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Chờ xác nhận:</span>
                        <span className="font-medium text-blue-600">{paidPendingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Đã xác nhận:</span>
                        <span className="font-medium text-emerald-600">{confirmedCount}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-muted">Tiến độ:</span>
                          <span className="font-bold text-slate-900">
                            {progress.toFixed(0)}%
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