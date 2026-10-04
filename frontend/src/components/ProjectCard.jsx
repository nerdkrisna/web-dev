import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onDeleteClick }) => {
  const { isAuthenticated } = useAuth();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Planning':
        return 'badge-planning';
      case 'In Progress':
        return 'badge-progress';
      case 'Completed':
        return 'badge-completed';
      case 'On Hold':
        return 'badge-hold';
      default:
        return 'badge-progress';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'prio-low';
      case 'Medium':
        return 'prio-medium';
      case 'High':
        return 'prio-high';
      case 'Urgent':
        return 'prio-urgent';
      default:
        return 'prio-medium';
    }
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatBudget = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div
      className="card project-card"
      id={`project-card-${project._id}`}
      data-testid="project-card"
    >
      <div>
        <div className="project-card-header">
          <span className="category-tag">{project.category || 'General'}</span>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className={`prio-pill ${getPriorityClass(project.priority)}`}>
              {project.priority}
            </span>
            <span
              className={`badge ${getStatusBadgeClass(project.status)}`}
              id={`status-badge-${project._id}`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <Link to={`/projects/${project._id}`}>
          <h3 className="project-card-title">{project.title}</h3>
        </Link>
        <p className="project-card-desc">{project.description}</p>
      </div>

      <div className="project-card-meta">
        <div className="meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} color="#059669" />
            Budget
          </span>
          <span className="meta-value">{formatBudget(project.budget)}</span>
        </div>

        <div className="meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} color="#0284C7" />
            Deadline
          </span>
          <span className="meta-value">{formatDeadline(project.deadline)}</span>
        </div>

        <div className="meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={15} color="#7C3AED" />
            Assigned
          </span>
          <span className="meta-value">{project.assignedTo || 'Unassigned'}</span>
        </div>

        <div className="project-card-actions">
          <Link
            to={`/projects/${project._id}`}
            className="btn btn-secondary btn-sm"
            id={`btn-view-${project._id}`}
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={`/projects/edit/${project._id}`}
                className="btn btn-secondary btn-sm btn-icon"
                id={`btn-edit-${project._id}`}
                title="Edit Project"
              >
                <Edit2 size={15} />
              </Link>
              <button
                onClick={() => onDeleteClick(project)}
                className="btn btn-danger btn-sm btn-icon"
                id={`btn-delete-${project._id}`}
                title="Delete Project"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
