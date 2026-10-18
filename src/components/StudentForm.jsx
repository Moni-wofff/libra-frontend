import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const StudentForm = ({ initialData, onSubmit, isEditing = false, isLoading = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        membershipId: initialData.membershipId || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.membershipId.trim()) {
      newErrors.membershipId = 'Membership ID is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'membershipId' ? value.toUpperCase() : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" noValidate>
      <div className="card-header">
        <h3 className="card-title">
          {isEditing ? `Edit Member: ${initialData?.name || ''}` : 'Register New Member'}
        </h3>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/students')}
        >
          <ArrowLeft size={16} /> Back to Members
        </button>
      </div>

      <div className="form-grid">
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Student / Member Name <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.name && <span className="form-feedback">{errors.name}</span>}
        </div>

        {/* Membership ID */}
        <div className="form-group">
          <label className="form-label" htmlFor="membershipId">
            Membership ID <span className="required">*</span>
          </label>
          <input
            id="membershipId"
            name="membershipId"
            type="text"
            className={`form-input ${errors.membershipId ? 'is-invalid' : ''}`}
            placeholder="e.g. LIB-2026-005"
            value={formData.membershipId}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.membershipId ? (
            <span className="form-feedback">{errors.membershipId}</span>
          ) : (
            <span className="form-helper">Unique library card identification code.</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'is-invalid' : ''}`}
            placeholder="e.g. rahul.sharma@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <span className="form-feedback">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.phone && <span className="form-feedback">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/students')}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <Save size={18} />
          {isLoading ? 'Saving Record...' : isEditing ? 'Update Member' : 'Register Member'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
