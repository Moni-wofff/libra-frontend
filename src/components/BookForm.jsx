import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Biography',
  'Historical Fiction',
  'Science & Technology',
  'Computer Science',
  'Epic',
  'Philosophy',
  'Mathematics',
  'Literature',
];

const BookForm = ({ initialData, onSubmit, isEditing = false, isLoading = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Fiction',
    quantity: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        category: initialData.category || 'Fiction',
        quantity: initialData.quantity !== undefined ? initialData.quantity : '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Book title is required.';
    if (!formData.author.trim()) newErrors.author = 'Author name is required.';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required.';
    if (!formData.category.trim()) newErrors.category = 'Category is required.';

    if (formData.quantity === '' || formData.quantity === null || formData.quantity === undefined) {
      newErrors.quantity = 'Total quantity is required.';
    } else {
      const q = Number(formData.quantity);
      if (isNaN(q) || q < 0 || !Number.isInteger(q)) {
        newErrors.quantity = 'Quantity must be a non-negative whole number.';
      } else if (isEditing && initialData) {
        const currentlyIssued = (initialData.quantity || 0) - (initialData.available || 0);
        if (q < currentlyIssued) {
          newErrors.quantity = `Cannot set quantity below ${currentlyIssued} (copies currently issued to students).`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const currentlyIssued = isEditing && initialData ? (initialData.quantity || 0) - (initialData.available || 0) : 0;

  return (
    <form onSubmit={handleSubmit} className="card" noValidate>
      <div className="card-header">
        <h3 className="card-title">
          {isEditing ? `Edit Book: ${initialData?.title || ''}` : 'Enter Book Details'}
        </h3>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/books')}
        >
          <ArrowLeft size={16} /> Back to Books
        </button>
      </div>

      <div className="form-grid">
        {/* Title */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="title">
            Book Title <span className="required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Harry Potter and the Sorcerer's Stone"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.title && <span className="form-feedback">{errors.title}</span>}
        </div>

        {/* Author */}
        <div className="form-group">
          <label className="form-label" htmlFor="author">
            Author <span className="required">*</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            className={`form-input ${errors.author ? 'is-invalid' : ''}`}
            placeholder="e.g. J. K. Rowling"
            value={formData.author}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.author && <span className="form-feedback">{errors.author}</span>}
        </div>

        {/* ISBN */}
        <div className="form-group">
          <label className="form-label" htmlFor="isbn">
            ISBN (International Standard Book No.) <span className="required">*</span>
          </label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            className={`form-input ${errors.isbn ? 'is-invalid' : ''}`}
            placeholder="e.g. 978-0747532743"
            value={formData.isbn}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.isbn && <span className="form-feedback">{errors.isbn}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category / Genre <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="form-feedback">{errors.category}</span>}
        </div>

        {/* Total Quantity */}
        <div className="form-group">
          <label className="form-label" htmlFor="quantity">
            Total Copies Owned <span className="required">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            className={`form-input ${errors.quantity ? 'is-invalid' : ''}`}
            placeholder="e.g. 5"
            value={formData.quantity}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.quantity ? (
            <span className="form-feedback">{errors.quantity}</span>
          ) : isEditing ? (
            <span className="form-helper">
              Currently issued: <strong>{currentlyIssued}</strong> | Currently available: <strong>{initialData?.available || 0}</strong>
            </span>
          ) : (
            <span className="form-helper">All copies will initially be marked as available to issue.</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/books')}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <Save size={18} />
          {isLoading ? 'Saving Record...' : isEditing ? 'Update Book' : 'Add Book to Catalog'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
