import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import { useNotifications } from '../hooks';
import { 
  HistoryIcon, 
  SpinnerIcon, 
  CheckIcon, 
  ClockIcon, 
  CloseIcon, 
  DocumentIcon,
  CurrencyIcon,
  EyeIcon,
  UsersIcon
} from '../components/Icons';

interface Expense {
  id: number;
  title: string;
  amount: number;
  qr_url: string;
  created_at: string;
  participants: ExpenseParticipant[];
}

interface ExpenseParticipant {
  id: number;
  user_slack_id: string;
  name: string;
  status: 'pending' | 'paid';
  paid_at?: string;
}

export default function History() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState({
    total_expenses: 0,
    total_amount: 0,
    completed_payments: 0,
    pending_payments: 0
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // Mock API call
      const mockExpenses = [
        {
          id: 1,
          title: 'Tiền cà phê tháng 12',
          amount: 50000,
          qr_url: 'https://example.com/qr1',
          created_at: '2023-12-01T10:00:00Z',
          participants: [
            { id: 1, user_slack_id: 'nguyenvana', name: 'Nguyễn Văn A', status: 'paid' as const, paid_at: '2023-12-01T11:00:00Z' },
            { id: 2, user_slack_id: 'tranthib', name: 'Trần Thị B', status: 'pending' as const },
            { id: 3, user_slack_id: 'lethic', name: 'Lê Thị C', status: 'paid' as const, paid_at: '2023-12-02T09:00:00Z' },
          ]
        },
        {
          id: 2,
          title: 'Tiền ăn trưa team',
          amount: 120000,
          qr_url: 'https://example.com/qr2',
          created_at: '2023-12-02T11:00:00Z',
          participants: [
            { id: 4, user_slack_id: 'phamthid', name: 'Phạm Thị D', status: 'paid' as const, paid_at: '2023-12-02T12:00:00Z' },
            { id: 5, user_slack_id: 'levane', name: 'Lê Văn E', status: 'paid' as const, paid_at: '2023-12-02T13:00:00Z' },
          ]
        },
        {
          id: 3,
          title: 'Tiền mua quà Tết',
          amount: 200000,
          qr_url: 'https://example.com/qr3',
          created_at: '2023-12-03T09:00:00Z',
          participants: [
            { id: 6, user_slack_id: 'vuthif', name: 'Vũ Thị F', status: 'paid' as const, paid_at: '2023-12-03T10:00:00Z' },
            { id: 7, user_slack_id: 'dangvang', name: 'Đặng Văn G', status: 'pending' as const },
            { id: 8, user_slack_id: 'hoangthih', name: 'Hoàng Thị H', status: 'pending' as const },
          ]
        },
        {
          id: 4,
          title: 'Tiền sinh nhật team',
          amount: 80000,
          qr_url: 'https://example.com/qr4',
          created_at: '2023-12-04T14:00:00Z',
          participants: [
            { id: 9, user_slack_id: 'nguyenvani', name: 'Nguyễn Văn I', status: 'paid' as const, paid_at: '2023-12-04T15:00:00Z' },
            { id: 10, user_slack_id: 'tranthij', name: 'Trần Thị J', status: 'paid' as const, paid_at: '2023-12-04T16:00:00Z' },
            { id: 11, user_slack_id: 'levank', name: 'Lê Văn K', status: 'paid' as const, paid_at: '2023-12-04T17:00:00Z' },
            { id: 12, user_slack_id: 'phamthil', name: 'Phạm Thị L', status: 'pending' as const },
          ]
        },
        {
          id: 5,
          title: 'Tiền đóng góp quỹ văn phòng',
          amount: 150000,
          qr_url: 'https://example.com/qr5',
          created_at: '2023-12-05T16:00:00Z',
          participants: [
            { id: 13, user_slack_id: 'hoangvanm', name: 'Hoàng Văn M', status: 'pending' as const },
            { id: 14, user_slack_id: 'nguyenthin', name: 'Nguyễn Thị N', status: 'pending' as const },
            { id: 15, user_slack_id: 'vuvanp', name: 'Vũ Văn P', status: 'pending' as const },
          ]
        }
      ];

      setExpenses(mockExpenses);
      
      // Calculate stats
      const totalAmount = mockExpenses.reduce((sum, e) => sum + e.amount * e.participants.length, 0);
      const completedPayments = mockExpenses.reduce((sum, e) => sum + e.participants.filter(p => p.status === 'paid').length * e.amount, 0);
      const pendingPayments = mockExpenses.reduce((sum, e) => sum + e.participants.filter(p => p.status === 'pending').length * e.amount, 0);
      
      setStats({
        total_expenses: mockExpenses.length,
        total_amount: totalAmount,
        completed_payments: completedPayments,
        pending_payments: pendingPayments
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi tải dữ liệu',
        message: 'Không thể tải danh sách đợt thu tiền. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpenseId(null);
  };

  // Filter expenses based on status
  const filteredExpenses = expenses.filter(expense => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') {
      return expense.participants.every(p => p.status === 'paid');
    }
    if (filterStatus === 'pending') {
      return expense.participants.some(p => p.status === 'pending');
    }
    return true;
  });

  // Calculate completion percentage for each expense
  const getCompletionPercentage = (expense: Expense) => {
    const paidCount = expense.participants.filter(p => p.status === 'paid').length;
    return Math.round((paidCount / expense.participants.length) * 100);
  };

  // Calculate how much is collected for each expense
  const getCollectedAmount = (expense: Expense) => {
    const paidCount = expense.participants.filter(p => p.status === 'paid').length;
    return paidCount * expense.amount;
  };

  // Calculate total expected amount for each expense
  const getTotalExpectedAmount = (expense: Expense) => {
    return expense.participants.length * expense.amount;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <SpinnerIcon className="h-8 w-8 text-blue-600 mx-auto" />
          <p className="mt-4 text-muted">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Lịch sử - Politetech Expense Tracker</title>
        <meta name="description" content="Xem lại tất cả các đợt thu tiền đã thực hiện" />
      </Head>
      
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-xl mb-2">Lịch sử đợt thu</h1>
          <p className="text-muted">Xem lại tất cả các đợt thu tiền đã thực hiện</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="ml-4">
                <p className="text-subtle text-sm">Tổng đợt thu</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total_expenses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CurrencyIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-subtle text-sm">Tổng tiền</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total_amount.toLocaleString('vi-VN')}</p>
                <p className="text-xs text-subtle">VND</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-subtle text-sm">Đã thu</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completed_payments.toLocaleString('vi-VN')}</p>
                <p className="text-xs text-subtle">VND</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-subtle text-sm">Còn lại</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pending_payments.toLocaleString('vi-VN')}</p>
                <p className="text-xs text-subtle">VND</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            Tất cả ({expenses.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`btn ${filterStatus === 'completed' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            Hoàn thành ({expenses.filter(e => e.participants.every(p => p.status === 'paid')).length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`btn ${filterStatus === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            Chưa hoàn thành ({expenses.filter(e => e.participants.some(p => p.status === 'pending')).length})
          </button>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="heading-md mb-2">Không có đợt thu nào</h3>
              <p className="text-muted">Không tìm thấy đợt thu nào phù hợp với bộ lọc hiện tại</p>
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const completionPercentage = getCompletionPercentage(expense);
              const collectedAmount = getCollectedAmount(expense);
              const totalExpectedAmount = getTotalExpectedAmount(expense);
              const paidCount = expense.participants.filter(p => p.status === 'paid').length;
              const totalCount = expense.participants.length;

              return (
                <div key={expense.id} className="card-hover">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="heading-md mb-1">{expense.title}</h3>
                        <p className="text-sm text-muted mb-3">
                          {new Date(expense.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <UsersIcon className="w-4 h-4 text-slate-500 mr-1" />
                            <span className="text-muted">{totalCount} người</span>
                          </div>
                          <div className="flex items-center">
                            <CurrencyIcon className="w-4 h-4 text-slate-500 mr-1" />
                            <span className="text-muted">{expense.amount.toLocaleString('vi-VN')} VND/người</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          {collectedAmount.toLocaleString('vi-VN')} VND
                        </p>
                        <p className="text-sm text-muted">
                          / {totalExpectedAmount.toLocaleString('vi-VN')} VND
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted">Tiến độ</span>
                        <span className="text-sm font-medium text-slate-900">{completionPercentage}%</span>
                      </div>
                      <div className="progress">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Status badges and actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {completionPercentage === 100 ? (
                          <span className="badge-success">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Hoàn thành
                          </span>
                        ) : completionPercentage > 0 ? (
                          <span className="badge-info">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            Đang thu ({paidCount}/{totalCount})
                          </span>
                        ) : (
                          <span className="badge-warning">
                            <CloseIcon className="w-3 h-3 mr-1" />
                            Chưa bắt đầu
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleViewDetails(expense.id)}
                        className="btn btn-ghost btn-sm"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal */}
        {showModal && selectedExpenseId !== null && (
          <ExpenseDetailModal
            expenseId={selectedExpenseId}
            isOpen={showModal}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
} 