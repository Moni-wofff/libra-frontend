import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading data...', size = 32 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        color: 'var(--color-primary-light)',
        gap: '12px',
      }}
    >
      <Loader2 className="spinner" size={size} />
      {message && (
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
