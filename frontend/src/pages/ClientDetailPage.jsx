import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import ClientPortfolioOverview from '../components/ClientPortfolioOverview.jsx';
import AIRecommendations from '../components/AIRecommendations.jsx';
import ClientHeader from '../components/ClientHeader.jsx';
import { sampleClients, generateSamplePortfolio, generateSampleRecommendations } from '../data/clients';
import { API_BASE_URL, apiRequest, API_ENDPOINTS } from '../config/api.js';

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    
    async function loadClientData() {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading client with ID:', clientId);
        console.log('🌐 Using API_BASE:', API_BASE_URL);
        
        // Load client details
        const clientData = await apiRequest(API_ENDPOINTS.clientById(clientId), {
          signal: controller.signal,
        });
          credentials: 'include'
        
        console.log('✅ Client data received:', clientData);
        
        // Add portfolioValue for consistency
        const clientWithPortfolioValue = {
          ...clientData,
          portfolioValue: clientData.aum * 1000000 // Convert millions to actual value
        };
        
        setClient(clientWithPortfolioValue);
        console.log('💰 Client portfolio value mapped from AUM:', clientWithPortfolioValue.portfolioValue);

        // Load portfolio data
        try {
          const portfolioData = await apiRequest(API_ENDPOINTS.clientPortfolio(clientId), {
            signal: controller.signal,
          });
          console.log('✅ Portfolio data received:', portfolioData);
          setPortfolio(portfolioData);
        } catch (portfolioError) {
          console.warn('⚠️ Portfolio fetch failed:', portfolioError.message);
          // fallback populate
          setPortfolio(generateSamplePortfolio(clientData));
          setUsingSample(true);
        }

        // Load AI recommendations  
        try {
          const recsData = await apiRequest(API_ENDPOINTS.clientRecommendations(clientId), {
            signal: controller.signal,
          });
          console.log('✅ Recommendations data received:', recsData);
          console.log('📊 Recommendations count:', recsData.length);
          console.log('📝 First recommendation structure:', recsData[0]);
          setRecommendations(recsData);
        } catch (recsError) {
          console.warn('⚠️ Recommendations fetch failed:', recsError.message);
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
  }, [clientId]);

  const handleRecommendationAction = async (recId, action, notes = '') => {
    try {
      const response = await apiRequest(API_ENDPOINTS.recommendationAction(recId), {
        method: 'POST',
        body: JSON.stringify({ action, notes }),
      });

      console.log('✅ Recommendation action updated successfully');
      
      // Refresh recommendations from server to ensure synchronization
      console.log('🔄 Refreshing recommendations to maintain sync...');
      try {
        const freshRecommendations = await apiRequest(API_ENDPOINTS.clientRecommendations(clientId));
        setRecommendations(freshRecommendations);
        console.log('✅ Recommendations refreshed from server');
      } catch (refreshError) {
        console.error('❌ Failed to refresh recommendations:', refreshError);
        // Fallback to local state update
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recId 
              ? { ...rec, status: action, actionDate: new Date().toISOString(), notes }
              : rec
          )
        );
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
