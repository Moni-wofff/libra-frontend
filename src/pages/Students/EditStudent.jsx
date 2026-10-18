import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import StudentForm from '../../components/StudentForm';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsFetching(true);
        const res = await studentService.getStudentById(id);
        if (res.success && res.data) {
          setStudent(res.data);
        } else {
          showToast('Member not found.', 'error');
          navigate('/students');
        }
      } catch (err) {
        showToast('Error retrieving member information.', 'error');
        navigate('/students');
      } finally {
        setIsFetching(false);
      }
    };
    fetchStudent();
  }, [id, navigate, showToast]);

  const handleUpdate = async (formData) => {
    try {
      setIsSaving(true);
      const res = await studentService.updateStudent(id, formData);
      showToast(res.message || 'Member details updated successfully!', 'success');
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update member. Please check fields.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return <LoadingSpinner message="Fetching member details..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Member Record</h1>
          <p className="page-subtitle">Update contact details and identification code</p>
        </div>
      </div>

      <StudentForm
        initialData={student}
        onSubmit={handleUpdate}
        isEditing={true}
        isLoading={isSaving}
      />
    </div>
  );
};

export default EditStudent;
