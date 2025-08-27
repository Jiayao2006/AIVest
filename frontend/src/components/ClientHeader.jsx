import React from 'react';

const getRiskProfileColor = (risk) => {
  switch(risk) {
    case 'Conservative': return 'success';
    case 'Moderate': return 'warning';
    case 'Aggressive': return 'danger';
    default: return 'secondary';
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
              <div className="bg-primary rounded-circle p-3 me-3">
                <i className="bi bi-person-fill text-white fs-4"></i>
              </div>
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">{name}</h1>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1">
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
              <span className="badge bg-gradient-primary text-white px-3 py-2">
                ${aum.toLocaleString()}M AUM
              </span>
              <span className={`badge bg-${getRiskProfileColor(riskProfile)} bg-opacity-10 text-${getRiskProfileColor(riskProfile)} border border-${getRiskProfileColor(riskProfile)} border-opacity-25 px-3 py-2`}>
                {riskProfile} Risk
              </span>
            </div>
          </div>
        </div>
        
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Domicile</small>
                <span className="fw-semibold">{domicile}</span>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-people-fill text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Key Contacts</small>
                <span className="fw-semibold">{keyContacts?.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-tags-fill text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Segments</small>
                <div className="d-flex flex-wrap gap-1">
                  {segments.map(segment => (
                    <span key={segment} className="badge bg-light text-dark border small">
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
