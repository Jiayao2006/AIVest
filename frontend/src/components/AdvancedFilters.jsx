import React, { useState } from 'react';

export default function AdvancedFilters({ filters, onFiltersChange, clients }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueSegments = [...new Set(clients.flatMap(c => c.segments))].sort();
  const uniqueDomiciles = [...new Set(clients.map(c => c.domicile))].sort();
  const riskProfiles = ['Conservative', 'Moderate', 'Aggressive'];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      minAUM: '',
      maxAUM: '',
      segments: [],
      domiciles: [],
      riskProfiles: [],
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== 'name' && v !== 'asc'
  ).length;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i className={`bi bi-funnel-fill me-2 text-primary`}></i>
              Advanced Filters
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
            </button>
            {activeFilterCount > 0 && (
              <span className="badge bg-primary ms-2">{activeFilterCount}</span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="card-body">
          <div className="row g-3">
            {/* AUM Range */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">AUM Range (Millions USD)</label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min AUM"
                    value={filters.minAUM || ''}
                    onChange={e => handleFilterChange('minAUM', e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max AUM"
                    value={filters.maxAUM || ''}
                    onChange={e => handleFilterChange('maxAUM', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Sort By</label>
              <div className="row g-2">
                <div className="col-8">
                  <select
                    className="form-select form-select-sm"
                    value={filters.sortBy || 'name'}
                    onChange={e => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="aum">AUM</option>
                    <option value="domicile">Domicile</option>
                    <option value="riskProfile">Risk Profile</option>
                  </select>
                </div>
                <div className="col-4">
                  <select
                    className="form-select form-select-sm"
                    value={filters.sortOrder || 'asc'}
                    onChange={e => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <option value="asc">↑ Asc</option>
                    <option value="desc">↓ Desc</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Segments */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Segments</label>
              <div className="max-height-150 overflow-auto border rounded p-2 bg-light">
                {uniqueSegments.map(segment => (
                  <div key={segment} className="form-check form-check-sm">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`segment-${segment}`}
                      checked={(filters.segments || []).includes(segment)}
                      onChange={() => handleMultiSelectChange('segments', segment)}
                    />
                    <label className="form-check-label small" htmlFor={`segment-${segment}`}>
                      {segment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Domiciles */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Domiciles</label>
              <div className="max-height-150 overflow-auto border rounded p-2 bg-light">
                {uniqueDomiciles.map(domicile => (
                  <div key={domicile} className="form-check form-check-sm">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`domicile-${domicile}`}
                      checked={(filters.domiciles || []).includes(domicile)}
                      onChange={() => handleMultiSelectChange('domiciles', domicile)}
                    />
                    <label className="form-check-label small" htmlFor={`domicile-${domicile}`}>
                      {domicile}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Profiles */}
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Risk Profiles</label>
              <div className="max-height-150 overflow-auto border rounded p-2 bg-light">
                {riskProfiles.map(risk => (
                  <div key={risk} className="form-check form-check-sm">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`risk-${risk}`}
                      checked={(filters.riskProfiles || []).includes(risk)}
                      onChange={() => handleMultiSelectChange('riskProfiles', risk)}
                    />
                    <label className="form-check-label small" htmlFor={`risk-${risk}`}>
                      {risk}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
