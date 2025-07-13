import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import Pagination from '../components/ui/Pagination';
import SearchFilter from '../components/ui/SearchFilter';
import { 
  SpinnerIcon, 
  CheckIcon, 
  ClockIcon, 
  EyeIcon,
  UsersIcon
} from '../components/Icons';
import { expenseAPI } from '@/lib/api';
import { formatNumber } from '../utils/constants';

interface Expense {
  id: string;
  title: string;
  description?: string;
  channelId: string;
  qrImage?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  items: ExpenseItem[];
}

interface ExpenseItem {
  userId: string;
  userConfirmed?: boolean;
  collectorConfirmed?: boolean;
  confirmedAt?: Date;
  note?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OverallStats {
  total: number;
  completed: number;
  pending: number;
}

interface PaginatedExpensesResponse {
  data: Expense[];
  pagination: PaginationData;
  stats: OverallStats;
}

interface SearchOptions {
  title?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function History() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({});
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [overallStats, setOverallStats] = useState<OverallStats>({
    total: 0,
    completed: 0,
    pending: 0,
  });
  
  useEffect(() => {
    fetchExpenses(currentPage, searchOptions);
  }, [currentPage]);

  const fetchExpenses = async (page: number = 1, search: SearchOptions = {}) => {
    try {
      setLoading(true);
      const response: PaginatedExpensesResponse = await expenseAPI.getAllExpenses(page, 10, search);
      setExpenses(response.data);
      setPagination(response.pagination);
      setOverallStats(response.stats);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (newSearchOptions: SearchOptions) => {
    setSearchOptions(newSearchOptions);
    setCurrentPage(1); // Reset to first page when searching
    fetchExpenses(1, newSearchOptions);
  };

  const handleViewDetails = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpenseId(null);
  };

  const handleExpenseUpdate = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  // Filter expenses based on status
  const filteredExpenses = expenses.filter(expense => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') {
      return expense.items.every(item => item.userConfirmed && item.collectorConfirmed);
    }
    if (filterStatus === 'pending') {
      return expense.items.some(item => !item.userConfirmed || !item.collectorConfirmed);
    }
    return true;
  });

  // Calculate completion percentage for each expense
  const getCompletionPercentage = (expense: Expense) => {
    if (expense.items.length === 0) return 0;
    const paidCount = expense.items.filter((item) => item.userConfirmed && item.collectorConfirmed).length;
    return Math.round((paidCount / expense.items.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calculate filter tab counts for current page data
  const currentPageCompleted = expenses.filter(e => e.items.every(i => i.userConfirmed && i.collectorConfirmed)).length;
  const currentPagePending = expenses.filter(e => e.items.some(i => !i.userConfirmed || !i.collectorConfirmed)).length;

  if (loading && currentPage === 1 && !expenses.length) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <SpinnerIcon className="h-8 w-8 text-blue-600 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Lịch sử giao dịch - PolitePay</title>
        <meta name="description" content="Xem lại tất cả các đợt thu tiền đã thực hiện" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {/* Search Filter */}
          <SearchFilter onSearch={handleSearch} loading={loading} />

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{overallStats.total}</p>
                <p className="text-sm text-gray-600">Tổng đợt thu</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {overallStats.completed}
                </p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {overallStats.pending}
                </p>
                <p className="text-sm text-gray-600">Đang chờ</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white rounded-2xl p-1 mb-6 shadow-sm">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tất cả ({expenses.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filterStatus === 'pending' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Đang chờ ({currentPagePending})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                filterStatus === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Hoàn thành ({currentPageCompleted})
            </button>
          </div>

          {/* Loading state for pagination */}
          {loading && (
            <div className="flex justify-center py-4">
              <SpinnerIcon className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Expenses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {filteredExpenses.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch nào</h3>
                <p className="text-gray-600">
                  {Object.keys(searchOptions).length > 0 && Object.values(searchOptions).some(v => v)
                    ? 'Không tìm thấy giao dịch nào phù hợp với bộ lọc'
                    : filterStatus === 'all' 
                      ? 'Chưa có đợt thu tiền nào được tạo' 
                      : `Không có giao dịch nào ${filterStatus === 'completed' ? 'hoàn thành' : 'đang chờ'} trên trang này`
                  }
                </p>
              </div>
            ) : (
              filteredExpenses.map((expense) => {
                const completionPercentage = getCompletionPercentage(expense);
                const paidCount = expense.items.filter(i => i.userConfirmed && i.collectorConfirmed).length;
                const totalCount = expense.items.length;

                return (
                  <div key={expense.id} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{expense.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">{formatDate(expense.createdAt)}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <UsersIcon className="w-3 h-3 mr-1" />
                              <span>{totalCount}</span>
                            </div>
                            {expense.amount && (
                              <div className="text-green-600 font-semibold text-lg">
                                {formatNumber(expense.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {completionPercentage === 100 ? (
                          <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-md">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">Xong</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">Chờ</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all ${
                                  completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {paidCount}/{totalCount}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleViewDetails(expense.id)}
                            className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <EyeIcon className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">Chi tiết</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
            total={pagination.total}
            limit={pagination.limit}
          />
        </div>

        {/* Modal */}
        {showModal && selectedExpenseId !== null && (
          <ExpenseDetailModal
            expenseId={selectedExpenseId}
            isOpen={showModal}
            onClose={handleCloseModal}
            onExpenseUpdate={handleExpenseUpdate}
          />
        )}
      </div>
    </>
  );
} 