import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SuggestionDetailPage() {
  const { clientId, suggestionId } = useParams();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        // Load client data
        const clientRes = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
          signal: controller.signal
        });
        if (clientRes.ok) {
          const clientData = await clientRes.json();
          setClient(clientData);
        }

        // Load suggestion details
        const suggestionRes = await fetch(`http://localhost:5000/api/recommendations/${suggestionId}/detail`, {
          signal: controller.signal
        });
        if (!suggestionRes.ok) throw new Error('Suggestion not found');
        const suggestionData = await suggestionRes.json();
        setSuggestion(suggestionData);

      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (clientId && suggestionId) {
      loadData();
    }

    return () => controller.abort();
  }, [clientId, suggestionId]);

  const handleAction = async (action) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/${suggestionId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: actionNotes })
      });

      if (response.ok) {
        // Navigate back to client detail page
        navigate(`/clients/${clientId}`);
      } else {
        throw new Error('Failed to submit action');
      }
    } catch (error) {
      console.error('Failed to submit action:', error);
      alert('Failed to submit action. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading suggestion details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !suggestion) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          <h5>Error Loading Suggestion</h5>
          <p className="mb-0">{error || 'Suggestion not found'}</p>
          <button className="btn btn-outline-danger mt-2" onClick={() => navigate(`/clients/${clientId}`)}>
            ← Back to Client Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="mb-3">
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate(`/clients/${clientId}`)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to {client?.name || 'Client Details'}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Suggestion Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-3">
                    <i className="bi bi-lightbulb-fill text-white fs-5"></i>
                  </div>
                  <div>
                    <h1 className="h4 fw-bold mb-1">{suggestion.title}</h1>
                    <p className="text-muted mb-0">{suggestion.summary}</p>
                  </div>
                </div>
                <span className={`badge bg-${suggestion.priority === 'High' ? 'danger' : suggestion.priority === 'Medium' ? 'warning' : 'info'} bg-opacity-10 text-${suggestion.priority === 'High' ? 'danger' : suggestion.priority === 'Medium' ? 'warning' : 'info'} border px-3 py-2`}>
                  {suggestion.priority} Priority
                </span>
              </div>
              
              <div className="row g-3">
                <div className="col-md-3">
                  <small className="text-muted d-block">Confidence Level</small>
                  <div className="fw-semibold">{suggestion.confidence}%</div>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Estimated Impact</small>
                  <div className="fw-semibold">{suggestion.estimatedImpact}</div>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Implementation Time</small>
                  <div className="fw-semibold">{suggestion.implementationTime || '2-4 weeks'}</div>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Risk Level</small>
                  <div className="fw-semibold">{suggestion.riskLevel || 'Medium'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-graph-up me-2 text-primary"></i>
                Detailed Analysis
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Recommendation Overview</h6>
                <p className="mb-3">{suggestion.detailedDescription || suggestion.description}</p>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Key Benefits</h6>
                  <ul className="list-unstyled">
                    {(suggestion.benefits || [
                      'Improved portfolio diversification',
                      'Enhanced risk-adjusted returns',
                      'Better alignment with investment objectives'
                    ]).map((benefit, index) => (
                      <li key={index} className="d-flex align-items-start mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Potential Risks</h6>
                  <ul className="list-unstyled">
                    {(suggestion.risks || [
                      'Market volatility impact',
                      'Liquidity considerations',
                      'Implementation timing risk'
                    ]).map((risk, index) => (
                      <li key={index} className="d-flex align-items-start mb-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2 mt-1"></i>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Steps */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-list-check me-2 text-primary"></i>
                Implementation Steps
              </h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                {(suggestion.implementationSteps || [
                  'Review current portfolio allocation',
                  'Identify assets for rebalancing',
                  'Execute trades during optimal market conditions',
                  'Monitor performance and adjust as needed'
                ]).map((step, index) => (
                  <div key={index} className="d-flex mb-3">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', minWidth: '30px' }}>
                      <span className="text-white small fw-semibold">{index + 1}</span>
                    </div>
                    <div className="pt-1">
                      <p className="mb-0">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts and Projections */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-bar-chart me-2 text-primary"></i>
                Projections & Analysis
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="bg-light rounded p-4 text-center">
                    <i className="bi bi-pie-chart text-primary display-4"></i>
                    <h6 className="mt-2 mb-0">Portfolio Impact Chart</h6>
                    <small className="text-muted">Before vs After Allocation</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light rounded p-4 text-center">
                    <i className="bi bi-graph-up text-success display-4"></i>
                    <h6 className="mt-2 mb-0">Performance Projection</h6>
                    <small className="text-muted">Expected Returns Timeline</small>
                  </div>
                </div>
              </div>
              <p className="text-muted small mt-3 mb-0">
                <i className="bi bi-info-circle me-1"></i>
                Detailed charts and analysis would be displayed here with integration to charting libraries.
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-clipboard-check me-2 text-primary"></i>
                Decision & Notes
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label small fw-semibold">Action Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Add any notes about your decision..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => handleAction('approved')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Approve Recommendation
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-danger"
                  onClick={() => handleAction('rejected')}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Reject Recommendation
                </button>
                
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/clients/${clientId}`)}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Client
                </button>
              </div>

              <hr className="my-4" />

              <div className="small text-muted">
                <h6 className="small fw-semibold mb-2">Additional Information</h6>
                <p className="mb-2">
                  <strong>Generated:</strong> {new Date(suggestion.createdAt || Date.now()).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong>AI Model:</strong> {suggestion.aiModel || 'Portfolio Optimizer v2.1'}
                </p>
                <p className="mb-0">
                  <strong>Data Sources:</strong> {suggestion.dataSources || 'Market data, client profile, risk assessment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
