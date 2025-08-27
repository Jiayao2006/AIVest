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

const getAUMBadgeColor = (aum) => {
  if (aum >= 1000) return 'bg-gradient-primary';
  if (aum >= 500) return 'bg-gradient-info';
  return 'bg-gradient-secondary';
};

export default function ClientCard({ client }) {
  const navigate = useNavigate();
  const { id, name, aum, domicile, segments, description, keyContacts, riskProfile } = client;
  
  const handleClick = () => {
    navigate(`/clients/${id}`);
  };

  return (
    <div 
      className="card client-card h-100 border-0 shadow-sm cursor-pointer" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 text-dark fw-semibold">{name}</h5>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge ${getAUMBadgeColor(aum)} text-white px-3 py-2`}>
                ${aum.toLocaleString()}M AUM
              </span>
              <span className={`badge bg-${getRiskProfileColor(riskProfile)} bg-opacity-10 text-${getRiskProfileColor(riskProfile)} border border-${getRiskProfileColor(riskProfile)} border-opacity-25`}>
                {riskProfile}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-muted small mb-3 flex-grow-1">{description}</p>
        
        <div className="mb-3">
          {segments.map(s => (
            <span key={s} className="badge rounded-pill bg-light text-dark border me-1 mb-1 px-2 py-1">
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
