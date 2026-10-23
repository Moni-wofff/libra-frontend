import React, { useState, useEffect } from 'react';
import { borrowRequestService } from '../../services/borrowRequestService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  BookOpen,
  User,
  Calendar,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const BorrowRequests = () => {
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [requestToApprove, setRequestToApprove] = useState(null);
  const [requestToReject, setRequestToReject] = useState(null);

  // Form states for approval
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      const res = await borrowRequestService.getAllRequests(params);
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load borrow requests:', err);
      showToast('Error loading borrow requests.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleApproveConfirm = async () => {
    if (!requestToApprove) return;
    try {
      setIsSubmitting(true);
      const res = await borrowRequestService.approveRequest(requestToApprove._id, {
        dueDate,
        adminNotes: approvalNotes,
      });
      showToast(res.message || 'Request approved and book issued!', 'success');
      setRequestToApprove(null);
      setApprovalNotes('');
      fetchRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to approve borrow request.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!requestToReject) return;
    try {
      setIsSubmitting(true);
      const res = await borrowRequestService.rejectRequest(requestToReject._id, {
        adminNotes: rejectionNotes,
      });
      showToast(res.message || 'Borrow request rejected.', 'success');
      setRequestToReject(null);
      setRejectionNotes('');
      fetchRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject borrow request.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter by search
  const filteredRequests = requests.filter((req) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const bookTitle = req.book?.title?.toLowerCase() || '';
    const studentName = req.student?.name?.toLowerCase() || '';
    const membershipId = req.student?.membershipId?.toLowerCase() || '';
    const email = req.student?.email?.toLowerCase() || '';
    return (
      bookTitle.includes(term) ||
      studentName.includes(term) ||
      membershipId.includes(term) ||
      email.includes(term)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Borrow Requests & Approvals</h1>
          <p className="page-subtitle">
            Review student borrowing applications, verify inventory availability, and authorize lending
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={16} /> Pending Requests
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <CheckCircle size={16} /> Approved Loans
        </button>
        <button
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <XCircle size={16} /> Rejected
        </button>
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Inbox size={16} /> All Applications
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div className="search-input-wrapper" style={{ width: '100%' }}>
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search requests by member name, ID, book title, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading borrow requests..." />
        ) : filteredRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Requested Book</th>
                  <th>Student Member</th>
                  <th>Requested On</th>
                  <th>Status</th>
                  <th>Details & Notes</th>
                  <th style={{ textAlign: 'right' }}>Administrative Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const isAvailable = (req.book?.available || 0) > 0;

                  return (
                    <tr key={req._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {req.book?.title || 'Unknown Title'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          By {req.book?.author || 'N/A'} • {req.book?.category || 'Genre'}
                        </div>
                        <div style={{ marginTop: '4px', display: 'flex', gap: '6px' }}>
                          <span
                            className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {req.book?.available ?? 0} / {req.book?.quantity ?? 0} in stock
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{req.student?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          ID: <code style={{ color: 'var(--color-accent)' }}>{req.student?.membershipId || 'N/A'}</code>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-text-light)' }}>
                          {req.student?.email || ''}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {new Date(req.requestDate || req.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        {req.status === 'approved' ? (
                          <span className="badge badge-success">
                            <CheckCircle size={12} /> Approved
                          </span>
                        ) : req.status === 'rejected' ? (
                          <span className="badge badge-danger">
                            <XCircle size={12} /> Rejected
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                      </td>

                      <td>
                        {req.status === 'approved' && req.issue ? (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Due:{' '}
                            <strong style={{ color: 'var(--color-primary)' }}>
                              {new Date(req.issue.dueDate).toLocaleDateString()}
                            </strong>
                          </div>
                        ) : req.adminNotes ? (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            "{req.adminNotes}"
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>—</span>
                        )}
                      </td>

                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          {req.status === 'pending' ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setRequestToApprove(req);
                                  setDueDate(getDefaultDueDate());
                                }}
                                disabled={!isAvailable}
                                title={!isAvailable ? 'Cannot approve: 0 copies in stock' : 'Approve loan'}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                                onClick={() => setRequestToReject(req)}
                                title="Reject request"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                              Processed
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
            icon={Inbox}
            title={
              activeTab === 'pending'
                ? 'No Pending Requests'
                : activeTab === 'approved'
                ? 'No Approved Requests Found'
                : activeTab === 'rejected'
                ? 'No Rejected Requests'
                : 'No Borrow Requests'
            }
            description={
              activeTab === 'pending'
                ? 'All student borrow requests have been reviewed and processed.'
                : search
                ? 'No requests matched your search criteria.'
                : 'No borrow records under this status filter.'
            }
          />
        )}
      </div>

      {/* Approval Confirmation Modal */}
      <Modal
        isOpen={!!requestToApprove}
        title="Approve Borrow Request & Issue Book"
        onClose={() => setRequestToApprove(null)}
        onConfirm={handleApproveConfirm}
        confirmText="Confirm & Issue Book"
        confirmVariant="primary"
        isLoading={isSubmitting}
      >
        <p>
          Approve lending request for <strong>"{requestToApprove?.book?.title}"</strong> to student{' '}
          <strong>{requestToApprove?.student?.name}</strong> (ID: {requestToApprove?.student?.membershipId})?
        </p>

        <div style={{ marginTop: '16px' }}>
          <label className="form-label" htmlFor="modalDueDate">
            Return Deadline / Due Date <span className="required">*</span>
          </label>
          <input
            id="modalDueDate"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginTop: '14px' }}>
          <label className="form-label" htmlFor="modalNotes">
            Admin Note (Optional)
          </label>
          <input
            id="modalNotes"
            type="text"
            className="form-input"
            placeholder="e.g., Verified card, issued at Circulation Desk A"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f0fdf4',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #bbf7d0',
            fontSize: '0.85rem',
            color: '#166534',
          }}
        >
          • Library available inventory for "{requestToApprove?.book?.title}" will automatically decrement by 1.
          <br />
          • An active loan transaction will be created and tracked in Issued Books.
        </div>
      </Modal>

      {/* Rejection Confirmation Modal */}
      <Modal
        isOpen={!!requestToReject}
        title="Reject Borrow Request"
        onClose={() => setRequestToReject(null)}
        onConfirm={handleRejectConfirm}
        confirmText="Confirm Rejection"
        confirmVariant="danger"
        isLoading={isSubmitting}
      >
        <p>
          Decline lending request for <strong>"{requestToReject?.book?.title}"</strong> from student{' '}
          <strong>{requestToReject?.student?.name}</strong>?
        </p>

        <div style={{ marginTop: '16px' }}>
          <label className="form-label" htmlFor="modalRejectNotes">
            Reason for Rejection (Optional)
          </label>
          <textarea
            id="modalRejectNotes"
            className="form-input"
            rows={3}
            placeholder="e.g., Card limit exceeded, reserved for reference only, or item maintenance"
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Declining will not change book inventory or create an issued record. The student will be able to see the status in their portal.
        </p>
      </Modal>
    </div>
  );
};

export default BorrowRequests;
