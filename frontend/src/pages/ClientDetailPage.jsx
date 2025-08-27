import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import ClientPortfolioOverview from '../components/ClientPortfolioOverview.jsx';
import AIRecommendations from '../components/AIRecommendations.jsx';
import ClientHeader from '../components/ClientHeader.jsx';
import { sampleClients, generateSamplePortfolio, generateSampleRecommendations } from '../data/clients';

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingSample, setUsingSample] = useState(false);

  const API_BASE = useMemo(() => {
    if (typeof window === 'undefined') return 'http://localhost:5000';
    const host = window.location.hostname;
    const devHosts = new Set(['localhost', '127.0.0.1']);
    if (devHosts.has(host)) {
      return import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';
    }
    return '';
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    async function loadClientData() {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading client with ID:', clientId);
        console.log('🌐 Using API_BASE:', API_BASE);
        
  // Load client details
        const clientUrl = `${API_BASE}/api/clients/${clientId}`;
        console.log('📡 Fetching client from:', clientUrl);
        
        const clientRes = await fetch(clientUrl, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        console.log('📊 Client response status:', clientRes.status);
        console.log('📊 Client response headers:', Object.fromEntries(clientRes.headers.entries()));
        
  if (!clientRes.ok) {
          const errorText = await clientRes.text();
          console.error('❌ Client fetch failed:', clientRes.status, errorText);
          throw new Error(`Failed to load client: ${clientRes.status} - ${errorText}`);
        }
        
        const clientData = await clientRes.json();
        console.log('✅ Client data received:', clientData);
        
        // Add portfolioValue for consistency
        const clientWithPortfolioValue = {
          ...clientData,
          portfolioValue: clientData.aum * 1000000 // Convert millions to actual value
        };
        
        setClient(clientWithPortfolioValue);
        console.log('💰 Client portfolio value mapped from AUM:', clientWithPortfolioValue.portfolioValue);

        // Load portfolio data
        const portfolioUrl = `${API_BASE}/api/clients/${clientId}/portfolio`;
        console.log('📊 Fetching portfolio from:', portfolioUrl);
        
        const portfolioRes = await fetch(portfolioUrl, {
          signal: controller.signal,
          credentials: 'include'
        });
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          console.log('✅ Portfolio data received:', portfolioData);
          setPortfolio(portfolioData);
        } else {
          console.warn('⚠️ Portfolio fetch failed:', portfolioRes.status);
          // fallback populate
          setPortfolio(generateSamplePortfolio(clientData));
          setUsingSample(true);
        }

        // Load AI recommendations  
        const recsUrl = `${API_BASE}/api/clients/${clientId}/recommendations`;
        console.log('🤖 Fetching recommendations from:', recsUrl);
        
        const recsRes = await fetch(recsUrl, {
          signal: controller.signal,
          credentials: 'include'
        });
        if (recsRes.ok) {
          const recsData = await recsRes.json();
          console.log('✅ Recommendations data received:', recsData);
          console.log('📊 Recommendations count:', recsData.length);
          console.log('📝 First recommendation structure:', recsData[0]);
          setRecommendations(recsData);
        } else {
          console.warn('⚠️ Recommendations fetch failed:', recsRes.status);
          const sampleRecs = generateSampleRecommendations(clientData);
          console.log('🔄 Using sample recommendations:', sampleRecs);
          setRecommendations(sampleRecs);
          setUsingSample(true);
        }

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn('⚠️ API connection failed:', e.message, '-> using sample data');
          const sampleClient = sampleClients.find(c => c.id === clientId);
          if (!sampleClient) {
            setError(`Client with ID ${clientId} not found`);
          } else {
            setClient({ ...sampleClient, portfolioValue: sampleClient.aum * 1000000 });
            setPortfolio(generateSamplePortfolio(sampleClient));
            setRecommendations(generateSampleRecommendations(sampleClient));
            setUsingSample(true);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    if (clientId) {
      loadClientData();
    }

    return () => controller.abort();
  }, [clientId, API_BASE]);

  const handleRecommendationAction = async (recId, action, notes = '') => {
    try {
      const actionUrl = `${API_BASE}/api/recommendations/${recId}/action`;
      console.log('🎯 Updating recommendation action:', actionUrl);
      
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
        credentials: 'include'
      });

      if (response.ok) {
        console.log('✅ Recommendation action updated successfully');
        // Update local state
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recId 
              ? { ...rec, status: action, actionDate: new Date().toISOString(), notes }
              : rec
          )
        );
      } else {
        console.warn('⚠️ Recommendation action update failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to update recommendation:', error);
    }
  };

  const handleViewSuggestionDetail = (recommendationId) => {
    navigate(`/clients/${clientId}/suggestions/${recommendationId}`);
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container-xxl px-4 py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading client details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container-xxl px-4 py-5">
          <div className="alert alert-danger">
            <h5>Error Loading Client</h5>
            <p className="mb-0">{error}</p>
            <button className="btn btn-outline-danger mt-2" onClick={() => navigate('/')}>
              ← Back to Client List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-xxl px-4 py-5">
        <Navigation />
        
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Client Portfolio
          </button>
          {usingSample && (
            <span className="badge bg-warning text-dark">
              Using Sample Data
            </span>
          )}
        </div>

        {client && (
          <>
            <ClientHeader client={client} />
            
            <div className="row g-4">
              <div className="col-lg-8">
                <ClientPortfolioOverview 
                  portfolio={portfolio} 
                  client={client}
                />
              </div>
              
              <div className="col-lg-4">
                <AIRecommendations
                  recommendations={recommendations}
                  onAction={handleRecommendationAction}
                  onViewDetail={handleViewSuggestionDetail}
                  clientId={clientId}
                />
                {/* Debug info */}
                {recommendations.length > 0 && (
                  <div className="mt-2 small text-muted">
                    Debug: {recommendations.length} recommendations loaded
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
