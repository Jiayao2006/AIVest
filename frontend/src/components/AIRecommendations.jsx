import React, { useState } from 'react';

const getRecommendationIcon = (type) => {
  const icons = {
    'rebalance': 'bi-arrow-repeat',
    'diversify': 'bi-pie-chart',
    'hedge': 'bi-shield-check',
    'opportunity': 'bi-lightbulb',
    'tax': 'bi-calculator',
    'risk': 'bi-exclamation-triangle'
  };
  return icons[type] || 'bi-star';
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return 'danger';
    case 'Medium': return 'warning';
    case 'Low': return 'info';
    default: return 'secondary';
  }
};

export default function AIRecommendations({ recommendations, onAction, onViewDetail, clientId }) {
  const [actioningId, setActioningId] = useState(null);

  const handleQuickAction = async (recId, action) => {
    setActioningId(recId);
    await onAction(recId, action);
    setActioningId(null);
  };

  const pendingRecommendations = recommendations.filter(rec => rec.status === 'pending');
  const completedRecommendations = recommendations.filter(rec => rec.status !== 'pending');

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="card-title mb-0">
          <i className="bi bi-robot text-primary me-2"></i>
          AI Recommendations
          {pendingRecommendations.length > 0 && (
            <span className="badge bg-danger ms-2">{pendingRecommendations.length}</span>
          )}
        </h5>
      </div>
      
      <div className="card-body">
        {recommendations.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-lightbulb text-muted display-4"></i>
            <p className="text-muted mt-2 mb-0">No recommendations available</p>
            <small className="text-muted">AI analysis will generate suggestions based on market conditions and client profile.</small>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Recommendations */}
            {pendingRecommendations.length > 0 && (
              <>
                <h6 className="text-muted small fw-semibold mb-3">PENDING REVIEW</h6>
                {pendingRecommendations.map(rec => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onAction={handleQuickAction}
                    onViewDetail={onViewDetail}
                    isActioning={actioningId === rec.id}
                  />
                ))}
              </>
            )}

            {/* Completed Recommendations */}
            {completedRecommendations.length > 0 && (
              <>
                {pendingRecommendations.length > 0 && <hr className="my-4" />}
                <h6 className="text-muted small fw-semibold mb-3">RECENT ACTIONS</h6>
                {completedRecommendations.slice(0, 3).map(rec => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onAction={handleQuickAction}
                    onViewDetail={onViewDetail}
                    isCompleted={true}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation, onAction, onViewDetail, isActioning, isCompleted }) {
  const { id, type, title, summary, priority, confidence, estimatedImpact, status } = recommendation;

  return (
    <div className={`border rounded p-3 mb-3 ${isCompleted ? 'bg-light' : 'bg-white'} position-relative`}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <i className={`${getRecommendationIcon(type)} text-primary me-2`}></i>
          <div>
            <h6 className="mb-1 fw-semibold">{title}</h6>
            <small className="text-muted">{summary}</small>
          </div>
        </div>
        <span className={`badge bg-${getPriorityColor(priority)} bg-opacity-10 text-${getPriorityColor(priority)} border border-${getPriorityColor(priority)} border-opacity-25`}>
          {priority}
        </span>
      </div>

      <div className="row g-2 mb-3 small">
        <div className="col-6">
          <span className="text-muted">Confidence:</span>
          <span className="fw-semibold ms-1">{confidence}%</span>
        </div>
        <div className="col-6">
          <span className="text-muted">Impact:</span>
          <span className="fw-semibold ms-1">{estimatedImpact}</span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary flex-fill"
            onClick={() => onViewDetail(id)}
            disabled={isActioning}
          >
            <i className="bi bi-eye me-1"></i>
            View Details
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => onAction(id, 'approved')}
            disabled={isActioning}
          >
            {isActioning ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-check-lg"></i>
            )}
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onAction(id, 'rejected')}
            disabled={isActioning}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <span className={`badge ${status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
            {status === 'approved' ? 'Approved' : 'Rejected'}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onViewDetail(id)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
        </div>
      )}
    </div>
  );
}
