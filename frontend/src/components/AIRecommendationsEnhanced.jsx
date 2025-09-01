import React, { useState, useEffect } from 'react';

const getRecommendationIcon = (type) => {
  const icons = {
    'rebalance': 'bi-arrow-repeat',
    'diversify': 'bi-pie-chart',
    'hedge': 'bi-shield-check',
    'opportunity': 'bi-lightbulb',
    'tax': 'bi-calculator',
    'risk': 'bi-exclamation-triangle',
    'tax-optimization': 'bi-calculator',
    'risk-management': 'bi-exclamation-triangle'
  };
  return icons[type] || 'bi-star';
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return 'danger';
    case 'Medium': return 'warning';
    case 'Low': return 'info';
    default: return 'secondary';
  }
};

// Sample recommendation detail data for display when user clicks view details
const hardcodedRecommendationDetails = {
  'rec001': {
    id: 'rec001',
    clientId: 'c001',
    type: 'rebalance',
    title: 'Portfolio Rebalancing Opportunity',
    summary: 'Current allocation has drifted from target. Recommend reducing equity exposure and increasing fixed income.',
    priority: 'Medium',
    confidence: 85,
    estimatedImpact: '+0.8% annual return',
    status: 'pending',
    createdAt: '2025-08-20T14:30:00Z',
    detailedDescription: 'Market analysis indicates that the current portfolio allocation has drifted significantly from the target allocation due to recent equity performance. A rebalancing would help maintain the desired risk profile while potentially capturing value from overperforming assets.',
    benefits: [
      'Restore target risk profile alignment',
      'Capture gains from overperforming equities',
      'Improve portfolio stability',
      'Maintain consistent income generation'
    ],
    risks: [
      'Potential short-term volatility during transition',
      'Transaction costs impact',
      'Tax implications from asset sales'
    ],
    implementationSteps: [
      'Analyze current vs target allocation gaps',
      'Identify specific positions for rebalancing',
      'Plan transaction timing to minimize market impact',
      'Execute trades in optimal order',
      'Monitor and adjust as needed'
    ]
  },
  'rec002': {
    id: 'rec002',
    clientId: 'c001',
    type: 'opportunity',
    title: 'ESG Investment Opportunity',
    summary: 'New sustainable infrastructure fund aligns with client values and offers attractive risk-adjusted returns.',
    priority: 'Low',
    confidence: 72,
    estimatedImpact: '+1.2% ESG score',
    status: 'pending',
    createdAt: '2025-08-18T09:15:00Z',
    detailedDescription: 'A new European renewable energy infrastructure fund has become available that matches the client\'s sustainability objectives while offering competitive returns and diversification benefits.',
    benefits: [
      'Alignment with ESG investment mandate',
      'Diversification into infrastructure assets',
      'Stable income generation potential',
      'Positive environmental impact'
    ],
    risks: [
      'Regulatory changes in renewable sector',
      'Interest rate sensitivity',
      'Limited liquidity during initial years'
    ],
    implementationSteps: [
      'Review fund prospectus and strategy',
      'Assess fit within current ESG allocation',
      'Plan funding from cash reserves',
      'Execute subscription process'
    ]
  },
  'rec003': {
    id: 'rec003',
    clientId: 'c002',
    type: 'diversify',
    title: 'Geographic Diversification',
    summary: 'Consider adding emerging market exposure to reduce concentration risk in US tech sector.',
    priority: 'High',
    confidence: 91,
    estimatedImpact: '+2.1% Sharpe ratio',
    status: 'pending',
    createdAt: '2025-08-22T16:45:00Z',
    detailedDescription: 'Current portfolio shows high concentration in US technology stocks post-IPO. Adding emerging market exposure, particularly in Asia and Latin America, would improve risk-adjusted returns.',
    benefits: [
      'Reduced geographic concentration risk',
      'Access to faster-growing economies',
      'Currency diversification benefits',
      'Lower correlation with existing holdings'
    ],
    risks: [
      'Higher political and regulatory risks',
      'Currency volatility exposure',
      'Lower liquidity in some markets'
    ],
    implementationSteps: [
      'Analyze current geographic allocation',
      'Select appropriate EM fund vehicles',
      'Determine optimal allocation percentage',
      'Execute gradual implementation plan'
    ]
  }
};

