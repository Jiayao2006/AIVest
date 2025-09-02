import React from 'react';

export default function KPIDashboard({ clients }) {
  const totalAUM = clients.reduce((sum, c) => sum + c.aum, 0);
  const avgAUM = clients.length > 0 ? totalAUM / clients.length : 0;
  
  const riskProfiles = clients.reduce((acc, c) => {
    acc[c.riskProfile] = (acc[c.riskProfile] || 0) + 1;
    return acc;
  }, {});

  const topDomiciles = Object.entries(
    clients.reduce((acc, c) => {
      acc[c.domicile] = (acc[c.domicile] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="row g-3 mb-4">
      <div className="col-lg-3 col-md-6">
        <div className="card border-minimal bg-light h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-1 text-muted">Total Clients</h6>
                <h3 className="mb-0 fw-semibold text-dark">{clients.length}</h3>
              </div>
              <div className="text-muted">
                <i className="bi bi-people-fill fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-3 col-md-6">
        <div className="card border-minimal bg-light h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-1 text-muted">Total AUM</h6>
                <h3 className="mb-0 fw-semibold text-dark">${totalAUM.toLocaleString()}M</h3>
              </div>
              <div className="text-muted">
                <i className="bi bi-graph-up-arrow fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-3 col-md-6">
        <div className="card border-minimal bg-light h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-1 text-muted">Avg AUM</h6>
                <h3 className="mb-0 fw-semibold text-dark">${Math.round(avgAUM).toLocaleString()}M</h3>
              </div>
              <div className="text-muted">
                <i className="bi bi-bar-chart-fill fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-3 col-md-6">
        <div className="card border-minimal bg-light h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-1 text-muted">Top Domicile</h6>
                <h3 className="mb-0 fw-semibold text-dark">{topDomiciles[0]?.[0] || 'N/A'}</h3>
                <small className="text-muted">{topDomiciles[0]?.[1] || 0} clients</small>
              </div>
              <div className="text-muted">
                <i className="bi bi-globe-americas fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
