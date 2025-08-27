import React, { useState, useEffect } from 'react';
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
    const controller = new AbortController();
    async function load() {
      console.log('🚀 ClientListPage: Starting client data load...');
      setLoading(true); setError(null);
      
      const startTime = Date.now();
      console.log('📡 Attempting to fetch clients from backend...');
      console.log('🔗 URL:', 'http://localhost:5000/api/clients');
      console.log('⏰ Start time:', new Date().toISOString());
      
      // Set a timeout for the fetch request
      const timeoutId = setTimeout(() => {
        console.log('⏰ TIMEOUT: Request taking too long, aborting...');
        controller.abort();
      }, 5000); // 5 second timeout
      
      try {
        console.log('📤 Sending fetch request...');
        const res = await fetch('http://localhost:5000/api/clients', { 
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const fetchTime = Date.now() - startTime;
        clearTimeout(timeoutId);
        console.log(`✅ Fetch response received in ${fetchTime}ms`);
        console.log('📊 Response status:', res.status);
        console.log('✅ Response ok:', res.ok);
        console.log('📋 Response headers:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ API Error Response:', errorText);
          throw new Error(`API ${res.status}: ${errorText}`);
        }
        
        console.log('📥 Parsing JSON response...');
        const data = await res.json();
        console.log('✅ JSON parsed successfully');
        console.log('📊 Received data type:', typeof data);
        console.log('📊 Is array:', Array.isArray(data));
        console.log('📊 Data length:', data?.length);
        console.log('📋 First item sample:', data?.[0]);
        
        if (Array.isArray(data) && data.length) {
          console.log('✅ Setting clients from API - SUCCESS');
          setClients(data);
          setApiConnected(true);
          console.log('🔗 API connection status: CONNECTED');
        } else {
          console.warn('⚠️ No valid data from API, using sample data');
          setClients(sampleClients);
          setApiConnected(false);
          console.log('📁 Fallback to sample data, count:', sampleClients.length);
        }
      } catch (e) {
        const fetchTime = Date.now() - startTime;
        clearTimeout(timeoutId);
        console.error('❌ Fetch error occurred after', fetchTime + 'ms');
        console.error('❌ Error type:', e.constructor.name);
        console.error('❌ Error message:', e.message);
        console.error('❌ Error stack:', e.stack);
        
        if (e.name === 'AbortError') {
          console.log('⏰ Request was aborted (timeout or manual)');
        } else if (e.name === 'TypeError') {
          console.log('🌐 Network error - possibly CORS or server down');
        } else {
          console.log('🔍 Unknown error type');
        }
        
        if (e.name !== 'AbortError') {
          const errorMsg = `Backend unavailable - using sample data. Error: ${e.message}`;
          setError(errorMsg);
          setClients(sampleClients);
          setApiConnected(false);
          console.log('📁 Fallback to sample data due to error');
          console.log('📊 Sample data count:', sampleClients.length);
        }
      } finally {
        const totalTime = Date.now() - startTime;
        setLoading(false);
        console.log(`🏁 Load process completed in ${totalTime}ms`);
        console.log('📊 Final state - API Connected:', apiConnected);
        console.log('📊 Final state - Client count:', clients.length);
        console.log('📊 Final state - Loading:', false);
        console.log('📊 Final state - Error:', error || 'None');
        console.log('================================');
      }
    }
    load();
    return () => {
      console.log('🧹 Cleanup: Aborting any pending requests');
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
        <header className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3">
                <i className="bi bi-briefcase-fill text-white fs-5"></i>
              </div>
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">Client Portfolio</h1>
                <p className="text-muted small mb-0">
                  Relationship Manager Dashboard – High Net Worth Clients
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
      
      {loading && <div className="alert alert-info py-2 small">Loading clients...</div>}
      {error && <div className="alert alert-secondary py-2 small mb-2">{error}</div>}
      <ClientList 
        clients={filteredClients} 
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
