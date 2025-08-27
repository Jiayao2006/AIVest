import React from 'react';

export default function SavedSearches({ searches, onLoadSearch, onSaveSearch, onDeleteSearch, currentQuery, currentFilters }) {
  const handleSaveCurrentSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      onSaveSearch(name, currentQuery, currentFilters);
    }
  };

  const hasActiveSearch = currentQuery || Object.values(currentFilters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== 'name' && v !== 'asc'
  );

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-title mb-0">
            <i className="bi bi-bookmark-star me-2 text-primary"></i>
            Saved Searches
          </h6>
          {hasActiveSearch && (
            <button 
              className="btn btn-sm btn-primary"
              onClick={handleSaveCurrentSearch}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Save Current
            </button>
          )}
        </div>

        {searches.length === 0 ? (
          <p className="text-muted small mb-0">No saved searches yet. Apply filters and save your search.</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {searches.map((search, index) => (
              <div key={index} className="d-flex align-items-center bg-light rounded px-2 py-1">
                <button
                  className="btn btn-sm btn-link p-0 text-decoration-none me-2"
                  onClick={() => onLoadSearch(search)}
                  title={`Query: "${search.query}" | Filters: ${Object.keys(search.filters).length}`}
                >
                  <i className="bi bi-search me-1"></i>
                  {search.name}
                </button>
                <button
                  className="btn btn-sm p-0 text-danger"
                  onClick={() => onDeleteSearch(index)}
                  title="Delete saved search"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
