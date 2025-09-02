import React from 'react';

export default function SearchBar({ value, onChange, resultsCount, totalCount }) {
  return (
    <div className="card shadow-minimal border-minimal" style={{ marginBottom: '0' }}>
      <div className="card-body bg-white py-3">
        <div className="row g-3 align-items-center">
          <div className="col-lg-9 col-md-8">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control form-control-lg ps-5 border-minimal bg-minimal"
                placeholder="Search clients by name, segment, or keyword..."
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ borderRadius: '6px', fontSize: '1rem' }}
              />
              {value && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={() => onChange('')}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-x-circle-fill text-muted"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-lg-3 col-md-4 text-md-end">
            <div className="d-flex align-items-center justify-content-md-end gap-2 flex-wrap">
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                <i className="bi bi-person-check me-1"></i>
                {resultsCount} of {totalCount} clients
              </span>
              {resultsCount !== totalCount && (
                <span className="badge bg-warning-subtle text-dark px-2 py-1 rounded-pill small">
                  Filtered
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
