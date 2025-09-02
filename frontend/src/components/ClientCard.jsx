import React from 'react';
import { useNavigate } from 'react-router-dom';

const getRiskProfileColor = (risk) => {
  switch(risk) {
    case 'Conservative': return 'success';
    case 'Moderate': return 'warning';
    case 'Aggressive': return 'danger';
    default: return 'secondary';
  }
};

const getAUMBadgeStyle = (aum) => {
  if (aum >= 1000) return 'bg-dark text-white';
  if (aum >= 500) return 'bg-secondary text-white';
  return 'bg-light text-dark border';
};

const getRiskProfileBadgeStyle = (risk) => {
  switch(risk) {
    case 'Conservative': return 'bg-success-subtle text-success border border-success border-opacity-50';
    case 'Moderate': return 'bg-warning-subtle text-warning border border-warning border-opacity-50';
    case 'Aggressive': return 'bg-danger-subtle text-danger border border-danger border-opacity-50';
    default: return 'bg-light text-dark border';
  }
};

export default function ClientCard({ client, onDelete, onScheduleCall, onSendMessage }) {
  const navigate = useNavigate();
  const { id, name, aum, domicile, segments, description, keyContacts, riskProfile } = client;
  
  const handleCardClick = (e) => {
    // Only navigate if clicking on the card itself, not the buttons
    if (e.target.closest('.action-button')) {
      return;
    }
    navigate(`/clients/${id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  const handleScheduleCall = (e) => {
    e.stopPropagation();
    onScheduleCall(client);
  };

  const handleSendMessage = (e) => {
    e.stopPropagation();
    onSendMessage(client);
  };

  return (
    <div 
      className="card client-card h-100 border-0 shadow-sm cursor-pointer" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 text-dark fw-semibold">{name}</h5>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge ${getAUMBadgeStyle(aum)} px-3 py-2 fw-medium`}>
                ${aum.toLocaleString()}M AUM
              </span>
              <span className={`badge ${getRiskProfileBadgeStyle(riskProfile)} fw-medium`}>
                {riskProfile}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="dropdown">
            <button 
              className="btn btn-link text-muted p-1 action-button" 
              data-bs-toggle="dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item action-button" onClick={handleScheduleCall}>
                  <i className="bi bi-telephone me-2 text-primary"></i>
                  Schedule Call
                </button>
              </li>
              <li>
                <button className="dropdown-item action-button" onClick={handleSendMessage}>
                  <i className="bi bi-chat-dots me-2 text-info"></i>
                  Send Message
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger action-button" onClick={handleDelete}>
                  <i className="bi bi-trash me-2"></i>
                  Delete Client
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <p className="text-muted small mb-3 flex-grow-1">{description}</p>
        
        <div className="mb-3">
          {segments.map(s => (
            <span key={s} className="badge rounded-pill bg-light text-dark border me-1 mb-1 px-2 py-1 fw-medium">
              {s}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="row text-center border-top pt-3">
            <div className="col-6">
              <div className="small text-muted mb-1">Domicile</div>
              <div className="fw-semibold text-primary">{domicile}</div>
            </div>
            <div className="col-6">
              <div className="small text-muted mb-1">Contacts</div>
              <div className="fw-semibold text-secondary">{keyContacts?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
