import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, LogOut, FolderKanban } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto' }} id="profile-page-container">
      <div className="card" style={{ padding: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0071E3, #38BDF8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '700',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.35)'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--text-heading)' }}>{user?.name || 'User Profile'}</h1>
              <span className="badge badge-progress">{user?.role || 'Member'}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        {/* User Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Shield size={16} color="#0071E3" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Role Authorization</span>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)' }}>{user?.role || 'Member'}</p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Calendar size={16} color="#059669" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Member Since</span>
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem'
          }}
        >
          <Link to="/projects" className="btn btn-secondary" id="btn-profile-view-projects">
            <FolderKanban size={16} />
            <span>Browse Projects</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-danger"
            id="btn-profile-logout"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
