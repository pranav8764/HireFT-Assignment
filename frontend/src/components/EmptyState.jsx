import React from 'react';

const EmptyState = ({ message, type = 'default' }) => {
  // Define styling based on the type of empty state
  const typeConfig = {
    matching: {
      color: '#27ae60',
      backgroundColor: '#d5f4e6',
      icon: '🔍'
    },
    missing: {
      color: '#e74c3c',
      backgroundColor: '#fdeaea',
      icon: '❌'
    },
    job: {
      color: '#3498db',
      backgroundColor: '#ebf3fd',
      icon: '💼'
    },
    resume: {
      color: '#95a5a6',
      backgroundColor: '#f8f9fa',
      icon: '📄'
    },
    default: {
      color: '#6c757d',
      backgroundColor: '#f8f9fa',
      icon: '📝'
    }
  };

  const config = typeConfig[type] || typeConfig.default;

  return (
    <div 
      className="empty-state"
      style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.color}20`,
        borderRadius: '8px',
        color: config.color,
        fontSize: '14px',
        fontStyle: 'italic'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
        {config.icon}
      </div>
      <div>{message}</div>
    </div>
  );
};

export default EmptyState;