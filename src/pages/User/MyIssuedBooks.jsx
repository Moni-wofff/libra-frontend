import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
} from 'lucide-react';

const MyIssuedBooks = () => {
  const { showToast } = useToast();

  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyIssues = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      const res = await issueService.getMyIssues(params);
      if (res.success) {
        setIssues(res.data);
      }
    } catch (err) {
      console.error('Failed to load my issued books:', err);
      showToast('Error loading your issued books.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, [activeTab]);

  const now = new Date();
  const overdueCount = issues.filter(
    (i) => i.status === 'issued' && new Date(i.dueDate) < now
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Borrowed Books & Loan History</h1>
          <p className="page-subtitle">
            View your active library loans, return deadlines, and completed reading history
          </p>
        </div>
        <Link to="/user/books" className="btn btn-secondary btn-sm">
          <BookOpen size={16} /> Explore Catalog
        </Link>
      </div>

      {/* Overdue Warning Alert */}
      {overdueCount > 0 && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.94rem' }}>
              Action Required: {overdueCount} Book loan{overdueCount > 1 ? 's are' : ' is'} past due!
            </div>
            <div style={{ fontSize: '0.84rem', color: '#b91c1c', marginTop: '2px' }}>
              Please visit the library circulation desk to return overdue books and prevent card suspension.
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <ClipboardList size={16} /> All Loans
        </button>
        <button
          className={`tab-btn ${activeTab === 'issued' ? 'active' : ''}`}
          onClick={() => setActiveTab('issued')}
        >
          <Clock size={16} /> Currently Borrowed
        </button>
        <button
          className={`tab-btn ${activeTab === 'returned' ? 'active' : ''}`}
          onClick={() => setActiveTab('returned')}
        >
          <CheckCircle size={16} /> Returned Books
        </button>
        <button
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
          style={{ color: activeTab === 'overdue' ? '#dc2626' : undefined }}
        >
          <AlertTriangle size={16} color={activeTab === 'overdue' ? '#dc2626' : '#d97706'} /> Overdue
        </button>
      </div>

      {/* Issues Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading your loan transactions..." />
        ) : issues.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title & Details</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const dueDateObj = new Date(issue.dueDate);
                  const isOverdue = issue.status === 'issued' && dueDateObj < now;
                  const daysLeft = Math.ceil((dueDateObj - now) / (1000 * 60 * 60 * 24));
                  const daysLate = Math.floor((now - dueDateObj) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={issue._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {issue.book?.title || 'Unknown Title'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          By {issue.book?.author || 'N/A'} • {issue.book?.category || 'Genre'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-light)' }}>
                          ISBN: {issue.book?.isbn || 'N/A'}
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
                        {issue.status === 'issued' && (
                          <div
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              color: isOverdue ? '#dc2626' : '#059669',
                            }}
                          >
                            {isOverdue
                              ? daysLate === 0
                                ? 'Due today'
                                : `${daysLate} day${daysLate > 1 ? 's' : ''} overdue`
                              : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`}
                          </div>
                        )}
                      </td>

                      <td>
                        {issue.returnDate ? (
                          <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                            {new Date(issue.returnDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                            In Circulation
                          </span>
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
                            <Clock size={12} /> Active Loan
                          </span>
                        )}
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
                ? 'No Overdue Loans'
                : activeTab === 'issued'
                ? 'No Currently Borrowed Books'
                : activeTab === 'returned'
                ? 'No Returned Loans'
                : 'No Loan Records Found'
            }
            description={
              activeTab === 'overdue'
                ? 'Great job! You have no books past their return deadline.'
                : 'You have no borrowing records under this status.'
            }
            actionText="Browse Available Books"
            onAction={() => window.location.assign('/user/books')}
          />
        )}
      </div>
    </div>
  );
};

export default MyIssuedBooks;
