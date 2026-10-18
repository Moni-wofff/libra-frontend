import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  CreditCard,
} from 'lucide-react';

const ManageStudents = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();

      const res = await studentService.getStudents(params);
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast('Failed to load student members list.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      const res = await studentService.deleteStudent(studentToDelete._id);
      showToast(res.message || 'Member record deleted successfully.', 'success');
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete member. They may have active book loans.';
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
          <h1 className="page-title">Manage Student Members</h1>
          <p className="page-subtitle">Registered library cardholders, contact details, and records</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">
          <UserPlus size={18} /> Register New Member
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div className="search-input-wrapper" style={{ width: '100%' }}>
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name, membership ID, or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Loading member directory..." />
        ) : students.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Membership ID</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {student.name}
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge badge-info"
                        style={{ fontFamily: 'monospace', gap: 4 }}
                      >
                        <CreditCard size={12} /> {student.membershipId}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}>
                        <Mail size={14} color="var(--color-text-light)" />
                        {student.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.86rem' }}>
                        <Phone size={14} color="var(--color-text-light)" />
                        {student.phone}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="action-btn"
                          title="Edit member details"
                          onClick={() => navigate(`/students/edit/${student._id}`)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete member"
                          onClick={() => setStudentToDelete(student)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={search ? 'No Matching Members' : 'No Registered Members'}
            description={
              search
                ? 'No students found matching your search term. Try a different query.'
                : 'There are currently no registered library cardholders. Add your first member to enable book issuing.'
            }
            actionText={search ? 'Clear Search' : 'Register First Member'}
            onAction={search ? () => setSearch('') : () => navigate('/students/add')}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!studentToDelete}
        title="Confirm Member Deletion"
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Yes, Delete Member"
        confirmVariant="danger"
        isLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete member <strong>"{studentToDelete?.name}"</strong> (ID: {studentToDelete?.membershipId})?
        </p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Note: Members with active issued books cannot be deleted until all borrowed books are returned.
        </p>
      </Modal>
    </div>
  );
};

export default ManageStudents;
