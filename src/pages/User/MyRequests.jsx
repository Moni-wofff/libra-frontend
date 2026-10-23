import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowRequestService } from '../../services/borrowRequestService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Calendar,
  ArrowRight,
  Info,
} from 'lucide-react';

const MyRequests = () => {
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyRequests = async () => {
    try {
      setIsLoading(true);
      const res = await borrowRequestService.getMyRequests();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load my borrow requests:', err);
      showToast('Error loading your borrow requests.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Borrow Requests</h1>
          <p className="page-subtitle">Track the approval status and decision notes for your book loan applications</p>
        </div>
        <Link to="/user/books" className="btn btn-primary btn-sm">
          <BookOpen size={16} /> Request Another Book
        </Link>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Inbox size={16} /> All Applications ({requests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={16} /> Pending Review ({requests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <CheckCircle size={16} /> Approved ({requests.filter((r) => r.status === 'approved').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <XCircle size={16} /> Rejected ({requests.filter((r) => r.status === 'rejected').length})
        </button>
      </div>

      {/* Requests Card */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading your borrow request history..." />
        ) : filteredRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Submitted On</th>
                  <th>Decision Status</th>
                  <th>Loan & Admin Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {req.book?.title || 'Unknown Title'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        By {req.book?.author || 'N/A'} • {req.book?.category || 'Genre'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', marginTop: '2px' }}>
                        ISBN: {req.book?.isbn || 'N/A'}
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
                          <CheckCircle size={13} /> Approved
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="badge badge-danger">
                          <XCircle size={13} /> Rejected
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <Clock size={13} /> Awaiting Review
                        </span>
                      )}
                    </td>

                    <td>
                      {req.status === 'approved' ? (
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#059669' }}>
                            Book Issued to Card!
                          </div>
                          {req.issue?.dueDate && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                              Due Date: <strong>{new Date(req.issue.dueDate).toLocaleDateString()}</strong>
                            </div>
                          )}
                        </div>
                      ) : req.status === 'rejected' ? (
                        <div>
                          <div style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>
                            Application Declined
                          </div>
                          {req.adminNotes && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                              Librarian Note: "{req.adminNotes}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Pending library desk review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title={
              activeTab === 'pending'
                ? 'No Pending Applications'
                : activeTab === 'approved'
                ? 'No Approved Applications'
                : activeTab === 'rejected'
                ? 'No Rejected Applications'
                : 'No Borrow Requests Yet'
            }
            description={
              activeTab === 'all'
                ? 'You have not submitted any book requests yet. Explore the catalog to request titles.'
                : 'No borrow requests match this filter.'
            }
            actionText="Browse Library Books"
            onAction={() => window.location.assign('/user/books')}
          />
        )}
      </div>
    </div>
  );
};

export default MyRequests;
