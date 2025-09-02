import React from 'react';

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

export default function ClientHeader({ client }) {
  const { id, name, phone, aum, domicile, segments, riskProfile, keyContacts, description } = client;
  
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded-circle p-3 me-3 border">
                <i className="bi bi-person-fill text-dark fs-4"></i>
              </div>
              <div>
                <h1 className="h3 fw-semibold text-dark mb-1">{name}</h1>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span className="badge bg-light text-dark border px-2 py-1 fw-medium">
                    <i className="bi bi-hash me-1"></i>
                    ID: {id?.toUpperCase()}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-telephone-fill me-1"></i>
                    {phone}
                  </span>
                </div>
                <p className="text-muted mb-0">{description}</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 text-lg-end">
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
              <span className={`badge ${getAUMBadgeStyle(aum)} px-3 py-2 fw-medium`}>
                ${aum.toLocaleString()}M AUM
              </span>
              <span className={`badge ${getRiskProfileBadgeStyle(riskProfile)} px-3 py-2 fw-medium`}>
                {riskProfile} Risk
              </span>
            </div>
          </div>
        </div>
        
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-muted me-2"></i>
              <div>
                <small className="text-muted d-block">Domicile</small>
                <span className="fw-medium">{domicile}</span>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-people-fill text-muted me-2"></i>
              <div>
                <small className="text-muted d-block">Key Contacts</small>
                <span className="fw-medium">{keyContacts?.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-tags-fill text-muted me-2"></i>
              <div>
                <small className="text-muted d-block">Segments</small>
                <div className="d-flex flex-wrap gap-1">
                  {segments.map(segment => (
                    <span key={segment} className="badge bg-light text-dark border small fw-medium">
                      {segment}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
