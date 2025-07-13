import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (searchOptions: { title?: string; dateFrom?: string; dateTo?: string }) => void;
  loading?: boolean;
}

export default function SearchFilter({ onSearch, loading = false }: SearchFilterProps) {
  const [title, setTitle] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch({
      title: title.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  };

  const handleClear = () => {
    setTitle('');
    setDateFrom('');
    setDateTo('');
    onSearch({});
  };

  const handleQuickDateFilter = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    const dateFromStr = pastDate.toISOString().split('T')[0];
    const dateToStr = today.toISOString().split('T')[0];
    
    setDateFrom(dateFromStr);
    setDateTo(dateToStr);
    
    onSearch({
      title: title.trim() || undefined,
      dateFrom: dateFromStr,
      dateTo: dateToStr,
    });
  };

  const hasActiveFilters = title.trim() || dateFrom || dateTo;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="font-medium text-gray-900">Tìm kiếm & Lọc</h3>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {[title.trim(), dateFrom, dateTo].filter(Boolean).length}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <span className="text-sm">{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            <svg 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Inline Quick Search + Active Filters */}
        <div className="mt-2 space-y-2">
          {/* Quick Search Bar */}
          <div className="relative">
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tìm theo tiêu đề..."
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {title && (
              <button
                onClick={() => setTitle('')}
                className="absolute right-2 top-2 p-0.5 hover:bg-gray-100 rounded"
              >
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Nhanh:</span>
              <button
                onClick={() => handleQuickDateFilter(7)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                7d
              </button>
              <button
                onClick={() => handleQuickDateFilter(30)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                30d
              </button>
              <button
                onClick={() => handleQuickDateFilter(90)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                3m
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Tìm...' : 'Tìm'}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-2 py-1.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Preview (compact) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1 text-xs">
              {title.trim() && (
                <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  "{title.trim()}"
                </span>
              )}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded">
                  {dateFrom && dateTo 
                    ? `${new Date(dateFrom).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${new Date(dateTo).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`
                    : dateFrom 
                      ? `Từ ${new Date(dateFrom).toLocaleDateString('vi-VN')}`
                      : `Đến ${new Date(dateTo).toLocaleDateString('vi-VN')}`
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content - Compact */}
      {isExpanded && (
        <div className="px-4 py-3 space-y-3">
          {/* Custom Date Range - Inline */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Khoảng thời gian tùy chỉnh</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-2 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Từ ngày"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Additional Quick Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Lọc nhanh khác</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleQuickDateFilter(1)}
                className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                Hôm qua
              </button>
              <button
                onClick={() => handleQuickDateFilter(14)}
                className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                2 tuần
              </button>
              <button
                onClick={() => handleQuickDateFilter(180)}
                className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                6 tháng
              </button>
              <button
                onClick={() => handleQuickDateFilter(365)}
                className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                1 năm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 