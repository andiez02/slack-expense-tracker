import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { 
  DashboardIcon, 
  SpinnerIcon, 
  CheckIcon, 
  CurrencyIcon, 
  UsersIcon,
  DocumentIcon,
  CreateIcon,
  BellIcon,
  EyeIcon,
  CloseIcon
} from '../components/Icons';

interface User {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  avatar?: string;
}

interface BillItem {
  id: string;
  name: string;
  price: number;
  claimedBy?: string; // user id who claimed this item
  paidBy?: string; // user id who paid for this item
}

interface Bill {
  id: string;
  createdBy: string;
  createdByName: string;
  title: string;
  description?: string;
  items: BillItem[];
  taggedUsers: string[];
  timestamp: Date;
  qrCode?: string;
  totalAmount: number;
  totalClaimed: number;
  totalPaid: number;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'system';
  isEdited?: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bill form state
  const [billTitle, setBillTitle] = useState('');
  const [billDescription, setBillDescription] = useState('');
  const [billItems, setBillItems] = useState<{name: string, price: string}[]>([{name: '', price: ''}]);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [billQr, setBillQr] = useState('');

  // Sample data
  const currentUser: User = { id: "U123", name: "An Hoang", status: 'online' };
  const channelMembers: User[] = [
    { id: "U123", name: "An Hoang", status: 'online' },
    { id: "U234", name: "Linh Nguyen", status: 'online' },
    { id: "U345", name: "Tu Pham", status: 'away' },
    { id: "U456", name: "Mai Tran", status: 'online' },
    { id: "U567", name: "Duc Le", status: 'offline' },
    { id: "U678", name: "Hoa Pham", status: 'online' },
  ];

