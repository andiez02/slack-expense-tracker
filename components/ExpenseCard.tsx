import React from 'react';
import { CheckIcon, ClockIcon, EyeIcon } from './Icons';

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
  qr_url: string;
  created_at: string;
  participants: ExpenseParticipant[];
}

interface ExpenseCardProps {
  expense: Expense;
  onViewDetails?: (expenseId: number) => void;
}

// ExpenseCard Component - Thẻ hiển thị thông tin đợt thu tiền
export default function ExpenseCard({ expense, onViewDetails }: ExpenseCardProps) {
  const totalParticipants = expense.participants.length;
  const paidCount = expense.participants.filter(p => p.status === 'paid').length;
  const progress = totalParticipants > 0 ? (paidCount / totalParticipants) * 100 : 0;
  
  return (
    <div className="card-hover">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-h-20">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {expense.title}
            </h3>
            <p className="text-sm text-muted">
              {new Date(expense.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              {expense.amount.toLocaleString('vi-VN')} VND
            </p>
            <p className="text-sm text-muted">mỗi người</p>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted">Tiến độ thanh toán</span>
            <span className="text-sm font-medium text-slate-900">
              {paidCount}/{totalParticipants} người
            </span>
          </div>
          <div className="progress">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="flex gap-2 mb-4">
          {paidCount > 0 && (
            <span className="badge-success">
              <CheckIcon className="w-3 h-3 mr-1" />
              {paidCount} đã thanh toán
            </span>
          )}
          {totalParticipants - paidCount > 0 && (
            <span className="badge-warning">
              <ClockIcon className="w-3 h-3 mr-1" />
              {totalParticipants - paidCount} chưa thanh toán
            </span>
          )}
        </div>
        
        {/* View button */}
        <button
          onClick={() => onViewDetails?.(expense.id)}
          className="btn btn-ghost btn-sm w-full"
        >
          <EyeIcon className="w-4 h-4 mr-2" />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
} 