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
    <div>
      <div className="d-flex align-items-center mb-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className={`bi bi-funnel-fill me-1`}></i>
          Filters
          {activeFilterCount > 0 && (
            <span className="badge bg-primary ms-1">{activeFilterCount}</span>
          )}
          <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-1`}></i>
        </button>
        {activeFilterCount > 0 && (
          <button 
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={clearAllFilters}
          >
            Clear
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-panel p-3 border rounded bg-light mt-2">
          <div className="row g-2">
            {/* AUM Range */}
            <div className="col-md-4 col-lg-3">
              <label className="form-label small fw-semibold text-muted">AUM Range (Millions USD)</label>
              <div className="input-group input-group-sm">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={filters.minAUM || ''}
                  onChange={e => handleFilterChange('minAUM', e.target.value)}
                />
                <span className="input-group-text">-</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={filters.maxAUM || ''}
                  onChange={e => handleFilterChange('maxAUM', e.target.value)}
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="col-md-4 col-lg-3">
              <label className="form-label small fw-semibold text-muted">Sort By</label>
              <div className="input-group input-group-sm">
                <select
                  className="form-select"
                  value={filters.sortBy || 'name'}
                  onChange={e => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="aum">AUM</option>
                  <option value="domicile">Domicile</option>
                  <option value="lastContact">Last Contact</option>
                </select>
                <select
                  className="form-select"
                  value={filters.sortOrder || 'asc'}
                  onChange={e => handleFilterChange('sortOrder', e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            {/* Client Segments */}
            <div className="col-md-4 col-lg-2">
              <label className="form-label small fw-semibold text-muted">Client Segments</label>
              <div className="d-flex flex-wrap gap-1">
                {uniqueSegments.map(segment => (
                  <div 
                    key={segment} 
                    className={`badge ${(filters.segments || []).includes(segment) 
                      ? 'bg-primary' 
                      : 'bg-light text-dark border'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMultiSelectChange('segments', segment)}
                  >
                    {segment}
                  </div>
                ))}
              </div>
            </div>

            {/* Domiciles */}
            <div className="col-md-4 col-lg-2">
              <label className="form-label small fw-semibold text-muted">Domiciles</label>
              <div className="d-flex flex-wrap gap-1">
                {uniqueDomiciles.map(domicile => (
                  <div
                    key={domicile}
                    className={`badge ${(filters.domiciles || []).includes(domicile) 
                      ? 'bg-primary' 
                      : 'bg-light text-dark border'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMultiSelectChange('domiciles', domicile)}
                  >
                    {domicile}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Profiles */}
            <div className="col-md-4 col-lg-2">
              <label className="form-label small fw-semibold text-muted">Risk Profiles</label>
              <div className="d-flex flex-wrap gap-1">
                {riskProfiles.map(risk => (
                  <div
                    key={risk}
                    className={`badge ${(filters.riskProfiles || []).includes(risk) 
                      ? 'bg-primary' 
                      : 'bg-light text-dark border'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMultiSelectChange('riskProfiles', risk)}
                  >
                    {risk}
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
