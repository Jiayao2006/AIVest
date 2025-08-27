import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import ClientPortfolioOverview from '../components/ClientPortfolioOverview.jsx';
import AIRecommendations from '../components/AIRecommendations.jsx';
import ClientHeader from '../components/ClientHeader.jsx';

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function loadClientData() {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading client with ID:', clientId);
        
        // Load client details
        const clientRes = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Client response status:', clientRes.status);
        console.log('Client response headers:', Object.fromEntries(clientRes.headers.entries()));
        
        if (!clientRes.ok) {
          const errorText = await clientRes.text();
          console.error('Client fetch failed:', clientRes.status, errorText);
          throw new Error(`Failed to load client: ${clientRes.status} - ${errorText}`);
        }
        
        const clientData = await clientRes.json();
        console.log('Client data received:', clientData);
        
        // Add portfolioValue for consistency
        const clientWithPortfolioValue = {
          ...clientData,
          portfolioValue: clientData.aum * 1000000 // Convert millions to actual value
        };
        
        setClient(clientWithPortfolioValue);
        console.log('💰 Client portfolio value mapped from AUM:', clientWithPortfolioValue.portfolioValue);

        // Load portfolio data
        const portfolioRes = await fetch(`http://localhost:5000/api/clients/${clientId}/portfolio`, {
          signal: controller.signal
        });
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          setPortfolio(portfolioData);
        }

        // Load AI recommendations
        const recsRes = await fetch(`http://localhost:5000/api/clients/${clientId}/recommendations`, {
          signal: controller.signal
        });
        if (recsRes.ok) {
          const recsData = await recsRes.json();
          setRecommendations(recsData);
        }

      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message);
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
      const response = await fetch(`http://localhost:5000/api/recommendations/${recId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      });

      if (response.ok) {
        // Update local state
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recId 
              ? { ...rec, status: action, actionDate: new Date().toISOString(), notes }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Failed to update recommendation:', error);
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
        
        <div className="mb-4">
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Client Portfolio
          </button>
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
