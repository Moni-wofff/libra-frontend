import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useToast } from '../../context/ToastContext';
import BookForm from '../../components/BookForm';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [book, setBook] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsFetching(true);
        const res = await bookService.getBookById(id);
        if (res.success && res.data) {
          setBook(res.data);
        } else {
          showToast('Book not found.', 'error');
          navigate('/books');
        }
      } catch (err) {
        showToast('Error retrieving book record.', 'error');
        navigate('/books');
      } finally {
        setIsFetching(false);
      }
    };
    fetchBook();
  }, [id, navigate, showToast]);

  const handleUpdate = async (formData) => {
    try {
      setIsSaving(true);
      const res = await bookService.updateBook(id, formData);
      showToast(res.message || 'Book updated successfully!', 'success');
      navigate('/books');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update book. Please check fields.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return <LoadingSpinner message="Fetching book details..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Book Information</h1>
          <p className="page-subtitle">Update catalog details and inventory volume</p>
        </div>
      </div>

      <BookForm
        initialData={book}
        onSubmit={handleUpdate}
        isEditing={true}
        isLoading={isSaving}
      />
    </div>
  );
};

export default EditBook;
