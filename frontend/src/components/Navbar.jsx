import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand" id="brand-logo">
          <Layers size={26} color="#6366F1" />
          <span>ProjectHub</span>
        </Link>

        <nav className="nav-links" id="primary-navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            id="nav-link-dashboard"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            id="nav-link-projects"
          >
            <FolderKanban size={18} />
            <span>Projects</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/projects/new"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              id="nav-link-new-project"
            >
              <PlusCircle size={18} />
              <span>Create Project</span>
            </NavLink>
          )}
        </nav>

        <div className="nav-auth" id="auth-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" className="user-badge" id="user-profile-badge" title="View Profile">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.name || 'User'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                id="btn-logout"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" id="btn-nav-login">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="btn-nav-register">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
