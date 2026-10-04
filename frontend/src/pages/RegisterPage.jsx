import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      showToast('Account registered successfully! Welcome aboard.', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '460px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}
      id="register-page-container"
    >
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#0284C7'
            }}
          >
            <UserPlus size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', color: 'var(--text-heading)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign up to collaborate and manage team projects
          </p>
        </div>

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name *
            </label>
            <input
              type="text"
              id="register-name"
              name="name"
              className="form-control"
              placeholder="e.g. Sarah Connor"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address *
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              className="form-control"
              placeholder="sarah@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password (min. 6 characters) *
            </label>
            <input
              type="password"
              id="register-password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-role">
              Organizational Role
            </label>
            <select
              id="register-role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Member">Team Member</option>
              <option value="Manager">Project Manager</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={loading}
            id="btn-register-submit"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={18} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
            id="link-go-to-login"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
