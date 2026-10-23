import api from './api';

export const borrowRequestService = {
  createRequest: async (requestData) => {
    const res = await api.post('/borrow-requests', requestData);
    return res.data;
  },

  getMyRequests: async () => {
    const res = await api.get('/borrow-requests/my');
    return res.data;
  },

  getAllRequests: async (params = {}) => {
    const res = await api.get('/borrow-requests', { params });
    return res.data;
  },

  approveRequest: async (id, approvalData = {}) => {
    const res = await api.put(`/borrow-requests/${id}/approve`, approvalData);
    return res.data;
  },

  rejectRequest: async (id, rejectionData = {}) => {
    const res = await api.put(`/borrow-requests/${id}/reject`, rejectionData);
    return res.data;
  },
};
