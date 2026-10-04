import React from 'react';
import { FolderKanban, Clock, CheckCircle2, DollarSign } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const total = stats?.totalProjects ?? 0;
  const inProgress = stats?.byStatus?.['In Progress'] ?? 0;
  const completed = stats?.byStatus?.['Completed'] ?? 0;
  const totalBudget = stats?.totalBudget ?? 0;

  return (
    <div className="stats-grid" id="stats-overview-grid">
      <div className="stat-card" id="stat-total-projects">
        <div className="stat-icon-wrapper stat-icon-indigo">
          <FolderKanban size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Projects</span>
        </div>
      </div>

      <div className="stat-card" id="stat-in-progress">
        <div className="stat-icon-wrapper stat-icon-cyan">
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
      </div>

      <div className="stat-card" id="stat-completed">
        <div className="stat-icon-wrapper stat-icon-emerald">
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="stat-card" id="stat-total-budget">
        <div className="stat-icon-wrapper stat-icon-amber">
          <DollarSign size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{formatCurrency(totalBudget)}</span>
          <span className="stat-label">Total Budget</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
