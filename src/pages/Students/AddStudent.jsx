import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import StudentForm from '../../components/StudentForm';

const AddStudent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true);
      const res = await studentService.createStudent(formData);
      showToast(res.message || 'Student member registered successfully!', 'success');
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register member. Please check fields.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Register Member</h1>
          <p className="page-subtitle">Enroll a new student or library cardholder</p>
        </div>
      </div>

      <StudentForm onSubmit={handleCreate} isEditing={false} isLoading={isLoading} />
    </div>
  );
};

export default AddStudent;
