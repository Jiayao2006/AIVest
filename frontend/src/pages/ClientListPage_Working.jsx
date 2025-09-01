import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation.jsx';
import ClientList from '../components/ClientList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import KPIDashboard from '../components/KPIDashboard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';
import SavedSearches from '../components/SavedSearches.jsx';
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
    console.log('🚀 ClientListPage mounting - initializing with sample data first');
    
    // ALWAYS start with sample data to ensure something shows
    const enhancedSampleData = sampleClients.map(client => ({
      ...client,
      portfolioValue: client.aum * 1000000
    }));
    
    setClients(enhancedSampleData);
    setDataLoaded(true);
    setApiConnected(false);
    console.log('✅ Sample data loaded immediately:', enhancedSampleData.length, 'clients');
    
    // Now try to enhance with API data
    const controller = new AbortController();
    
    async function tryApiLoad() {
      console.log('\n🔄 === ATTEMPTING API ENHANCEMENT ===');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      console.log('📍 API Base:', apiUrl);
      console.log('🌐 Current hostname:', window.location.hostname);
      console.log('⏰ Timestamp:', new Date().toISOString());
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${apiUrl}/api/clients`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API data received:', data.length, 'clients');
          
          if (Array.isArray(data) && data.length > 0) {
            const clientsWithPortfolioValue = data.map(client => ({
              ...client,
              portfolioValue: client.aum * 1000000
            }));
            
            setClients(clientsWithPortfolioValue);
            setApiConnected(true);
            setError(null);
            console.log('🎉 Successfully switched to API data - clearing error state');
          } else {
            console.warn('⚠️ API returned empty or invalid data, keeping sample data');
            setApiConnected(false);
            setError('API returned empty data. Using local sample data.');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        console.warn('🔧 API enhancement failed, keeping sample data:', error.message);
        setError(`API connection failed: ${error.message}. Using local sample data.`);
        setApiConnected(false);
        // Keep sample data that was already loaded
      } finally {
        setLoading(false);
      }
    }
    
    // Try API after a short delay to let sample data render first
    setTimeout(tryApiLoad, 100);
    
    return () => {
      console.log('🧹 Cleanup: Aborting API requests');
      controller.abort();
    };
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

  const handleClientAdded = async (newClient) => {
    console.log('🎉 New client added, updating list:', newClient);
    
    try {
      // Try to refresh from API
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const refreshedClients = await response.json();
        const clientsWithPortfolioValue = refreshedClients.map(client => ({
          ...client,
          portfolioValue: client.aum * 1000000
        }));
        setClients(clientsWithPortfolioValue);
        console.log('✅ Client list refreshed from server');
      } else {
        // Fallback: add to local state
        const clientWithPortfolioValue = {
          ...newClient,
          portfolioValue: newClient.aum * 1000000
        };
        setClients(prev => [...prev, clientWithPortfolioValue]);
        console.log('⚠️ Server refresh failed, added to local state');
      }
    } catch (error) {
      console.error('❌ Failed to refresh client list:', error);
      // Fallback: add to local state
      const clientWithPortfolioValue = {
        ...newClient,
        portfolioValue: newClient.aum * 1000000
      };
      setClients(prev => [...prev, clientWithPortfolioValue]);
    }
  };

  const handleClientDelete = async (clientId) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Remove from local state
        setClients(prev => prev.filter(client => client.id !== clientId));
        console.log('✅ Client deleted successfully');
      } else {
        console.error('❌ Failed to delete client from server');
        alert('Failed to delete client. Please try again.');
      }
    } catch (error) {
      console.error('❌ Delete request failed:', error);
      alert('Failed to delete client. Please try again.');
    }
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

            <div className="row g-4">
              <div className="col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Search & Filters</h6>
                    <SearchBar 
                      query={query} 
                      onQueryChange={setQuery}
                      placeholder="Search clients..."
                    />
                    <hr />
                    <AdvancedFilters 
                      filters={filters}
                      onFiltersChange={setFilters}
                      clients={clients}
                    />
                    <hr />
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
              
              <div className="col-lg-9">
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
