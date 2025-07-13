import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { expenseAPI } from '@/lib/api';
import { formatCurrency } from '../utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyLogo } from '@/components/Icons';

interface RankingItem {
  userId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  completedExpenses: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '7d'>('all');
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    fetchRanking();
  }, [timeFilter]);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getRanking();
      setRanking(response.ranking);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '1';
    if (rank === 2) return '2';
    if (rank === 3) return '3';
    return rank.toString();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-amber-400 to-amber-600';
      case 2: return 'from-slate-300 to-slate-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getBorderColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-amber-200';
      case 2: return 'border-slate-200';
      case 3: return 'border-orange-200';
      default: return 'border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Leaderboard - PolitePay</title>
        <meta name="description" content="Top contributors and expense collectors" />
      </Head>
      
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8rounded-lg flex items-center justify-center">
                    <CompanyLogo />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">PolitePay</h1>
                  <p className="text-xs text-slate-500">Expense Tracker</p>
                </div>
              </div>

              {/* Action */}
              <div>
                {currentUser ? (
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Leaderboard
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Recognizing team members who consistently step up to handle group payments
            </p>

            {/* Time Filter */}
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              {[
                { key: 'all', label: 'All Time' },
                { key: '30d', label: '30 Days' },
                { key: '7d', label: '7 Days' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-slate-900 mb-1">{ranking.length}</div>
                <div className="text-sm text-slate-600">Contributors</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {ranking.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('vi-VN')}
                </div>
                <div className="text-sm text-slate-600">Total Amount</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {ranking.reduce((sum, item) => sum + item.completedExpenses, 0)}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {ranking.length > 0 ? Math.round(ranking.reduce((sum, item) => sum + item.totalAmount, 0) / ranking.length).toLocaleString('vi-VN') : 0}
                </div>
                <div className="text-sm text-slate-600">Average</div>
              </div>
            </div>
          </div>
        </section>

        {/* Top 3 Podium */}
        {ranking.length >= 3 && (
          <section className="px-6 mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">Top Contributors</h2>
                
                <div className="flex items-end justify-center space-x-8">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="w-24 h-20 bg-gradient-to-t from-slate-200 to-slate-400 rounded-t-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">2</span>
                    </div>
                                         <div className="bg-white p-6 rounded-lg shadow-md border-2 border-slate-200 mt-4 min-w-[160px]">
                       <div className="font-semibold text-slate-900 mb-2">
                         {ranking[1]?.userName}
                         {currentUser && (currentUser.id === ranking[1]?.userId || currentUser.email === ranking[1]?.userEmail) && (
                           <span className="text-xs text-blue-600 font-medium ml-1">(you)</span>
                         )}
                       </div>
                       <div className="text-lg font-bold text-slate-900 mb-1">{formatCurrency(ranking[1]?.totalAmount)}</div>
                       <div className="text-sm text-slate-500">{ranking[1]?.completedExpenses} expenses</div>
                     </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="w-28 h-24 bg-gradient-to-t from-amber-300 to-amber-500 rounded-t-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-3xl">1</span>
                    </div>
                                         <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200 mt-4 min-w-[160px]">
                       <div className="font-bold text-slate-900 mb-2">
                         {ranking[0]?.userName}
                         {currentUser && (currentUser.id === ranking[0]?.userId || currentUser.email === ranking[0]?.userEmail) && (
                           <span className="text-xs text-blue-600 font-medium ml-1">(you)</span>
                         )}
                       </div>
                       <div className="text-xl font-bold text-slate-900 mb-1">{formatCurrency(ranking[0]?.totalAmount)}</div>
                       <div className="text-sm text-slate-500">{ranking[0]?.completedExpenses} expenses</div>
                     </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="w-24 h-16 bg-gradient-to-t from-orange-300 to-orange-500 rounded-t-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">3</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-200 mt-4 min-w-[160px]">
                      <div className="font-semibold text-slate-900 mb-2">
                        {ranking[2]?.userName}
                        {currentUser && (currentUser.id === ranking[2]?.userId || currentUser.email === ranking[2]?.userEmail) && (
                          <span className="text-xs text-blue-600 font-medium ml-1">(you)</span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-slate-900 mb-1">{formatCurrency(ranking[2]?.totalAmount)}</div>
                      <div className="text-sm text-slate-500">{ranking[2]?.completedExpenses} expenses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Full Rankings */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">All Contributors</h2>
                <p className="text-sm text-slate-600 mt-1">Complete ranking of all team members</p>
              </div>
              
              {ranking.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No data yet</h3>
                  <p className="text-slate-600 mb-6">Rankings will appear here once expense collections begin</p>
                  {!currentUser && (
                    <Link 
                      href="/login" 
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {ranking.map((item, index) => {
                    const rank = index + 1;
                    
                    return (
                      <div key={item.userId} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm bg-gradient-to-br ${getRankColor(rank)}`}>
                            {getRankIcon(rank)}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-slate-900">{item.userName}</h3>
                                  {currentUser && (currentUser.id === item.userId || currentUser.email === item.userEmail) && (
                                    <span className="text-xs text-blue-600 font-medium">(you)</span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500">{item.userEmail}</p>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold text-slate-900">
                                  {formatCurrency(item.totalAmount)}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {item.completedExpenses} expenses
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA */}
            {!currentUser && ranking.length > 0 && (
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to join?</h3>
                  <p className="mb-6 opacity-90 max-w-lg mx-auto">
                    Start tracking your team expenses and see where you rank among contributors.
                  </p>
                  <Link 
                    href="/login" 
                    className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                  >
                    Sign In Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
} 