// Fallback recommendation details for any ID not found in the hardcoded data
const defaultRecommendationDetail = {
  type: 'opportunity',
  title: 'Investment Opportunity',
  summary: 'Recommendation details',
  priority: 'Medium',
  confidence: 80,
  estimatedImpact: '+1.5% expected return',
  status: 'pending',
  createdAt: '2025-08-22T16:45:00Z',
  detailedDescription: 'This is a sample recommendation detail that is used when specific details are not available.',
  benefits: [
    'Portfolio optimization',
    'Risk management',
    'Return enhancement'
  ],
  risks: [
    'Market volatility',
    'Implementation costs',
    'Timing considerations'
  ],
  implementationSteps: [
    'Review recommendation',
    'Consult with investment team',
    'Execute if approved'
  ]
};

export default function AIRecommendationsEnhanced({ recommendations, clientId }) {
  const [actioningId, setActioningId] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(null);
  const [updatedRecommendations, setUpdatedRecommendations] = useState([]);

  // Initialize updatedRecommendations when recommendations prop changes
  useEffect(() => {
    setUpdatedRecommendations(recommendations);
  }, [recommendations]);

  const handleViewDetail = (recId) => {
    // Use hardcoded data instead of API fetch
    setViewingDetail(hardcodedRecommendationDetails[recId] || {
      ...defaultRecommendationDetail,
      id: recId
    });
  };

  const handleAction = (recId, action) => {
    setActioningId(recId);
    
    // Update recommendation status locally
    setUpdatedRecommendations(prev => 
      prev.map(rec => rec.id === recId ? { ...rec, status: action } : rec)
    );
    
    // Simulate API call completion
    setTimeout(() => {
      setActioningId(null);
      
      // Close detail modal if the acted recommendation is the one being viewed
      if (viewingDetail?.id === recId) {
        setViewingDetail(null);
      }
    }, 500);
  };

  const pendingRecommendations = updatedRecommendations.filter(rec => rec.status === 'pending' || !rec.status);
  const completedRecommendations = updatedRecommendations.filter(rec => rec.status && rec.status !== 'pending');

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="card-title mb-0">
            <i className="bi bi-robot text-primary me-2"></i>
            AI Recommendations
            {pendingRecommendations.length > 0 && (
              <span className="badge bg-danger ms-2">{pendingRecommendations.length}</span>
            )}
          </h5>
        </div>
        
        <div className="card-body">
          {updatedRecommendations.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-lightbulb text-muted display-4"></i>
              <p className="text-muted mt-2 mb-0">No recommendations available</p>
              <small className="text-muted">AI analysis will generate suggestions based on market conditions and client profile.</small>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pending Recommendations */}
              {pendingRecommendations.length > 0 && (
                <>
                  <h6 className="text-muted small fw-semibold mb-3">PENDING REVIEW</h6>
                  {pendingRecommendations.map(rec => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onAction={handleAction}
                      onViewDetail={handleViewDetail}
                      isActioning={actioningId === rec.id}
                    />
                  ))}
                </>
              )}

              {/* Completed Recommendations */}
              {completedRecommendations.length > 0 && (
                <>
                  {pendingRecommendations.length > 0 && <hr className="my-4" />}
                  <h6 className="text-muted small fw-semibold mb-3">RECENT ACTIONS</h6>
                  {completedRecommendations.slice(0, 3).map(rec => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onAction={handleAction}
                      onViewDetail={handleViewDetail}
                      isCompleted={true}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recommendation Detail Modal with Blur Background */}
      {viewingDetail && (
        <>
          {/* Background overlay with blur effect */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(5px)',
              zIndex: 1040
            }}
            onClick={() => setViewingDetail(null)}
          ></div>
          
          {/* Modal dialog */}
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`${getRecommendationIcon(viewingDetail.type)} text-primary me-2`}></i>
                    {viewingDetail.title}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setViewingDetail(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex justify-content-between mb-4">
                    <span className={`badge bg-${getPriorityColor(viewingDetail.priority)}`}>
                      {viewingDetail.priority} Priority
                    </span>
                    <span className="text-muted small">
                      Created {new Date(viewingDetail.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="lead">{viewingDetail.summary}</p>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">Confidence</h6>
                          <h3 className="mb-0">{viewingDetail.confidence}%</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">Est. Impact</h6>
                          <h3 className="mb-0">{viewingDetail.estimatedImpact}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">Type</h6>
                          <h3 className="mb-0 text-capitalize">{viewingDetail.type}</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6>Detailed Description</h6>
                  <p>{viewingDetail.detailedDescription}</p>

                  <div className="row g-4 mt-2">
                    <div className="col-md-4">
                      <h6 className="text-success">Benefits</h6>
                      <ul className="list-group list-group-flush">
                        {viewingDetail.benefits?.map((benefit, index) => (
                          <li key={index} className="list-group-item border-0 ps-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-danger">Risks</h6>
                      <ul className="list-group list-group-flush">
                        {viewingDetail.risks?.map((risk, index) => (
                          <li key={index} className="list-group-item border-0 ps-0">
                            <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-primary">Implementation</h6>
                      <ol className="list-group list-group-flush list-group-numbered">
                        {viewingDetail.implementationSteps?.map((step, index) => (
                          <li key={index} className="list-group-item border-0 ps-0">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  {viewingDetail.status !== 'approved' && viewingDetail.status !== 'rejected' && (
                    <>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => {
                          handleAction(viewingDetail.id, 'rejected');
                          setViewingDetail(null);
                        }}
                      >
                        <i className="bi bi-x-lg me-2"></i>
                        Reject
                      </button>
                      <button 
                        className="btn btn-success" 
                        onClick={() => {
                          handleAction(viewingDetail.id, 'approved');
                          setViewingDetail(null);
                        }}
                      >
                        <i className="bi bi-check-lg me-2"></i>
                        Approve
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary" onClick={() => setViewingDetail(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function RecommendationCard({ recommendation, onAction, onViewDetail, isActioning, isCompleted }) {
  const { id, type, title, summary, priority, confidence, estimatedImpact, status } = recommendation;

  return (
    <div className={`border rounded p-3 mb-3 ${isCompleted ? 'bg-light' : 'bg-white'} position-relative`}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <i className={`${getRecommendationIcon(type)} text-primary me-2`}></i>
          <div>
            <h6 className="mb-1 fw-semibold">{title}</h6>
            <small className="text-muted">{summary}</small>
          </div>
        </div>
        <span className={`badge bg-${getPriorityColor(priority)} bg-opacity-10 text-${getPriorityColor(priority)} border border-${getPriorityColor(priority)} border-opacity-25`}>
          {priority}
        </span>
      </div>

      <div className="row g-2 mb-3 small">
        <div className="col-6">
          <span className="text-muted">Confidence:</span>
          <span className="fw-semibold ms-1">{confidence}%</span>
        </div>
        <div className="col-6">
          <span className="text-muted">Impact:</span>
          <span className="fw-semibold ms-1">{estimatedImpact}</span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary flex-fill"
            onClick={() => onViewDetail(id)}
            disabled={isActioning}
          >
            <i className="bi bi-eye me-1"></i>
            View Details
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => onAction(id, 'approved')}
            disabled={isActioning}
          >
            {isActioning ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-check-lg"></i>
            )}
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onAction(id, 'rejected')}
            disabled={isActioning}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <span className={`badge ${status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
            {status === 'approved' ? 'Approved' : 'Rejected'}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onViewDetail(id)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
        </div>
      )}
    </div>
  );
}
