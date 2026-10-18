import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  ClipboardList,
  BookUp,
  Search,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-react';

const IssuedBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const { showToast } = useToast();

  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Return Book modal state
  const [issueToReturn, setIssueToReturn] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await issueService.getIssues(params);
      if (res.success) {
        setIssues(res.data);
      }
    } catch (err) {
      console.error('Failed to load issues:', err);
      showToast('Error loading issued books list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 250);
    return () => clearTimeout(timer);
  }, [activeTab, search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', tab);
    }
    setSearchParams(searchParams);
  };

  const handleReturnConfirm = async () => {
    if (!issueToReturn) return;
    try {
      setIsReturning(true);
      const res = await issueService.returnBook(issueToReturn._id);
      showToast(res.message || 'Book marked as returned successfully!', 'success');
      setIssueToReturn(null);
      fetchIssues();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record book return.';
      showToast(msg, 'error');
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Issued Books & Circulation Tracking</h1>
          <p className="page-subtitle">Monitor ongoing book loans, return dates, and overdue items</p>
        </div>
        <Link to="/issues/new" className="btn btn-primary">
          <BookUp size={18} /> Issue New Book
        </Link>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          <ClipboardList size={16} /> All Transactions
        </button>
        <button
          className={`tab-btn ${activeTab === 'issued' ? 'active' : ''}`}
          onClick={() => handleTabChange('issued')}
        >
          <Clock size={16} /> Currently Issued
        </button>
        <button
          className={`tab-btn ${activeTab === 'returned' ? 'active' : ''}`}
          onClick={() => handleTabChange('returned')}
        >
          <CheckCircle size={16} /> Returned
        </button>
        <button
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => handleTabChange('overdue')}
          style={{ color: activeTab === 'overdue' ? '#dc2626' : undefined }}
        >
          <AlertTriangle size={16} color={activeTab === 'overdue' ? '#dc2626' : '#d97706'} /> Overdue
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div className="search-input-wrapper" style={{ width: '100%' }}>
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by book title, author, member name, or membership ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Issues Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading circulation transactions..." />
        ) : issues.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title & Details</th>
                  <th>Student Member</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Circulation Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const now = new Date();
                  const dueDateObj = new Date(issue.dueDate);
                  const isOverdue = issue.status === 'issued' && dueDateObj < now;

                  // Calculate days overdue
                  const daysOverdue = isOverdue
                    ? Math.floor((now - dueDateObj) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <tr key={issue._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {issue.book?.title || 'Unknown Title'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          By {issue.book?.author || 'N/A'} • {issue.book?.category || 'Genre'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-light)' }}>
                          ISBN: {issue.book?.isbn || 'N/A'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{issue.student?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          ID: <code style={{ color: 'var(--color-accent)' }}>{issue.student?.membershipId || 'N/A'}</code>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-text-light)' }}>
                          {issue.student?.email || ''}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {new Date(issue.issueDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: isOverdue ? 700 : 500,
                            color: isOverdue ? '#dc2626' : 'inherit',
                          }}
                        >
                          {dueDateObj.toLocaleDateString()}
                        </span>
                        {isOverdue && (
                          <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 600 }}>
                            {daysOverdue === 0 ? 'Due today' : `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`}
                          </div>
                        )}
                      </td>

                      <td>
                        {issue.returnDate ? (
                          <span style={{ fontSize: '0.85rem', color: '#059669' }}>
                            {new Date(issue.returnDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>—</span>
                        )}
                      </td>

                      <td>
                        {issue.status === 'returned' ? (
                          <span className="badge badge-success">
                            <CheckCircle size={12} /> Returned
                          </span>
                        ) : isOverdue ? (
                          <span className="badge badge-danger">
                            <AlertTriangle size={12} /> Overdue
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <Clock size={12} /> Currently Issued
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          {issue.status === 'issued' ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{
                                color: 'var(--color-primary)',
                                borderColor: 'var(--color-accent-light)',
                                backgroundColor: '#f0f4ff',
                              }}
                              onClick={() => setIssueToReturn(issue)}
                            >
                              <RotateCcw size={14} /> Record Return
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                              Completed
                            </span>
                          )}
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
            icon={ClipboardList}
            title={
              activeTab === 'overdue'
                ? 'No Overdue Books!'
                : activeTab === 'issued'
                ? 'No Currently Issued Books'
                : activeTab === 'returned'
                ? 'No Returned Records'
                : 'No Circulation Records'
            }
            description={
              activeTab === 'overdue'
                ? 'Great news! There are currently no books past their return deadline.'
                : search
                ? 'No issue transactions matched your search query.'
                : 'No book loans found under this filter.'
            }
            actionText="Issue a Book"
            onAction={() => window.location.assign('/issues/new')}
          />
        )}
      </div>

      {/* Return Confirmation Modal */}
      <Modal
        isOpen={!!issueToReturn}
        title="Record Book Return"
        onClose={() => setIssueToReturn(null)}
        onConfirm={handleReturnConfirm}
        confirmText="Confirm Book Return"
        confirmVariant="primary"
        isLoading={isReturning}
      >
        <p>
          Confirm return for <strong>"{issueToReturn?.book?.title}"</strong> borrowed by{' '}
          <strong>{issueToReturn?.student?.name}</strong> (ID: {issueToReturn?.student?.membershipId})?
        </p>
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.85rem',
          }}
        >
          <div>
            Due Date: <strong>{issueToReturn?.dueDate ? new Date(issueToReturn.dueDate).toLocaleDateString() : 'N/A'}</strong>
          </div>
          <div style={{ marginTop: '4px', color: '#059669', fontWeight: 600 }}>
            • Library available copy count will automatically increase by 1.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IssuedBooks;
