import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Lock, Mail, Key } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      showToast('Logged in successfully! Welcome.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@projecthub.io');
    setPassword('Password123!');
  };

  return (
    <div
      style={{
        maxWidth: '440px',
        margin: '2.5rem auto',
        padding: '0 1rem'
      }}
      id="login-page-container"
    >
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 113, 227, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#0071E3'
            }}
          >
            <Lock size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', color: 'var(--text-heading)' }}>
            Account Login
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your credentials to access protected routes
          </p>
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="login-email"
                className="form-control"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={loading}
            id="btn-login-submit"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Quick Demo Fill */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: '0.85rem', gap: '0.4rem' }}
            id="btn-demo-credentials"
          >
            <Key size={14} />
            <span>Use Demo Account (Admin)</span>
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
          Don't have an account yet?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
            id="link-go-to-register"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
