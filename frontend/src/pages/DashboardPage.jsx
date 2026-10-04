import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectStats, getProjects, deleteProject } from '../services/api';
import StatsOverview from '../components/StatsOverview';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes] = await Promise.all([
        getProjectStats(),
        getProjects({ sort: 'newest' })
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (projectsRes.success) {
        setRecentProjects(projectsRes.data.slice(0, 6));
      }
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteProject(deleteTarget._id);
      showToast('Project deleted successfully', 'success');
      setDeleteTarget(null);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div id="dashboard-page-container">
      {/* Apple Frosted Glass Hero Banner */}
      <section
        className="card hero-card"
        style={{
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          padding: '2.5rem'
        }}
        id="dashboard-hero"
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(0, 113, 227, 0.08)',
              border: '1px solid rgba(0, 113, 227, 0.2)',
              borderRadius: '9999px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0071E3',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>Project Management Console</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.65rem', color: 'var(--text-heading)' }}>
            {isAuthenticated
              ? `Welcome back, ${user?.name || 'Manager'}!`
              : 'Enterprise Project Management System'}
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.05rem',
              maxWidth: '680px',
              marginBottom: '1.75rem',
              lineHeight: '1.6'
            }}
          >
            Track deliverable milestones, oversee project budgets, monitor sprint
            lifecycles, and collaborate seamlessly across cross-functional teams.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn btn-secondary" id="btn-hero-view-all">
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </Link>
            {isAuthenticated ? (
              <Link to="/projects/new" className="btn btn-primary" id="btn-hero-create">
                <PlusCircle size={18} />
                <span>Create New Project</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary" id="btn-hero-login">
                <span>Login to Manage Projects</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Metrics & Statistics */}
      {loading ? (
        <LoadingSpinner text="Computing project analytics..." />
      ) : (
        <>
          <StatsOverview stats={stats} />

          {/* Recent Projects Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              marginTop: '2.5rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-heading)' }}>
                Recent Active Projects
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Overview of ongoing sprints and strategic initiatives
              </p>
            </div>

            <Link
              to="/projects"
              className="btn btn-secondary btn-sm"
              id="link-see-all-projects"
            >
              <span>See All ({stats?.totalProjects || recentProjects.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <EmptyState
              title="No Projects in Database"
              description="Get started by creating your very first project to begin tracking milestones and budgets."
              actionLink={isAuthenticated ? '/projects/new' : '/login'}
              actionText={isAuthenticated ? 'Create Project' : 'Login to Create'}
            />
          ) : (
            <div className="projects-grid" id="recent-projects-grid">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDeleteClick={(p) => setDeleteTarget(p)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default DashboardPage;
