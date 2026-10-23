import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { issueService } from '../../services/issueService';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  BookOpen,
  ClipboardList,
  AlertTriangle,
  Clock,
  ArrowRight,
  BookCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myActiveIssues, setMyActiveIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, issuesRes] = await Promise.all([
          dashboardService.getUserStats(),
          issueService.getMyIssues({ status: 'issued' }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (issuesRes.success) setMyActiveIssues(issuesRes.data);
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your library dashboard..." />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '0.76rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={13} color="#fde047" />
            <span>Cardholder Portal &bull; {user?.student?.membershipId || 'LIBRA-MEMBER'}</span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Access the complete library inventory, submit borrow requests, track due dates, and monitor return statuses in real-time.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Currently Borrowed"
          value={stats?.activeLoans ?? 0}
          subtext="Active book loans in possession"
          icon={ClipboardList}
          iconBg="#e0e7ff"
          iconColor="#4338ca"
        />

        <StatCard
          title="Overdue Notices"
          value={stats?.overdueLoans ?? 0}
          subtext={stats?.overdueLoans > 0 ? 'Requires immediate return' : 'All loans on schedule'}
          icon={AlertTriangle}
          iconBg={stats?.overdueLoans > 0 ? '#fee2e2' : '#f0fdf4'}
          iconColor={stats?.overdueLoans > 0 ? '#dc2626' : '#16a34a'}
        />

        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests ?? 0}
          subtext="Awaiting librarian approval"
          icon={Clock}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />

        <StatCard
          title="Available in Catalog"
          value={stats?.totalAvailableBooks ?? 0}
          subtext="Titles ready to request"
          icon={BookOpen}
          iconBg="#f0f9ff"
          iconColor="#0284c7"
        />
      </div>

      {/* Quick Action Bar */}
      <div
        className="card"
        style={{
          marginBottom: '28px',
          background: '#ffffff',
          borderLeft: '4px solid #6366f1',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Quick Library Actions
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
              Explore available books or check your current request status
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/user/books" className="btn btn-primary btn-sm">
              <BookOpen size={16} /> Browse Catalog
            </Link>
            <Link to="/user/requests" className="btn btn-secondary btn-sm">
              <Clock size={16} /> My Borrow Requests
            </Link>
            <Link to="/user/my-books" className="btn btn-secondary btn-sm">
              <Calendar size={16} /> Loan History & Returns
            </Link>
          </div>
        </div>
      </div>

      {/* Current Active Loans Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ClipboardList size={20} color="var(--color-accent)" /> My Active Book Loans
          </h3>
          <Link
            to="/user/my-books"
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            View All History <ArrowRight size={14} />
          </Link>
        </div>

        {myActiveIssues.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title & Details</th>
                  <th>Issue Date</th>
                  <th>Return Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myActiveIssues.map((issue) => {
                  const now = new Date();
                  const dueDateObj = new Date(issue.dueDate);
                  const isOverdue = dueDateObj < now;
                  const daysLeft = Math.ceil((dueDateObj - now) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={issue._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {issue.book?.title || 'Unknown Title'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          By {issue.book?.author || 'N/A'} • {issue.book?.category || 'Genre'}
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
                            fontWeight: isOverdue ? 700 : 600,
                            color: isOverdue ? '#dc2626' : 'var(--color-primary)',
                          }}
                        >
                          {dueDateObj.toLocaleDateString()}
                        </span>
                        {isOverdue ? (
                          <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 600 }}>
                            Overdue! Please return to circulation desk.
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.74rem', color: '#059669' }}>
                            {daysLeft === 0 ? 'Due today' : `${daysLeft} days remaining`}
                          </div>
                        )}
                      </td>
                      <td>
                        {isOverdue ? (
                          <span className="badge badge-danger">
                            <AlertTriangle size={12} /> Overdue
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <Clock size={12} /> Currently Issued
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
            icon={BookCheck}
            title="No Active Loans"
            description="You currently don't have any books borrowed. Browse our catalog to find books you'd like to read!"
            actionText="Browse Available Books"
            onAction={() => window.location.assign('/user/books')}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
