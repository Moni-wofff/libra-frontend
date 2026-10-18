import React from 'react';

const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'var(--color-accent-light)',
  iconColor = 'var(--color-accent)',
}) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value !== undefined && value !== null ? value : 0}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      {Icon && (
        <div className="stat-icon-wrapper" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={26} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
