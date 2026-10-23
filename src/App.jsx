import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Public & Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/Dashboard';
import BorrowRequests from './pages/Admin/BorrowRequests';
import ManageBooks from './pages/Books/ManageBooks';
import AddBook from './pages/Books/AddBook';
import EditBook from './pages/Books/EditBook';
import ManageStudents from './pages/Students/ManageStudents';
import AddStudent from './pages/Students/AddStudent';
import EditStudent from './pages/Students/EditStudent';
import IssueBook from './pages/Issues/IssueBook';
import IssuedBooks from './pages/Issues/IssuedBooks';
import OverdueBooks from './pages/Issues/OverdueBooks';

// User Pages
import UserDashboard from './pages/User/UserDashboard';
import BrowseBooks from './pages/User/BrowseBooks';
import MyRequests from './pages/User/MyRequests';
import MyIssuedBooks from './pages/User/MyIssuedBooks';

// Helper for fallback route redirection
const FallbackRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'admin' ? '/dashboard' : '/user/dashboard'} replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin Routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Borrow Requests Approvals */}
        <Route path="requests" element={<BorrowRequests />} />

        {/* Books Management */}
        <Route path="books" element={<ManageBooks />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:id" element={<EditBook />} />

        {/* Students / Members Management */}
        <Route path="students" element={<ManageStudents />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/edit/:id" element={<EditStudent />} />

        {/* Book Circulation & Returns */}
        <Route path="issues" element={<IssuedBooks />} />
        <Route path="issues/new" element={<IssueBook />} />
        <Route path="issues/overdue" element={<OverdueBooks />} />
      </Route>

      {/* Protected User / Member Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="books" element={<BrowseBooks />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="my-books" element={<MyIssuedBooks />} />
      </Route>

      {/* Dynamic Fallback */}
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}

export default App;
