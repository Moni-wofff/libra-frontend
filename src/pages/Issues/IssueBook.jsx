import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { studentService } from '../../services/studentService';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BookUp, BookOpen, User, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';

const IssueBook = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Default due date = 14 days from today
  const getInitialDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [dueDate, setDueDate] = useState(getInitialDueDate());
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [booksRes, studentsRes] = await Promise.all([
          bookService.getBooks(),
          studentService.getStudents(),
        ]);

        if (booksRes.success) setBooks(booksRes.data);
        if (studentsRes.success) setStudents(studentsRes.data);
      } catch (err) {
        console.error('Failed to load issue form data:', err);
        showToast('Error loading books and member directory.', 'error');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [showToast]);

  const selectedBook = books.find((b) => b._id === selectedBookId);
  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  const validate = () => {
    const newErrors = {};
    if (!selectedBookId) newErrors.bookId = 'Please select a book to issue.';
    else if (selectedBook && selectedBook.available <= 0) {
      newErrors.bookId = 'This book is currently out of stock (0 available copies).';
    }

    if (!selectedStudentId) newErrors.studentId = 'Please select a student member.';

    if (!dueDate) newErrors.dueDate = 'Due date is required.';
    else {
      const issueDay = new Date(issueDate).setHours(0, 0, 0, 0);
      const dueDay = new Date(dueDate).setHours(0, 0, 0, 0);
      if (dueDay < issueDay) {
        newErrors.dueDate = 'Due date cannot be earlier than the issue date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await issueService.createIssue({
        bookId: selectedBookId,
        studentId: selectedStudentId,
        issueDate,
        dueDate,
      });

      showToast(res.message || 'Book issued successfully!', 'success');
      navigate('/issues');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to issue book. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <LoadingSpinner message="Loading catalog and members for book issuance..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Issue Book to Member</h1>
          <p className="page-subtitle">Create a new lending transaction and set return deadline</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/issues')}
        >
          <ArrowLeft size={16} /> View Issued Books
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="card" noValidate>
          <div className="card-header">
            <h3 className="card-title">
              <BookUp size={20} color="var(--color-accent)" /> Book Circulation Form
            </h3>
          </div>

          {/* Book Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="bookId">
              Select Book Title <span className="required">*</span>
            </label>
            <select
              id="bookId"
              className={`form-select ${errors.bookId ? 'is-invalid' : ''}`}
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setErrors((prev) => ({ ...prev, bookId: '' }));
              }}
              disabled={isSubmitting}
            >
              <option value="">-- Choose an available book from catalog --</option>
              {books.map((b) => (
                <option
                  key={b._id}
                  value={b._id}
                  disabled={b.available <= 0}
                >
                  {b.title} — {b.author} ({b.available} / {b.quantity} available) {b.available <= 0 ? ' [OUT OF STOCK]' : ''}
                </option>
              ))}
            </select>
            {errors.bookId && <span className="form-feedback">{errors.bookId}</span>}
          </div>

          {/* Student Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              Select Student Member <span className="required">*</span>
            </label>
            <select
              id="studentId"
              className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setErrors((prev) => ({ ...prev, studentId: '' }));
              }}
              disabled={isSubmitting}
            >
              <option value="">-- Choose a registered student cardholder --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.membershipId}) — {s.email}
                </option>
              ))}
            </select>
            {errors.studentId && <span className="form-feedback">{errors.studentId}</span>}
          </div>

          {/* Dates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="issueDate">
                Issue Date <span className="required">*</span>
              </label>
              <input
                id="issueDate"
                type="date"
                className="form-input"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">
                Due Date <span className="required">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                className={`form-input ${errors.dueDate ? 'is-invalid' : ''}`}
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setErrors((prev) => ({ ...prev, dueDate: '' }));
                }}
                disabled={isSubmitting}
              />
              {errors.dueDate && <span className="form-feedback">{errors.dueDate}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/issues')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || (selectedBook && selectedBook.available <= 0)}
            >
              <CheckCircle size={18} />
              {isSubmitting ? 'Confirming Issue...' : 'Confirm & Issue Book'}
            </button>
          </div>
        </form>

        {/* Live Preview Summary Card */}
        <div className="card" style={{ height: 'fit-content', background: '#f8fafc' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>
              Transaction Summary Preview
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Book Details */}
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <BookOpen size={16} /> Selected Book
              </div>
              {selectedBook ? (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selectedBook.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>By {selectedBook.author}</div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                    <span className="badge badge-primary">{selectedBook.category}</span>
                    <span className={`badge ${selectedBook.available > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {selectedBook.available} copies available
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                  No book selected yet.
                </div>
              )}
            </div>

            {/* Student Details */}
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <User size={16} /> Member Recipient
              </div>
              {selectedStudent ? (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>ID: {selectedStudent.membershipId}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{selectedStudent.email} • {selectedStudent.phone}</div>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
                  No member selected yet.
                </div>
              )}
            </div>

            {/* Schedule Info */}
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <Calendar size={16} /> Lending Duration
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                <div>Issue Date: <strong>{new Date(issueDate).toLocaleDateString()}</strong></div>
                <div>Due Date: <strong>{new Date(dueDate).toLocaleDateString()}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
