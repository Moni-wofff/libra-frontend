import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import { borrowRequestService } from '../../services/borrowRequestService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';

const BrowseBooks = () => {
  const { showToast } = useToast();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Request modal state
  const [selectedBookForRequest, setSelectedBookForRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

      const res = await bookService.getBooks(params);
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error('Failed to load books catalog:', err);
      showToast('Error loading books catalog.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  // Extract distinct categories
  const categories = ['All', ...new Set(books.map((b) => b.category).filter(Boolean))];

  const handleRequestSubmit = async () => {
    if (!selectedBookForRequest) return;

    try {
      setIsSubmitting(true);
      const res = await borrowRequestService.createRequest({
        bookId: selectedBookForRequest._id,
      });
      showToast(res.message || 'Borrow request submitted successfully!', 'success');
      setSelectedBookForRequest(null);
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit borrow request.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Library Catalog</h1>
          <p className="page-subtitle">
            Explore available titles, review real-time stock, and submit lending requests
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '28px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: '280px' }}>
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search books by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ minWidth: '200px' }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ height: '42px', fontSize: '0.88rem' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Genres & Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <LoadingSpinner message="Searching library catalog..." />
      ) : books.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {books.map((book) => {
            const isAvailable = book.available > 0;

            return (
              <div
                key={book._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  {/* Category Pill & Stock Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {book.category}
                    </span>
                    <span
                      className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {isAvailable ? `${book.available} Available` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      lineHeight: 1.35,
                      margin: '0 0 6px 0',
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--color-text-muted)',
                      margin: '0 0 16px 0',
                    }}
                  >
                    By {book.author}
                  </p>

                  {/* Book Metadata */}
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <strong>ISBN:</strong> {book.isbn}
                    </div>
                    <div>
                      <strong>Total Volume:</strong> {book.quantity} copies in catalog
                    </div>
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => setSelectedBookForRequest(book)}
                  className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    padding: '10px',
                  }}
                  disabled={!isAvailable}
                >
                  {isAvailable ? (
                    <>
                      <Send size={15} /> Request to Borrow
                    </>
                  ) : (
                    <>
                      <AlertCircle size={15} /> Currently Unavailable
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Books Found"
          description={
            search
              ? 'No books match your current query or category filter.'
              : 'The catalog is currently empty. Please check back later.'
          }
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
          }}
        />
      )}

      {/* Borrow Request Modal */}
      <Modal
        isOpen={!!selectedBookForRequest}
        title="Submit Borrow Request"
        onClose={() => setSelectedBookForRequest(null)}
        onConfirm={handleRequestSubmit}
        confirmText="Confirm & Submit Request"
        confirmVariant="primary"
        isLoading={isSubmitting}
      >
        <p>
          Submit a lending application for <strong>"{selectedBookForRequest?.title}"</strong> by{' '}
          {selectedBookForRequest?.author}?
        </p>

        <div
          style={{
            marginTop: '16px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.85rem',
          }}
        >
          <div>
            ISBN: <code>{selectedBookForRequest?.isbn}</code>
          </div>
          <div style={{ marginTop: '4px' }}>
            Genre/Category: <strong>{selectedBookForRequest?.category}</strong>
          </div>
          <div style={{ marginTop: '4px', color: '#059669', fontWeight: 600 }}>
            Current Library Stock: {selectedBookForRequest?.available} copies available
          </div>
        </div>

        <div
          style={{
            marginTop: '14px',
            padding: '10px 14px',
            backgroundColor: '#eff6ff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #bfdbfe',
            fontSize: '0.82rem',
            color: '#1e40af',
          }}
        >
          • Your application will be sent to the library circulation desk for authorization.
          <br />
          • Standard student loan duration is 14 days upon administrator approval.
        </div>
      </Modal>
    </div>
  );
};

export default BrowseBooks;
