import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation.jsx';
import ClientList from '../components/ClientList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import KPIDashboard from '../components/KPIDashboard.jsx';
import AdvancedFilters from '../components/AdvancedFilters_new.jsx';
import SavedSearches from '../components/SavedSearches_new.jsx';
import AddClientModal from '../components/AddClientModal.jsx';
import ScheduleCallModal from '../components/ScheduleCallModal.jsx';
import SendMessageModal from '../components/SendMessageModal.jsx';
import { sampleClients } from '../data/clients.js';
import { useClientFiltering } from '../hooks/useClientFiltering.js';

export default function ClientListPage() {
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
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
    console.log('🚀 ClientListPage mounting - loading sample data only');
    
    // Use sample data only (no API calls)
    const enhancedSampleData = sampleClients.map(client => ({
      ...client,
      portfolioValue: client.aum * 1000000
    }));
    
    setClients(enhancedSampleData);
    setDataLoaded(true);
    setApiConnected(false);
    console.log('✅ Sample data loaded:', enhancedSampleData.length, 'clients');
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

  const handleAddClient = () => {
    setShowAddModal(true);
  };

  const handleScheduleCall = (client) => {
    setSelectedClient(client);
    setShowScheduleModal(true);
  };

  const handleSendMessage = (client) => {
    setSelectedClient(client);
    setShowMessageModal(true);
  };

  const handleClientAdded = (newClient) => {
    console.log('🎉 New client added, updating list:', newClient);
    
    // Simply add to local state without API call
    const clientWithPortfolioValue = {
      ...newClient,
      id: Date.now().toString(), // Generate a unique ID
      portfolioValue: newClient.aum * 1000000
    };
    
    setClients(prev => [...prev, clientWithPortfolioValue]);
    console.log('✅ Client added to local state');
  };

  const handleClientDelete = (clientId) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    // Simply remove from local state without API call
    setClients(prev => prev.filter(client => client.id !== clientId));
    console.log('✅ Client deleted from local state');
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navigation />
      
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">Client Portfolio</h1>
                <p className="text-muted small mb-0">
                  {dataLoaded ? (
                    <>
                      Total: {clients.length} clients
                      {apiConnected && <span className="badge bg-success ms-2">Live Data</span>}
                      {!apiConnected && <span className="badge bg-warning text-dark ms-2">Sample Data</span>}
                    </>
                  ) : (
                    'Loading...'
                  )}
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAddClient}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Client
              </button>
            </div>

            {error && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            <KPIDashboard clients={filteredClients} />

            <div className="card mb-4">
              <div className="card-body">
                <h6 className="card-title mb-3">Search & Filters</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <SearchBar 
                      value={query} 
                      onChange={setQuery}
                      resultsCount={filteredClients.length}
                      totalCount={clients.length}
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-3 align-items-center">
                      <AdvancedFilters 
                        filters={filters}
                        onFiltersChange={setFilters}
                        clients={clients}
                      />
                      <SavedSearches
                        savedSearches={savedSearches}
                        onSave={handleSaveSearch}
                        onLoad={handleLoadSearch}
                        onDelete={handleDeleteSearch}
                        currentQuery={query}
                        currentFilters={filters}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">
                    Client List 
                    {filteredClients.length !== clients.length && (
                      <span className="text-muted ms-2">
                        ({filteredClients.length} of {clients.length})
                      </span>
                    )}
                  </h6>
                  {loading && (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>
                
                <ClientList 
                  clients={filteredClients}
                  onScheduleCall={handleScheduleCall}
                  onSendMessage={handleSendMessage}
                  onDeleteClient={handleClientDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddClientModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onClientAdded={handleClientAdded}
      />

      <ScheduleCallModal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        client={selectedClient}
      />

      <SendMessageModal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        client={selectedClient}
      />
    </div>
  );
}
