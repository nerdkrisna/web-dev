import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  FolderKanban,
  Tag
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id);
      if (res.success) {
        setProject(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Error fetching project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleQuickStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await updateProject(id, { status: newStatus });
      if (res.success) {
        setProject(res.data);
        showToast(`Status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProject(id);
      showToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading project details..." />;
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 style={{ color: 'var(--text-heading)' }}>Project Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          The project you are looking for does not exist or may have been deleted.
        </p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div id="project-details-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Back button */}
      <Link
        to="/projects"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
        id="link-back-to-projects"
      >
        <ArrowLeft size={16} />
        <span>Back to Projects</span>
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header with Title and Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.5rem',
            marginBottom: '1.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="category-tag">{project.category}</span>
              <span className="badge badge-progress">{project.status}</span>
              <span className="prio-pill prio-medium">{project.priority} Priority</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', lineHeight: '1.2', color: 'var(--text-heading)' }}>
              {project.title}
            </h1>
          </div>

          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                to={`/projects/edit/${project._id}`}
                className="btn btn-secondary"
                id="btn-edit-details"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger"
                id="btn-delete-details"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Project Overview & Scope
          </h3>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: '1.7',
              color: 'var(--text-main)',
              whiteSpace: 'pre-line'
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Key Metrics Grid (Apple Glass Container) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <DollarSign size={16} color="#059669" />
              Budget Allocated
            </span>
            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-heading)', marginTop: '0.25rem' }}>
              {formatCurrency(project.budget)}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <Calendar size={16} color="#0284C7" />
              Target Deadline
            </span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-heading)', marginTop: '0.25rem' }}>
              {formatDate(project.deadline)}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <User size={16} color="#7C3AED" />
              Assigned Team / Lead
            </span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-heading)', marginTop: '0.25rem' }}>
              {project.assignedTo || 'Unassigned'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
              <Clock size={16} color="#D97706" />
              Created On
            </span>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-heading)', marginTop: '0.25rem' }}>
              {formatDate(project.createdAt)}
            </p>
          </div>
        </div>

        {/* Quick Status Updater */}
        {isAuthenticated && (
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-heading)' }}>Update Status</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Quickly progress this project through delivery stages
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Planning', 'In Progress', 'Completed', 'On Hold'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleQuickStatusChange(st)}
                  disabled={updating || project.status === st}
                  className={`btn btn-sm ${
                    project.status === st ? 'btn-primary' : 'btn-secondary'
                  }`}
                  id={`btn-set-status-${st.toLowerCase().replace(' ', '-')}`}
                >
                  {project.status === st && <CheckCircle size={14} />}
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${project.title}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ProjectDetailsPage;
