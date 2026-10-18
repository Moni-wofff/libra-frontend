import api from './api';

export const bookService = {
  getBooks: async (params = {}) => {
    const res = await api.get('/books', { params });
    return res.data;
  },

  getBookById: async (id) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },

  createBook: async (bookData) => {
    const res = await api.post('/books', bookData);
    return res.data;
  },

  updateBook: async (id, bookData) => {
    const res = await api.put(`/books/${id}`, bookData);
    return res.data;
  },

  deleteBook: async (id) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },
};
