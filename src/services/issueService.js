import api from './api';

export const issueService = {
  getIssues: async (params = {}) => {
    const res = await api.get('/issues', { params });
    return res.data;
  },

  getIssueById: async (id) => {
    const res = await api.get(`/issues/${id}`);
    return res.data;
  },

  createIssue: async (issueData) => {
    const res = await api.post('/issues', issueData);
    return res.data;
  },

  returnBook: async (id) => {
    const res = await api.put(`/issues/${id}/return`);
    return res.data;
  },
};
