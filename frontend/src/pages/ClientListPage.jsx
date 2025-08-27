import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import KPIDashboard from '../components/KPIDashboard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';
import SavedSearches from '../components/SavedSearches.jsx';
import { sampleClients } from '../data/clients.js';
import { useClientFiltering } from '../hooks/useClientFiltering.js';

export default function ClientListPage() {
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState(sampleClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minAUM: '',
    maxAUM: '',
    segments: [],
    domiciles: [],
    riskProfiles: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = localStorage.getItem('aivest-saved-searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/clients', { signal: controller.signal });
        if (!res.ok) throw new Error('API ' + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length) setClients(data);
      } catch (e) {
        if (e.name !== 'AbortError') setError('Using local sample data (API unavailable).');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  // Save searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aivest-saved-searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  const filteredClients = useClientFiltering(clients, query, filters);

  const handleSaveSearch = (name, searchQuery, searchFilters) => {
    const newSearch = {
      name,
      query: searchQuery,
      filters: { ...searchFilters },
      savedAt: new Date().toISOString()
    };
    setSavedSearches(prev => [...prev, newSearch]);
  };

  const handleLoadSearch = (search) => {
    setQuery(search.query);
    setFilters(search.filters);
  };

  const handleDeleteSearch = (index) => {
    setSavedSearches(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <header className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <div className="bg-primary rounded-circle p-2 me-3">
            <i className="bi bi-briefcase-fill text-white fs-5"></i>
          </div>
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Client Portfolio</h1>
            <p className="text-muted small mb-0">Relationship Manager Dashboard – High Net Worth Clients</p>
          </div>
        </div>
      </header>
      
      <KPIDashboard clients={filteredClients} />
      
      <SavedSearches
        searches={savedSearches}
        onLoadSearch={handleLoadSearch}
        onSaveSearch={handleSaveSearch}
        onDeleteSearch={handleDeleteSearch}
        currentQuery={query}
        currentFilters={filters}
      />
      
      <SearchBar 
        value={query} 
        onChange={setQuery} 
        resultsCount={filteredClients.length}
        totalCount={clients.length}
      />
      
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        clients={clients}
      />
      
      {loading && <div className="alert alert-info py-2 small">Loading clients...</div>}
      {error && <div className="alert alert-secondary py-2 small mb-2">{error}</div>}
      <ClientList clients={filteredClients} />
    </div>
  );
}
