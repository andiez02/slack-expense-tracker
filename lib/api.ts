import authorizedAxiosInstance from '@/utils/authorizedAxios';
import { API_ROOT } from '@/utils/constants';

// Auth API
export const authAPI = {
  refreshToken: async () => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/auth/refresh_token`
    );
    return response.data;
  },
};

// User API
export const userAPI = {
  getMemberBySlackId: async (slackId: string) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/users/${slackId}`);
    return response.data;
  },
  getMe: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/users/me`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/dashboard`);
    return response.data;
  },
};

// Slackbot API
export const slackbotAPI = {
  getJoinedChannels: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/slackbot/joined_channels`);
    return response.data;
  },
  getJoinedChannelMembers: async (channelId: string) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/slackbot/joined_channels/${channelId}/members`);
    return response.data;
  },
  sendMessage: async (channel: string, text: string) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/slackbot/send-message`, { channel, text });
    return response.data;
  },

};

export const expenseAPI = {
  createExpense: async (data: any) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/expense/create`, data);
    return response.data;
  },
  
  getAllExpenses: async (
    page: number = 1, 
    limit: number = 10, 
    searchOptions: { title?: string; dateFrom?: string; dateTo?: string } = {}
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add search parameters if provided
    if (searchOptions.title) {
      params.append('title', searchOptions.title);
    }
    if (searchOptions.dateFrom) {
      params.append('dateFrom', searchOptions.dateFrom);
    }
    if (searchOptions.dateTo) {
      params.append('dateTo', searchOptions.dateTo);
    }

    const response = await authorizedAxiosInstance.get(`${API_ROOT}/expense/all?${params.toString()}`);
    return response.data;
  },

  getRanking: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/expense/ranking`);
    return response.data;
  },

  getExpenseById: async (id: string) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/expense/${id}`);
    return response.data;
  },

  confirmPaymentViaWeb: async (expenseId: string, payerUserId: string) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/expense/confirm-payment`, {
      expenseId,
      payerUserId,
    });
    return response.data;
  },

  getPendingConfirmations: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/expense/pending-confirmations`);
    return response.data;
  },
};
