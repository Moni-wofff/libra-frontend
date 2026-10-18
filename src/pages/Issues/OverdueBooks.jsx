import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../../services/issueService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  AlertTriangle,
  RotateCcw,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const OverdueBooks = () => {
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Return Book modal state
  const [issueToReturn, setIssueToReturn] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  const fetchOverdueIssues = async () => {
    try {
      setIsLoading(true);
      const res = await issueService.getIssues({ status: 'overdue' });
      if (res.success) {
        setIssues(res.data);
      }
    } catch (err) {
      console.error('Failed to load overdue books:', err);
      showToast('Error loading overdue books.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueIssues();
  }, []);

  const handleReturnConfirm = async () => {
    if (!issueToReturn) return;
    try {
      setIsReturning(true);
      const res = await issueService.returnBook(issueToReturn._id);
      showToast(res.message || 'Book returned and cleared from overdue list!', 'success');
      setIssueToReturn(null);
      fetchOverdueIssues();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record return.';
      showToast(msg, 'error');
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle color="#dc2626" /> Overdue Books Monitoring
          </h1>
          <p className="page-subtitle">Track book loans that have exceeded their designated return date</p>
        </div>
        <Link to="/issues" className="btn btn-secondary btn-sm">
          View All Issued Books <ArrowRight size={16} />
        </Link>
      </div>

      {/* Alert Banner */}
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
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem' }}>
            Attention Required: {issues.length} Overdue Book{issues.length === 1 ? '' : 's'}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#b91c1c', marginTop: '2px' }}>
            The following book loans have passed their agreed due date. Contact the student cardholders or record the return once received.
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Checking overdue transactions..." />
        ) : issues.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student Member</th>
                  <th>Contact Info</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const now = new Date();
                  const dueDateObj = new Date(issue.dueDate);
                  const daysOverdue = Math.max(
                    1,
                    Math.floor((now - dueDateObj) / (1000 * 60 * 60 * 24))
                  );

                  return (
                    <tr key={issue._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {issue.book?.title || 'Unknown Title'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          ISBN: {issue.book?.isbn || 'N/A'} • {issue.book?.category || 'Genre'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{issue.student?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          ID: <code style={{ color: 'var(--color-accent)' }}>{issue.student?.membershipId || 'N/A'}</code>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Mail size={13} color="var(--color-text-light)" /> {issue.student?.email}
                        </div>
                        <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                          <Phone size={13} color="var(--color-text-light)" /> {issue.student?.phone}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {new Date(issue.issueDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626' }}>
                          {dueDateObj.toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-danger">
                          {daysOverdue} Day{daysOverdue > 1 ? 's' : ''} Late
                        </span>
                      </td>

                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: 'var(--color-primary-light)' }}
                            onClick={() => setIssueToReturn(issue)}
                          >
                            <RotateCcw size={14} /> Record Return
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
            icon={CheckCircle}
            title="Zero Overdue Books"
            description="All currently borrowed library books are on schedule. No overdue action needed."
            actionText="View All Issued Books"
            onAction={() => window.location.assign('/issues')}
          />
        )}
      </div>

      {/* Return Modal */}
      <Modal
        isOpen={!!issueToReturn}
        title="Record Return for Overdue Book"
        onClose={() => setIssueToReturn(null)}
        onConfirm={handleReturnConfirm}
        confirmText="Confirm Book Return"
        confirmVariant="primary"
        isLoading={isReturning}
      >
        <p>
          Mark <strong>"{issueToReturn?.book?.title}"</strong> as returned from student{' '}
          <strong>{issueToReturn?.student?.name}</strong>?
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
          This will update the issue record to 'returned' and increase library available copies by 1.
        </p>
      </Modal>
    </div>
  );
};

export default OverdueBooks;
