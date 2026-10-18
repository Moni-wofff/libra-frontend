import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useToast } from '../../context/ToastContext';
import BookForm from '../../components/BookForm';

const AddBook = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true);
      const res = await bookService.createBook(formData);
      showToast(res.message || 'Book successfully added to library catalog!', 'success');
      navigate('/books');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add book. Please check fields.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Book</h1>
          <p className="page-subtitle">Register a new book title into the library inventory</p>
        </div>
      </div>

      <BookForm onSubmit={handleCreate} isEditing={false} isLoading={isLoading} />
    </div>
  );
};

export default AddBook;
