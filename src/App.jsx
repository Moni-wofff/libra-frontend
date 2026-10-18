import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageBooks from './pages/Books/ManageBooks';
import AddBook from './pages/Books/AddBook';
import EditBook from './pages/Books/EditBook';
import ManageStudents from './pages/Students/ManageStudents';
import AddStudent from './pages/Students/AddStudent';
import EditStudent from './pages/Students/EditStudent';
import IssueBook from './pages/Issues/IssueBook';
import IssuedBooks from './pages/Issues/IssuedBooks';
import OverdueBooks from './pages/Issues/OverdueBooks';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Books Management */}
        <Route path="books" element={<ManageBooks />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:id" element={<EditBook />} />

        {/* Students / Members Management */}
        <Route path="students" element={<ManageStudents />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/edit/:id" element={<EditStudent />} />

        {/* Book Issue & Return Management */}
        <Route path="issues" element={<IssuedBooks />} />
        <Route path="issues/new" element={<IssueBook />} />
        <Route path="issues/overdue" element={<OverdueBooks />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