  const [bills, setBills] = useState<Bill[]>([
    {
      id: "B001",
      createdBy: "U234",
      createdByName: "Linh Nguyen",
      title: "Cơm trưa hôm nay",
      description: "Đặt cơm tại quán Bà Năm",
      items: [
        { id: "I001", name: "Cơm gà", price: 45000, claimedBy: "U345", paidBy: "U345" },
        { id: "I002", name: "Cơm sườn", price: 50000, claimedBy: "U123" },
        { id: "I003", name: "Phở bò", price: 55000, claimedBy: "U567", paidBy: "U567" },
        { id: "I004", name: "Bún chả", price: 48000 },
        { id: "I005", name: "Trà đá", price: 5000, claimedBy: "U456", paidBy: "U456" },
      ],
      taggedUsers: ["U123", "U345", "U456", "U567"],
      timestamp: new Date(Date.now() - 7200000),
      qrCode: "https://via.placeholder.com/200x200/10B981/FFFFFF?text=QR+Linh",
      totalAmount: 203000,
      totalClaimed: 155000,
      totalPaid: 105000
    },
    {
      id: "B002", 
      createdBy: "U456",
      createdByName: "Mai Tran",
      title: "Trà sữa chiều",
      description: "Gọi trà sữa TocoToco",
      items: [
        { id: "I006", name: "Trà sữa trân châu", price: 32000, claimedBy: "U234", paidBy: "U234" },
        { id: "I007", name: "Trà sữa đào", price: 35000, claimedBy: "U345" },
        { id: "I008", name: "Trà sữa socola", price: 38000, claimedBy: "U123" },
      ],
      taggedUsers: ["U123", "U234", "U345"],
      timestamp: new Date(Date.now() - 3600000),
      qrCode: "https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=QR+Mai",
      totalAmount: 105000,
      totalClaimed: 105000,
      totalPaid: 32000
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "M001",
      userId: "SYSTEM",
      userName: "System",
      text: "Chào mừng đến với #cơm-trưa! Channel này để thảo luận về các bữa ăn và chia sẻ chi phí 🍚",
      timestamp: new Date(Date.now() - 86400000),
      type: 'system'
    },
    {
      id: "M002",
      userId: "U234",
      userName: "Linh Nguyen",
      text: "Chào mọi người! Hôm nay có ai muốn gọi cơm trưa không? 😊",
      timestamp: new Date(Date.now() - 25200000),
      type: 'message',
      reactions: [
        { emoji: "👋", count: 3, users: ["U123", "U345", "U456"] },
        { emoji: "🍚", count: 2, users: ["U123", "U567"] }
      ]
    },
    {
      id: "M003",
      userId: "U345",
      userName: "Tu Pham",
      text: "Mình muốn ăn cơm gà! Ai cùng không? 🐔",
      timestamp: new Date(Date.now() - 21600000),
      type: 'message'
    },
    {
      id: "M004",
      userId: "U123",
      userName: "An Hoang",
      text: "Count me in! Quán nào ngon thế? 🤔",
      timestamp: new Date(Date.now() - 18000000),
      type: 'message'
    },
    {
      id: "M005",
      userId: "U456",
      userName: "Mai Tran",
      text: "Quán Bà Năm ở đầu đường đi, cơm ngon lắm! Mình hay ăn đó 👍",
      timestamp: new Date(Date.now() - 14400000),
      type: 'message',
      reactions: [
        { emoji: "❤️", count: 2, users: ["U234", "U345"] }
      ]
    },
    {
      id: "M006",
      userId: "U567",
      userName: "Duc Le",
      text: "Mình không ăn cơm được, ăn phở thôi. Ai ăn phở cùng không? 🍜",
      timestamp: new Date(Date.now() - 10800000),
      type: 'message'
    },
    {
      id: "M007",
      userId: "U678",
      userName: "Hoa Pham",
      text: "Phở cũng ok! Mình theo Duc nhé 😋",
      timestamp: new Date(Date.now() - 7200000),
      type: 'message'
    },
    {
      id: "M008",
      userId: "U234",
      userName: "Linh Nguyen",
      text: "Vậy chia 2 team: Team cơm và team phở. Ai muốn join team nào thì comment nhé! 🍚 vs 🍜",
      timestamp: new Date(Date.now() - 3600000),
      type: 'message',
      reactions: [
        { emoji: "🍚", count: 3, users: ["U123", "U345", "U456"] },
        { emoji: "🍜", count: 2, users: ["U567", "U678"] }
      ]
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `M${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text: messageText,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('vi-VN', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserById = (userId: string) => {
    return channelMembers.find(u => u.id === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const getOnlineCount = () => {
    return channelMembers.filter(u => u.status === 'online').length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <SpinnerIcon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Đang tải channel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>#cơm-trưa - PolitePay</title>
        <meta name="description" content="Channel cơm trưa team" />
      </Head>

      <div className="flex h-screen bg-white overflow-hidden">
        
        {/* Sidebar - Members List */}
        <div className="w-64 bg-slate-800 flex flex-col flex-shrink-0">
          
          {/* Workspace Header */}
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <h1 className="text-white font-bold text-lg">PolitePay</h1>
            <p className="text-slate-300 text-sm">Politetech Team</p>
          </div>

          {/* Channel Info */}
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-sm mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">#</span>
              </div>
              <span className="text-white font-medium">cơm-trưa</span>
            </div>
            <p className="text-slate-400 text-xs">
              {channelMembers.length} thành viên • {getOnlineCount()} đang online
            </p>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4">
              <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wide mb-3">
                Thành viên — {channelMembers.length}
              </h3>
              <div className="space-y-1">
                {channelMembers.map((member) => (
                  <div key={member.id} className="flex items-center p-2 rounded hover:bg-slate-700 cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(member.status)}`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-white text-sm font-medium">{member.name}</p>
                      {member.id === currentUser.id && (
                        <p className="text-slate-400 text-xs">bạn</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Channel Header */}
          <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-emerald-500 rounded mr-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">#</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">cơm-trưa</h1>
                <p className="text-sm text-slate-600">{getOnlineCount()} người đang hoạt động</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-slate-600" />
              </button>
              <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Date Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-slate-200"></div>
                <div className="px-4">
                  <span className="text-sm font-medium text-slate-600 bg-white px-2">
                    {formatDateTime(new Date())}
                  </span>
                </div>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <div className="px-6 space-y-6 pb-6">
                {messages.map((message, index) => {
                  const user = getUserById(message.userId);
                  const isSystem = message.type === 'system';
                  const showAvatar = index === 0 || messages[index - 1]?.userId !== message.userId;
                  
                  return (
                    <div key={message.id} className="group">
                      {isSystem ? (
                        // System message
                        <div className="flex items-center justify-center py-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-2xl">
                            <p className="text-blue-800 text-sm text-center">
                              <BellIcon className="w-4 h-4 inline mr-2" />
                              {message.text}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Regular message
                        <div className={`flex items-start gap-3 hover:bg-slate-50 rounded-lg p-2 -m-2 ${!showAvatar ? 'ml-14' : ''}`}>
                          
                          {showAvatar && (
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {message.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </span>
                                </div>
                                {user && (
                                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {showAvatar && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900">{message.userName}</span>
                                <span className="text-xs text-slate-500">
                                  {formatTime(message.timestamp)}
                                </span>
                                {message.isEdited && (
                                  <span className="text-xs text-slate-400">(đã chỉnh sửa)</span>
                                )}
                              </div>
                            )}

                            <div className="text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                              {message.text}
                            </div>

                            {/* Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, idx) => (
                                  <button
                                    key={idx}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm transition-colors"
                                  >
                                    <span>{reaction.emoji}</span>
                                    <span className="text-slate-600 font-medium">{reaction.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Message actions (show on hover) */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-1">
                              <button className="w-8 h-8 rounded hover:bg-slate-200 flex items-center justify-center">
                                <span className="text-slate-600">😊</span>
                              </button>
                              <button className="w-8 h-8 rounded hover:bg-slate-200 flex items-center justify-center">
                                <span className="text-slate-600 text-xs">⋯</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-200 flex-shrink-0">
              <div className="relative">
                <div className="border-2 border-slate-200 rounded-lg focus-within:border-blue-500 transition-colors">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Nhắn tin trong #cơm-trưa`}
                    className="w-full px-4 py-3 border-0 resize-none focus:outline-none text-slate-800 placeholder-slate-500"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  
                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 text-lg">📎</span>
                      </button>
                      <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 text-lg">😊</span>
                      </button>
                      <button className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 text-lg">@</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                        messageText.trim() 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-lg">➤</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-medium">Enter</span> để gửi, <span className="font-medium">Shift + Enter</span> để xuống dòng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 