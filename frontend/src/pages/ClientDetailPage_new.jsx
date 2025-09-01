import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import ClientPortfolioOverview from '../components/ClientPortfolioOverview.jsx';
import AIRecommendationsEnhanced from '../components/AIRecommendationsEnhanced.jsx';
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
  const [usingSample, setUsingSample] = useState(true); // Always using sample data

  useEffect(() => {
    async function loadClientData() {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading client with ID:', clientId);
      console.log('📊 Using sample data only');
      
      try {
        // Find client in sample data
        const sampleClient = sampleClients.find(c => c.id === clientId);
        
        if (!sampleClient) {
          setError(`Client with ID ${clientId} not found`);
          console.error('❌ Client not found in sample data');
        } else {
          console.log('✅ Client found in sample data:', sampleClient);
          
          // Add portfolioValue for consistency
          const clientWithPortfolioValue = {
            ...sampleClient,
            portfolioValue: sampleClient.aum * 1000000 // Convert millions to actual value
          };
          
          setClient(clientWithPortfolioValue);
          console.log('💰 Client portfolio value:', clientWithPortfolioValue.portfolioValue);
          
          // Generate sample portfolio data
          const samplePortfolio = generateSamplePortfolio(sampleClient);
          setPortfolio(samplePortfolio);
          console.log('📈 Sample portfolio generated:', samplePortfolio);
          
          // Generate sample recommendations
          const sampleRecs = generateSampleRecommendations(sampleClient);
          setRecommendations(sampleRecs);
          console.log('🤖 Sample recommendations generated:', sampleRecs.length);
        }
      } catch (e) {
        console.error('❌ Error loading sample data:', e);
        setError(`Error loading client data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  // Safety check - redirect if client not found
  useEffect(() => {
    if (!loading && !client && error) {
      setTimeout(() => navigate('/clients'), 3000);
    }
  }, [loading, client, error, navigate]);

  const totalValue = useMemo(() => {
    if (!portfolio || !portfolio.allocations) return 0;
    return portfolio.allocations.reduce((sum, allocation) => sum + allocation.value, 0);
  }, [portfolio]);

  const portfolioStats = useMemo(() => {
    if (!portfolio || !portfolio.allocations || portfolio.allocations.length === 0) return {};
    
    // Calculate allocation percentages
    const allocations = portfolio.allocations.map(item => ({
      ...item,
      percentage: (item.value / totalValue) * 100
    }));

    // Calculate performance stats
    const yearlyPerformance = portfolio.yearlyPerformance || [];
    const lastYearPerformance = yearlyPerformance.length > 0 ? yearlyPerformance[yearlyPerformance.length - 1].change : 0;
    
    return {
      totalValue,
      allocations,
      yearlyPerformance,
      lastYearPerformance
    };
  }, [portfolio, totalValue]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation />
        <div className="container py-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading client details...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation />
        <div className="container py-4">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error Loading Client</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">You will be redirected to the client list in a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-vh-100 bg-light">
      <Navigation />
      
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* Client Header */}
            <ClientHeader 
              client={client}
              usingSampleData={usingSample}
              onBack={() => navigate('/clients')}
            />
            
            <div className="row g-4 mt-1">
              {/* Portfolio Overview */}
              <div className="col-lg-8">
                <ClientPortfolioOverview 
                  client={client}
                  portfolio={portfolio}
                  stats={portfolioStats}
                />
              </div>
              
              {/* AI Recommendations */}
              <div className="col-lg-4">
                <AIRecommendationsEnhanced 
                  recommendations={recommendations}
                  clientName={client.name}
                  clientId={client.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
