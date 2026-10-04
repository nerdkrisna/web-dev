import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, Filter } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const fetchProjectList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;
      if (category !== 'All') params.category = category;
      if (sort) params.sort = sort;

      const res = await getProjects(params);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Error fetching projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjectList();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, status, priority, category, sort]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteProject(deleteTarget._id);
      showToast('Project deleted successfully', 'success');
      setDeleteTarget(null);
      fetchProjectList();
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    setSort('newest');
  };

  return (
    <div id="projects-page-container">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem' }}>All Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage and monitor all ongoing and planned team initiatives
          </p>
        </div>

        {isAuthenticated && (
          <Link
            to="/projects/new"
            className="btn btn-primary"
            id="btn-create-project-top"
          >
            <PlusCircle size={18} />
            <span>Create Project</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="toolbar" id="projects-toolbar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            id="search-projects-input"
            placeholder="Search projects by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Status filter */}
          <select
            className="select-custom"
            id="filter-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Priority filter */}
          <select
            className="select-custom"
            id="filter-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Category filter */}
          <select
            className="select-custom"
            id="filter-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="DevOps">DevOps</option>
            <option value="Marketing">Marketing</option>
            <option value="Data Science">Data Science</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort order */}
          <select
            className="select-custom"
            id="sort-projects-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget-desc">Budget: High to Low</option>
            <option value="budget-asc">Budget: Low to High</option>
            <option value="deadline-asc">Deadline: Soonest</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching projects from database..." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Matching Projects Found"
          description="Try adjusting your filters or search keyword, or create a brand new project."
          actionText="Reset Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="projects-grid" id="projects-catalog-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDeleteClick={(p) => setDeleteTarget(p)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ProjectsPage;
