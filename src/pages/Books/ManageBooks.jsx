import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const ManageBooks = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Deletion modal state
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;

      const res = await bookService.getBooks(params);
      if (res.success) {
        setBooks(res.data);

        // Derive unique category list
        if (categories.length === 0) {
          const uniqueCats = ['All', ...new Set(res.data.map((b) => b.category).filter(Boolean))];
          setCategories(uniqueCats);
        }
      }
    } catch (err) {
      console.error('Failed to load books:', err);
      showToast('Failed to load books catalog.', 'error');
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

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    try {
      setIsDeleting(true);
      const res = await bookService.deleteBook(bookToDelete._id);
      showToast(res.message || 'Book deleted successfully.', 'success');
      setBookToDelete(null);
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete book. It may have active issued copies.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Books Catalog</h1>
          <p className="page-subtitle">View, search, edit, and organize all book titles and copies</p>
        </div>
        <Link to="/books/add" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Book
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--color-text-muted)" />
            <select
              className="select-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories
                .filter((c) => c !== 'All')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading books catalog..." />
        ) : books.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'center' }}>Total Copies</th>
                  <th style={{ textAlign: 'center' }}>Available</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const isAvailable = book.available > 0;
                  return (
                    <tr key={book._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {book.title}
                        </div>
                      </td>
                      <td>{book.author}</td>
                      <td>
                        <code style={{ fontSize: '0.82rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                          {book.isbn}
                        </code>
                      </td>
                      <td>
                        <span className="badge badge-primary">{book.category}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{book.quantity}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: isAvailable ? '#059669' : '#dc2626' }}>
                        {book.available}
                      </td>
                      <td>
                        {isAvailable ? (
                          <span className="badge badge-success" style={{ gap: 4 }}>
                            <CheckCircle2 size={12} /> {book.available} In Stock
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ gap: 4 }}>
                            <XCircle size={12} /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="action-btn"
                            title="Edit book"
                            onClick={() => navigate(`/books/edit/${book._id}`)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete book"
                            onClick={() => setBookToDelete(book)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={search || selectedCategory !== 'All' ? 'No Matching Books' : 'Book Catalog Empty'}
            description={
              search || selectedCategory !== 'All'
                ? 'Try adjusting your search terms or genre filter.'
                : 'There are currently no books in the library system. Click below to add your first book.'
            }
            actionText={search || selectedCategory !== 'All' ? 'Clear Filters' : 'Add First Book'}
            onAction={
              search || selectedCategory !== 'All'
                ? () => {
                    setSearch('');
                    setSelectedCategory('All');
                  }
                : () => navigate('/books/add')
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!bookToDelete}
        title="Confirm Book Deletion"
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Yes, Delete Book"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete <strong>"{bookToDelete?.title}"</strong>?
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Note: Books with active issued copies to students cannot be deleted until all copies are returned.
        </p>
      </Modal>
    </div>
  );
};

export default ManageBooks;
