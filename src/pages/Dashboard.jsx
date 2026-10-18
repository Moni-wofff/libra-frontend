import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  BookOpen,
  Copy,
  CheckCircle,
  Users,
  BookUp,
  AlertTriangle,
  PlusCircle,
  UserPlus,
  ArrowRight,
  PieChart,
  Calendar,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [statsRes, issuesRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentIssues(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (issuesRes.success) {
        setRecentIssues(issuesRes.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to fetch library statistics. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calculating library statistics and metrics..." />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Library Overview Dashboard</h1>
          <p className="page-subtitle">Real-time inventory counts, member circulation, and issue activity</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchDashboardData}
            className="btn btn-secondary btn-sm"
            title="Refresh database statistics"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            borderRadius: 'var(--radius-md)',
            color: '#991b1b',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* 6 Statistic Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Book Titles"
          value={stats?.totalBookTitles}
          subtext="Unique catalog entries"
          icon={BookOpen}
          iconBg="#e0e7ff"
          iconColor="#4338ca"
        />

        <StatCard
          title="Total Copies"
          value={stats?.totalCopies}
          subtext="Total inventory volume"
          icon={Copy}
          iconBg="#f1f5f9"
          iconColor="#334155"
        />

        <StatCard
          title="Available Copies"
          value={stats?.totalAvailable}
          subtext="Ready to issue now"
          icon={CheckCircle}
          iconBg="#ecfdf5"
          iconColor="#10b981"
        />

        <StatCard
          title="Registered Members"
          value={stats?.totalMembers}
          subtext="Active student library cards"
          icon={Users}
          iconBg="#f0f9ff"
          iconColor="#0284c7"
        />

        <StatCard
          title="Currently Issued"
          value={stats?.currentlyIssued}
          subtext="Books in student circulation"
          icon={BookUp}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />

        <StatCard
          title="Overdue Transactions"
          value={stats?.overdueIssues}
          subtext="Past agreed return date"
          icon={AlertTriangle}
          iconBg="#fef2f2"
          iconColor="#ef4444"
        />
      </div>

      {/* Quick Actions Panel */}
      <div
        className="card"
        style={{
          marginBottom: '28px',
          background: 'linear-gradient(to right, #ffffff, #f8fafc)',
          borderLeft: '4px solid var(--color-accent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Quick Management Shortcuts
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
              Common circulation and cataloging operations
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/issues/new" className="btn btn-primary btn-sm">
              <BookUp size={16} /> Issue Book
            </Link>
            <Link to="/books/add" className="btn btn-secondary btn-sm">
              <PlusCircle size={16} /> Add Book
            </Link>
            <Link to="/students/add" className="btn btn-secondary btn-sm">
              <UserPlus size={16} /> Add Member
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Recent Activity Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Category Breakdown Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <PieChart size={20} color="var(--color-accent)" /> Catalog Category Distribution
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {stats?.categoryStats?.length || 0} Categories
            </span>
          </div>

          {stats?.categoryStats && stats.categoryStats.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.categoryStats.map((cat, idx) => {
                const totalTitles = stats.totalBookTitles || 1;
                const percentage = Math.round((cat.count / totalTitles) * 100);
                const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={cat._id || 'Uncategorized'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {cat._id || 'General'}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {cat.count} title{cat.count > 1 ? 's' : ''} ({cat.totalCopies} copies)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: barColor,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Categories Available"
              description="Add books to the library catalog to see genre distribution."
            />
          )}
        </div>

        {/* Recent Circulation Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} color="var(--color-accent)" /> Recent Issue Transactions
            </h3>
            <Link
              to="/issues"
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-accent)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {recentIssues.length > 0 ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Student Member</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => {
                    const isOverdue =
                      issue.status === 'issued' && new Date(issue.dueDate) < new Date();

                    return (
                      <tr key={issue._id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                            {issue.book?.title || 'Unknown Title'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-text-light)' }}>
                            ISBN: {issue.book?.isbn || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{issue.student?.name || 'Unknown'}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-text-light)' }}>
                            ID: {issue.student?.membershipId || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.84rem' }}>
                            {new Date(issue.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          {issue.status === 'returned' ? (
                            <span className="badge badge-success">Returned</span>
                          ) : isOverdue ? (
                            <span className="badge badge-danger">Overdue</span>
                          ) : (
                            <span className="badge badge-warning">Issued</span>
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
              title="No Recent Transactions"
              description="No books have been issued yet. Start issuing books to students."
              actionText="Issue a Book"
              onAction={() => window.location.assign('/issues/new')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
