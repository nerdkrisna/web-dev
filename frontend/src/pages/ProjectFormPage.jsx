import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, createProject, updateProject } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Save, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'DevOps',
  'Marketing',
  'Data Science',
  'Other'
];

const STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const ProjectFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    status: 'Planning',
    priority: 'Medium',
    budget: 0,
    deadline: '',
    assignedTo: ''
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const loadProject = async () => {
        try {
          const res = await getProjectById(id);
          if (res.success && res.data) {
            const p = res.data;
            setFormData({
              title: p.title || '',
              description: p.description || '',
              category: p.category || 'Web Development',
              status: p.status || 'Planning',
              priority: p.priority || 'Medium',
              budget: p.budget || 0,
              deadline: p.deadline ? p.deadline.split('T')[0] : '',
              assignedTo: p.assignedTo || ''
            });
          }
        } catch (err) {
          showToast(err.message || 'Failed to load project details', 'error');
          navigate('/projects');
        } finally {
          setInitialLoading(false);
        }
      };
      loadProject();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Project title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.deadline) errs.deadline = 'Project deadline date is required';
    if (formData.budget < 0) errs.budget = 'Budget cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix validation errors in the form', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateProject(id, formData);
        showToast('Project updated successfully', 'success');
        navigate(`/projects/${id}`);
      } else {
        const res = await createProject(formData);
        showToast('Project created successfully', 'success');
        navigate(`/projects/${res.data._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to save project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner text="Loading project details for editing..." />;
  }

  return (
    <div id="project-form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link
        to={isEditMode ? `/projects/${id}` : '/projects'}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
        id="link-form-back"
      >
        <ArrowLeft size={16} />
        <span>Cancel & Go Back</span>
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isEditMode
            ? 'Update the project specification, timeline, and budget allocations.'
            : 'Fill in the details below to initialize a new initiative in the system.'}
        </p>

        <form onSubmit={handleSubmit} id="project-form">
          {/* Project Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="e.g. NextGen Microservices Migration"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description & Objectives *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Describe the scope, deliverables, and architecture..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <span style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Category & Status */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Budget */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="budget">
                Budget (USD $)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                className="form-control"
                placeholder="0"
                min="0"
                step="500"
                value={formData.budget}
                onChange={handleChange}
              />
              {errors.budget && (
                <span style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.budget}
                </span>
              )}
            </div>
          </div>

          {/* Deadline & Assigned To */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Target Deadline *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && (
                <span style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.deadline}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="assignedTo">
                Assigned Team / Lead
              </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                className="form-control"
                placeholder="e.g. Backend Squad Alpha"
                value={formData.assignedTo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem'
            }}
          >
            <Link
              to={isEditMode ? `/projects/${id}` : '/projects'}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="btn-submit-project"
            >
              {submitting ? (
                'Saving...'
              ) : isEditMode ? (
                <>
                  <Save size={16} />
                  <span>Update Project</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormPage;
