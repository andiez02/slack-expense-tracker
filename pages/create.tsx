import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  SpinnerIcon,
  CreateIcon,
  CheckIcon,
} from '../components/Icons';
import { toast } from 'react-toastify';
import { expenseAPI, slackbotAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber, parseFormattedNumber, formatCurrency } from '../utils/constants';

interface FormData {
  title: string;
  description: string;
  amount: string;
  noteImage?: File;
}

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  num_members: number;
}

interface SlackMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status?: 'online' | 'away' | 'offline';
  role?: string;
}

export default function CreateExpense() {
  const [loading, setLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel | null>(null);
  const [channelMembers, setChannelMembers] = useState<SlackMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SlackMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [noteImage, setNoteImage] = useState<File | null>(null);
  const [noteImagePreview, setNoteImagePreview] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState('');

  const { currentUser } = useAuth();
  const qrImage = currentUser?.qrImage;

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
    },
  });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setChannelsLoading(true);
        const response = await slackbotAPI.getJoinedChannels();
        setChannels(response.channels);
      } catch (error) {
        console.error('Error fetching channels:', error);
        toast.error('Không thể tải danh sách kênh');
      } finally {
        setChannelsLoading(false);
      }
    };
    fetchChannels();
  }, []);



  const handleChannelSelect = (channel: SlackChannel) => {
    setSelectedChannel(channel);

    const fetchChannelMembers = async () => {
      try {
        setMembersLoading(true);
        const response = await slackbotAPI.getJoinedChannelMembers(channel.id);
        setChannelMembers(response.members);
      } catch (error) {
        console.error('Error fetching channel members:', error);
        toast.error('Không thể tải danh sách thành viên');
        setChannelMembers([]);
      } finally {
        setMembersLoading(false);
      }
    };
    fetchChannelMembers();

    setSelectedMembers([]);
    setSearchTerm('');
  };

  const handleMemberToggle = (member: SlackMember) => {
    setSelectedMembers(prev => {
      const exists = prev.find(m => m.id === member.id);
      if (exists) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
  };

  // Filter members based on search term
  const getFilteredMembers = () => {
    if (!selectedChannel) return [];
    const members = channelMembers || [];
    if (!searchTerm) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    const rawValue = parseFormattedNumber(formatted);
    setFormattedAmount(formatted);
    // Update the hidden registered input for validation
    setValue('amount', rawValue, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedChannel) {
      toast.error('Vui lòng chọn kênh Slack');
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thành viên');
      return;
    }

    // Set pending data - amount validation is handled by react-hook-form
    setPendingFormData({
      ...data,
      noteImage,
      channel: selectedChannel,
      members: selectedMembers,
    });
    setShowConfirmModal(true);
  };

  const handleConfirmCreate = async () => {
    if (!pendingFormData || !selectedChannel || selectedMembers.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('title', pendingFormData.title.trim());
      formData.append('description', pendingFormData.description.trim());
      formData.append('amount', pendingFormData.amount);
      formData.append('channel_id', selectedChannel.id);
      formData.append('channel_name', selectedChannel.name);
      formData.append('participants', JSON.stringify(selectedMembers.map(member => ({
        user_id: member.id,
      }))));

      if (qrImage) {
        formData.append('qr_image', qrImage);
      }

      if (pendingFormData.noteImage) {
        formData.append('note_image', pendingFormData.noteImage);
      }

      console.log('Sending expense data with image...');
      const response = await expenseAPI.createExpense(formData);
      console.log(response);

      toast.success('Đã tạo đợt thu tiền và gửi tin nhắn Slack thành công!');
      setShowConfirmModal(false);
      setPendingFormData(null);
      router.push('/history');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Có lỗi xảy ra khi tạo đợt thu tiền');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setPendingFormData(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setNoteImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setNoteImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNoteImage(null);
    setNoteImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('note-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <>
      <Head>
        <title>Tạo đợt thu mới - PolitePay</title>
        <meta name='description' content='Tạo đợt thu tiền mới cho team' />
      </Head>

      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <div className='bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100'>
          <div className='max-w-lg mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
              <button
                onClick={() => window.history.back()}
                className='p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors'
              >
                <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <h1 className='text-lg font-bold text-gray-900'>Tạo đợt thu</h1>
              <div className='w-10'></div>
            </div>
          </div>
        </div>

        <div className='max-w-lg mx-auto p-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Title & Description */}
            <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2 text-sm'>Tiêu đề *</label>
                  <input
                    type='text'
                    {...register('title', {
                      required: 'Vui lòng nhập tiêu đề'
                    })}
                    className={`w-full p-3 bg-gray-50 rounded-xl border-0 outline-none text-gray-900 placeholder-gray-500 font-medium transition-all ${errors.title ? 'bg-red-50 text-red-600 ring-2 ring-red-200' : 'focus:bg-blue-50 focus:ring-2 focus:ring-blue-200'
                      }`}
                    placeholder='cơm trưa'
                  />
                  {errors.title && (
                    <p className='text-red-500 text-xs mt-1'>{errors.title.message}</p>
                  )}
                </div>


                {/* Amount Field */}
                <div className='mt-3'>
                  <label className='block text-gray-700 font-semibold mb-2 text-sm'>Tổng số tiền *</label>
                  
                  {/* Hidden input for form validation */}
                  <input
                    type='hidden'
                    {...register('amount', {
                      required: 'Vui lòng nhập số tiền',
                      min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                    })}
                  />
                  
                  {/* Visible formatted input */}
                  <input
                    type='text'
                    value={formattedAmount}
                    onChange={handleAmountChange}
                    className={`w-full p-3 bg-gray-50 rounded-xl border-0 outline-none text-gray-900 placeholder-gray-500 font-medium transition-all ${errors.amount ? 'bg-red-50 text-red-600 ring-2 ring-red-200' : 'focus:bg-blue-50 focus:ring-2 focus:ring-blue-200'}`}
                    placeholder='Ví dụ: 150.000'
                  />
                  {errors.amount && (
                    <p className='text-red-500 text-xs mt-1'>{errors.amount.message}</p>
                  )}
                  <p className='text-xs text-gray-500 mt-1'>VNĐ</p>
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2 text-sm'>Ghi chú</label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    className='w-full p-3 bg-gray-50 rounded-xl border-0 outline-none text-gray-900 placeholder-gray-500 resize-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 transition-all'
                    placeholder='Ví dụ: 30k'
                  />


                  {/* Image Upload */}
                  <div className='mt-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium text-gray-600'>Thêm ảnh (tùy chọn)</span>
                      {noteImage && (
                        <button
                          type='button'
                          onClick={handleRemoveImage}
                          className='text-red-500 hover:text-red-700 text-sm font-medium'
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>

                    {noteImagePreview ? (
                      <div className='relative'>
                        <img
                          src={noteImagePreview}
                          alt="Preview"
                          className='w-full h-32 object-cover rounded-xl border-2 border-gray-200'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                          <button
                            type='button'
                            onClick={handleRemoveImage}
                            className='bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className='block cursor-pointer'>
                        <input
                          type='file'
                          id='note-image'
                          accept='image/*'
                          onChange={handleImageUpload}
                          className='hidden'
                        />
                        <div className='w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all'>
                          <div className='text-center'>
                            <svg className='w-6 h-6 text-gray-400 mx-auto mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                            </svg>
                            <p className='text-sm text-gray-500 font-medium'>Nhấn để chọn ảnh</p>
                            <p className='text-xs text-gray-400 mt-1'>PNG, JPG tối đa 5MB</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Channel Selection - Grid */}
                <div>
                  <label className='block text-gray-700 font-semibold mb-3 text-sm'>
                    Kênh Slack *
                    {channelsLoading && (
                      <span className='ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                        <SpinnerIcon className='w-3 h-3 inline mr-1 animate-spin' />
                        Đang tải...
                      </span>
                    )}
                    {selectedChannel && !channelsLoading && (
                      <span className='ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full'>
                        #{selectedChannel.name}
                      </span>
                    )}
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    {channelsLoading ? (
                      // Channel loading skeleton
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className='p-3 rounded-xl border-2 border-gray-200 bg-gray-50 animate-pulse'>
                          <div className='flex items-center space-x-2'>
                            <div className='w-2 h-2 rounded-full bg-gray-300' />
                            <div className='flex-1 min-w-0'>
                              <div className='h-4 bg-gray-300 rounded w-3/4 mb-1'></div>
                              <div className='h-3 bg-gray-300 rounded w-1/2'></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : channels.length === 0 ? (
                      <div className='col-span-2 p-6 rounded-xl border-2 border-gray-200 bg-gray-50 text-center text-gray-500'>
                        <svg className='w-8 h-8 mx-auto mb-2 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14' />
                        </svg>
                        <p className='text-sm'>Không tìm thấy kênh nào</p>
                        <p className='text-xs text-gray-400 mt-1'>Vui lòng thử lại sau</p>
                      </div>
                    ) : (
                      channels.map((channel) => (
                        <button
                          key={channel.id}
                          type='button'
                          onClick={() => handleChannelSelect(channel)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${selectedChannel?.id === channel.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                          <div className='flex items-center space-x-2'>
                            <div className={`w-2 h-2 rounded-full ${channel.is_private ? 'bg-red-400' : 'bg-green-400'}`} />
                            <div className='flex-1 min-w-0'>
                              <div className='text-sm font-semibold text-gray-900 truncate'>
                                #{channel.name}
                              </div>
                              <div className='text-xs text-gray-500'>
                                {channel.num_members} thành viên
                              </div>
                            </div>
                            {selectedChannel?.id === channel.id && (
                              <CheckIcon className='w-4 h-4 text-blue-600 flex-shrink-0' />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Member Selection */}
            {selectedChannel && (
              <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100'>
                <h3 className='font-bold text-gray-900 mb-4'>
                  Chọn thành viên
                  {selectedMembers.length > 0 && (
                    <span className='ml-2 text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full'>
                      {selectedMembers.length} người
                    </span>
                  )}
                </h3>

                {/* Search Bar */}
                <div className='relative mb-4'>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={membersLoading ? 'Đang tải thành viên...' : 'Tìm kiếm thành viên...'}
                    disabled={membersLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 outline-none text-gray-900 placeholder-gray-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 transition-all ${membersLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  />
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    {membersLoading ? (
                      <SpinnerIcon className='w-4 h-4 text-gray-400 animate-spin' />
                    ) : (
                      <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                    )}
                  </div>
                  {searchTerm && !membersLoading && (
                    <button
                      type='button'
                      onClick={() => setSearchTerm('')}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                  <div className='mb-4 p-3 bg-green-50 rounded-xl border border-green-200'>
                    <h4 className='text-sm font-semibold text-green-800 mb-2'>Thành viên đã chọn:</h4>
                    <div className='flex flex-wrap gap-2'>
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className='inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'
                        >
                          <span className='font-medium mr-2'>{member.name}</span>
                          <button
                            type='button'
                            onClick={() => handleRemoveMember(member.id)}
                            className='text-green-600 hover:text-green-800 ml-1'
                          >
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Members Grid */}
                <div className='mb-4'>
                  <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                    Tất cả thành viên
                    {searchTerm && (
                      <span className='ml-2 text-xs text-gray-500'>
                        ({getFilteredMembers().length} kết quả)
                      </span>
                    )}
                  </h4>
                  {membersLoading ? (
                    <div className='grid grid-cols-2 gap-3 max-h-64 overflow-y-auto'>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className='p-3 rounded-xl border-2 border-gray-200 bg-gray-50 animate-pulse'>
                          <div className='h-4 bg-gray-300 rounded w-3/4 mb-2'></div>
                          <div className='h-3 bg-gray-300 rounded w-1/2'></div>
                        </div>
                      ))}
                    </div>
                  ) : getFilteredMembers().length === 0 && searchTerm ? (
                    <div className='text-center py-8 text-gray-500'>
                      <svg className='w-12 h-12 mx-auto mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                      </svg>
                      <p className='text-sm'>Không tìm thấy thành viên nào</p>
                      <p className='text-xs text-gray-400 mt-1'>Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  ) : getFilteredMembers().length === 0 && !searchTerm ? (
                    <div className='text-center py-8 text-gray-500'>
                      <svg className='w-12 h-12 mx-auto mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                      </svg>
                      <p className='text-sm'>Kênh không có thành viên</p>
                      <p className='text-xs text-gray-400 mt-1'>Hãy thử chọn kênh khác</p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-3 max-h-64 overflow-y-auto'>
                      {getFilteredMembers().map((member) => (
                        <button
                          key={member.id}
                          type='button'
                          onClick={() => handleMemberToggle(member)}
                          className={`p-3 rounded-xl border-2 transition-all text-left relative ${selectedMembers.find(m => m.id === member.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                          <div className='flex items-center space-x-2'>
                            <div className='w-6 h-6 rounded-full flex items-center justify-center'>
                              <img src={member.avatar} alt={member.name} className='w-full h-full rounded-lg' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='text-sm font-medium text-gray-900 truncate'>
                                {member.name}
                              </div>
                              <div className='text-xs text-gray-500 truncate'>
                                {member.email}
                              </div>
                            </div>
                          </div>

                          {selectedMembers.find(m => m.id === member.id) && (
                            <div className='absolute top-1 right-1'>
                              <CheckIcon className='w-4 h-4 text-green-600' />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Select All / Deselect All */}
                {!membersLoading && channelMembers && getFilteredMembers().length > 0 && (
                  <div className='flex justify-center'>
                    <button
                      type='button'
                      onClick={() => {
                        const filteredMembers = getFilteredMembers();
                        const isAllSelected = filteredMembers.every(member =>
                          selectedMembers.find(selected => selected.id === member.id)
                        );

                        if (isAllSelected) {
                          // Deselect filtered members
                          const filteredIds = filteredMembers.map(m => m.id);
                          setSelectedMembers(prev => prev.filter(m => !filteredIds.includes(m.id)));
                        } else {
                          // Select all filtered members
                          const newMembers = filteredMembers.filter(member =>
                            !selectedMembers.find(selected => selected.id === member.id)
                          );
                          setSelectedMembers(prev => [...prev, ...newMembers]);
                        }
                      }}
                      className='px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
                    >
                      {getFilteredMembers().every(member =>
                        selectedMembers.find(selected => selected.id === member.id)
                      )
                        ? `Bỏ chọn ${searchTerm ? 'kết quả tìm kiếm' : 'tất cả'}`
                        : `Chọn ${searchTerm ? 'kết quả tìm kiếm' : 'tất cả'}`
                      }
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                disabled={loading || !selectedChannel || selectedMembers.length === 0 || !watch('title') || !formattedAmount}
                className='w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 transform active:scale-[0.98] shadow-lg'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <SpinnerIcon className='mr-2 h-5 w-5 text-white animate-spin' />
                    Đang tạo đợt thu...
                  </div>
                ) : (
                  <div className='flex items-center justify-center'>
                    <CreateIcon className='w-5 h-5 mr-2' />
                    Xem lại thông tin
                  </div>
                )}
              </button>

              {selectedChannel && selectedMembers.length > 0 && (
                <p className='text-center text-sm text-gray-500 mt-3'>
                  Xem lại thông tin trước khi gửi đến #{selectedChannel.name} cho {selectedMembers.length} thành viên
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && pendingFormData && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCancelConfirm} />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Xác nhận thông tin</h3>
                    <button
                      onClick={handleCancelConfirm}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                  {/* Warning */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Lưu ý quan trọng</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Tin nhắn sẽ được gửi tự động trong Slack và không thể chỉnh sửa sau khi gửi. Vui lòng kiểm tra kỹ thông tin.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expense Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tiêu đề:</label>
                      <p className="text-gray-900 font-medium">{pendingFormData.title}</p>
                    </div>

                    {pendingFormData.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Mô tả:</label>
                        <p className="text-gray-900">{pendingFormData.description}</p>
                      </div>
                    )}

                    {pendingFormData.amount && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Số tiền:</label>
                        <p className="text-gray-900 font-medium">{formatCurrency(parseFloat(pendingFormData.amount))}</p>
                      </div>
                    )}

                    {pendingFormData.noteImage && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ảnh đính kèm:</label>
                        <div className="mt-1 flex flex-col items-center space-x-2">
                          <img
                            src={noteImagePreview || URL.createObjectURL(pendingFormData.noteImage)}
                            alt="Note attachment"
                            className="w-full max-w-xs h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {pendingFormData.noteImage.name} ({(pendingFormData.noteImage.size / 1024 / 1024).toFixed(1)}MB)
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">Kênh Slack:</label>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedChannel?.is_private ? 'bg-red-400' : 'bg-green-400'}`} />
                        <p className="text-gray-900 font-medium">#{selectedChannel?.name}</p>
                        <span className="text-sm text-gray-500 ml-2">({selectedChannel?.num_members} thành viên)</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Người tham gia ({selectedMembers.length}):</label>
                      <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
                        {selectedMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                              <p className="text-xs text-gray-500 truncate">{member.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex space-x-3">
                  <button
                    onClick={handleCancelConfirm}
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmCreate}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <CreateIcon className="w-4 h-4 mr-2" />
                        Xác nhận tạo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}