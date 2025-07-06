import { useState, useEffect } from 'react';
import { useNotifications } from '../hooks';

interface User {
  id: string;
  name: string;
  real_name?: string;
  slack_id?: string;
  avatar?: string;
}

interface UserSelectorProps {
  selectedUsers: string[] | User[];
  onSelectionChange: (users: string[] | User[]) => void;
  availableUsers?: User[];
  placeholder?: string;
}

export default function UserSelector({ 
  selectedUsers, 
  onSelectionChange, 
  availableUsers,
  placeholder = "Chọn thành viên..."
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine if we're working with User objects or string IDs
  const isUserMode = selectedUsers.length > 0 && typeof selectedUsers[0] === 'object';
  
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    if (availableUsers) {
      setUsers(availableUsers);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [availableUsers]);

  const fetchUsers = async () => {
    try {
      // TODO: Implement API call to get Slack workspace members
      // const response = await axios.get('/api/slack/users');
      // setUsers(response.data);
      
      // Mock data for now
      setUsers([
        { id: 'U123', name: 'nguyenvana', real_name: 'Nguyễn Văn A', slack_id: 'nguyenvana' },
        { id: 'U456', name: 'tranthib', real_name: 'Trần Thị B', slack_id: 'tranthib' },
        { id: 'U789', name: 'lethic', real_name: 'Lê Thị C', slack_id: 'lethic' },
        { id: 'U999', name: 'phamthid', real_name: 'Phạm Thị D', slack_id: 'phamthid' },
        { id: 'U888', name: 'levane', real_name: 'Lê Văn E', slack_id: 'levane' },
      ]);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi tải danh sách thành viên',
        message: 'Không thể tải danh sách thành viên từ Slack. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedUserIds = (): string[] => {
    if (isUserMode) {
      return (selectedUsers as User[]).map(user => user.id);
    }
    return selectedUsers as string[];
  };

  const handleUserToggle = (user: User) => {
    const selectedUserIds = getSelectedUserIds();
    const isSelected = selectedUserIds.includes(user.id);
    
    if (isUserMode) {
      const currentUsers = selectedUsers as User[];
      const newSelection = isSelected
        ? currentUsers.filter(u => u.id !== user.id)
        : [...currentUsers, user];
      onSelectionChange(newSelection);
    } else {
      const currentIds = selectedUsers as string[];
      const newSelection = isSelected
        ? currentIds.filter(id => id !== user.id)
        : [...currentIds, user.id];
      onSelectionChange(newSelection);
    }
  };

  const selectAll = () => {
    if (isUserMode) {
      onSelectionChange([...users]);
    } else {
      onSelectionChange(users.map(user => user.id));
    }
  };

  const clearAll = () => {
    if (isUserMode) {
      onSelectionChange([]);
    } else {
      onSelectionChange([]);
    }
  };

  const selectedUserIds = getSelectedUserIds();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center text-slate-500">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải thành viên...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>{placeholder}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Header with selection info and actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">{selectedUserIds.length}</span> / {users.length} thành viên được chọn
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Chọn tất cả
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-slate-600 hover:text-slate-700 font-medium"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="max-h-64 overflow-y-auto">
        <div className="space-y-2">
          {users.map((user) => (
            <label
              key={user.id}
              className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                selectedUserIds.includes(user.id)
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleUserToggle(user)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              
              {/* User Avatar */}
              <div className="ml-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user.real_name || user.name).split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user.real_name || user.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  @{user.slack_id || user.name}
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedUserIds.includes(user.id) && (
                <div className="flex-shrink-0 ml-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
      
      {/* Selected users preview */}
      {selectedUserIds.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <div className="text-xs text-slate-500 mb-2">Đã chọn:</div>
          <div className="flex flex-wrap gap-1">
            {selectedUserIds.map((userId) => {
              const user = users.find(u => u.id === userId);
              return user ? (
                <span
                  key={userId}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {user.real_name || user.name}
                  <button
                    type="button"
                    onClick={() => handleUserToggle(user)}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
} 