import React, { useState, useEffect, useMemo } from 'react';
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
  const API_BASE = useMemo(() => {
    if (typeof window === 'undefined') return 'http://localhost:5000';
    const host = window.location.hostname;
    const devHosts = new Set(['localhost', '127.0.0.1']);
    // If running on a known dev host, explicitly target backend port 5000
    if (devHosts.has(host)) {
      return import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';
    }
    // Production: assume same origin reverse proxy
    return '';
  }, []);

  useEffect(() => {
    console.log('🚀 ClientListPage mounting - initializing with sample data first');
    console.log('🌍 Current environment - hostname:', window.location.hostname);
    console.log('🌍 Computed API_BASE:', API_BASE);
    
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
      console.log('📍 API Base:', API_BASE);
      console.log('🌐 Current hostname:', window.location.hostname);
      console.log('⏰ Timestamp:', new Date().toISOString());
      
      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `${API_BASE}/api/clients`;
        console.log('📡 Fetching from:', apiUrl);
        console.log('🔧 Fetch options: method=GET, credentials=include, signal=AbortController');
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          signal: controller.signal,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        console.log('📊 Response type:', response.type);
        console.log('📊 Response url:', response.url);
        
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
            setError(null); // Clear any previous errors
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
  }, [API_BASE]);

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

  const handleClientAdded = (newClient) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    
    const timeout = setTimeout(() => {
      setError('Connection timeout - backend may be down');
      setLoading(false);
    }, 5000);
    
    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        signal: AbortSignal.timeout(5000)
      });
      clearTimeout(timeout);
      
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        setApiConnected(true);
        setError(null);
        alert('✅ Successfully connected to backend!');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      clearTimeout(timeout);
      console.error('Connection test failed:', err);
      setError(`❌ Backend connection failed: ${err.message}`);
      setApiConnected(false);
      // Keep using sample data
      if (clients.length === 0) {
        setClients(sampleClients);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      // Try to delete from API first if connected
      if (apiConnected) {
        try {
          const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
            method: 'DELETE',
            signal: AbortSignal.timeout(5000)
          });
          if (!response.ok) {
            throw new Error('API deletion failed');
          }
          console.log('Client deleted from backend');
        } catch (apiError) {
          console.warn('Backend deletion failed, removing locally:', apiError);
          setApiConnected(false);
        }
      }
      
      // Always remove from local state
      setClients(prev => prev.filter(client => client.id !== clientId));
      console.log(`Client ${clientId} removed from UI`);
      
    } catch (error) {
      console.error('Error deleting client:', error);
      // Still remove from local state even if API fails
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  const handleScheduleCall = (client) => {
    setSelectedClient(client);
    setShowScheduleModal(true);
  };

  const handleSendMessage = (client) => {
    setSelectedClient(client);
    setShowMessageModal(true);
  };

  const handleCallScheduled = (callData) => {
    console.log('Call scheduled:', callData);
    // Here you would typically save to backend or local storage
    alert(`Call scheduled with ${callData.clientName} for ${callData.date} at ${callData.time}`);
  };

  const handleMessageSent = (messageData) => {
    console.log('Message sent:', messageData);
    // Here you would typically save to backend or local storage
    alert(`Message ${messageData.status === 'scheduled' ? 'scheduled' : 'sent'} to ${messageData.clientName}`);
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container-xxl px-4 py-5">
        <Navigation />
        
        <header className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">Client Portfolio Dashboard</h1>
                <p className="text-muted small mb-0">
                  High Net Worth Client Management
                  <span className={`badge ms-2 ${apiConnected ? 'bg-success' : 'bg-warning'}`}>
                    {apiConnected ? 'API Connected' : 'Local Data'}
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary"
                onClick={handleTestConnection}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Test API
              </button>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-person-plus-fill me-2"></i>
                Add New Client
              </button>
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
      
      {loading && (
        <div className="alert alert-info py-2 small d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading clients from backend...
        </div>
      )}
      
      {error && (
        <div className="alert alert-warning py-3 small mb-2">
          <div className="d-flex align-items-start">
            <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
            <div className="flex-grow-1">
              <strong>Backend Connection Issue:</strong>
              <div className="mt-1">{error}</div>
              <div className="mt-2">
                <small className="text-muted">
                  • Using sample data for demonstration
                  <br />
                  • Check if backend server is running on port 5000
                  <br />
                  • Check browser console for detailed logs
                </small>
              </div>
              <button 
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}
      <ClientList 
        clients={filteredClients}
        loading={loading}
        dataLoaded={dataLoaded}
        onDeleteClient={handleDeleteClient}
        onScheduleCall={handleScheduleCall}
        onSendMessage={handleSendMessage}
      />
      
      <AddClientModal 
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onClientAdded={handleClientAdded}
      />
      
      <ScheduleCallModal
        show={showScheduleModal}
        onHide={() => {
          setShowScheduleModal(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSchedule={handleCallScheduled}
      />
      
      <SendMessageModal
        show={showMessageModal}
        onHide={() => {
          setShowMessageModal(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSend={handleMessageSent}
      />
      </div>
    </div>
  );
}
