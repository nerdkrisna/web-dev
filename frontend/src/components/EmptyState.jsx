import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No Projects Found',
  description = 'There are no projects matching your criteria or no projects created yet.',
  actionLink = '/projects/new',
  actionText = 'Create First Project',
  onActionClick
}) => {
  return (
    <div className="empty-state" id="empty-state-view">
      <FolderSearch className="empty-icon" />
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLink ? (
        <Link to={actionLink} className="btn btn-primary" id="btn-empty-action">
          <Plus size={18} />
          <span>{actionText}</span>
        </Link>
      ) : onActionClick ? (
        <button
          onClick={onActionClick}
          className="btn btn-primary"
          id="btn-empty-action"
        >
          <Plus size={18} />
          <span>{actionText}</span>
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
