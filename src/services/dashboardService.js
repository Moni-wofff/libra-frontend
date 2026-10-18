import api from './api';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  getRecentIssues: async () => {
    const res = await api.get('/dashboard/recent-issues');
    return res.data;
  },
};
