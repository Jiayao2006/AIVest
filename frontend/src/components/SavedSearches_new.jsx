import React from 'react';

export default function SavedSearches({ savedSearches, onLoad, onSave, onDelete, currentQuery, currentFilters }) {
  const handleSaveCurrentSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      onSave(name, currentQuery, currentFilters);
    }
  };

  const hasActiveSearch = currentQuery || Object.values(currentFilters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== 'name' && v !== 'asc'
  );

  return (
    <div>
      <div className="d-flex align-items-center mb-2">
        <button 
          className="btn btn-sm btn-outline-info"
          onClick={handleSaveCurrentSearch}
          disabled={!hasActiveSearch}
        >
          <i className="bi bi-bookmark-star me-1"></i>
          Save Search
        </button>
      </div>
      
      {savedSearches.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mt-2">
          {savedSearches.map((search, index) => (
            <div key={index} className="badge bg-light text-dark border d-flex align-items-center">
              <button
                className="btn btn-sm btn-link p-0 text-decoration-none"
                onClick={() => onLoad(search)}
                title={`Query: "${search.query}" | Filters: ${Object.keys(search.filters).length}`}
              >
                <i className="bi bi-search me-1"></i>
                {search.name}
              </button>
              <button
                className="btn btn-sm p-0 text-danger ms-1"
                onClick={() => onDelete(index)}
                title="Delete saved search"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
