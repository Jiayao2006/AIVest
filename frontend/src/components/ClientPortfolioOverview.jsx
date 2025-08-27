import React from 'react';

export default function ClientPortfolioOverview({ portfolio, client }) {
  if (!portfolio) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-pie-chart text-muted display-1"></i>
          <h5 className="text-muted mt-3">Portfolio data not available</h5>
          <p className="text-muted">Portfolio details will be displayed here once connected to data source.</p>
        </div>
      </div>
    );
  }
  // Normalize possible legacy / fallback shapes
  const allocations = portfolio.allocations || portfolio.allocation || [];
  const performance = portfolio.performance || { ytd: 0, oneYear: 0 };
  const totalValue = portfolio.totalValue ?? (client?.portfolioValue ? (client.portfolioValue / 1_000_000) : 0);
  const lastUpdated = portfolio.lastUpdated || new Date().toISOString();

  const getAllocationColor = (type) => {
    const colors = {
      'Equities': '#667eea',
      'Fixed Income': '#38ef7d',
      'Alternatives': '#f093fb',
      'Real Estate': '#4facfe',
      'Cash': '#ffd93d',
      'Commodities': '#ff6b6b'
    };
    return colors[type] || '#6c757d';
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="bi bi-pie-chart-fill text-primary me-2"></i>
            Portfolio Overview
          </h5>
          <small className="text-muted">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </small>
        </div>
      </div>
      
      <div className="card-body">
        <div className="row g-4">
          {/* Portfolio Summary */}
          <div className="col-12">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="bg-light rounded p-3 text-center">
                  <h4 className="text-primary mb-1">${totalValue.toLocaleString()}M</h4>
                  <small className="text-muted">Total Portfolio Value</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light rounded p-3 text-center">
                  <h4 className={`mb-1 ${performance.ytd >= 0 ? 'text-success' : 'text-danger'}`}>
                    {performance.ytd >= 0 ? '+' : ''}{performance.ytd.toFixed(1)}%
                  </h4>
                  <small className="text-muted">YTD Performance</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light rounded p-3 text-center">
                  <h4 className={`mb-1 ${performance.oneYear >= 0 ? 'text-success' : 'text-danger'}`}>
                    {performance.oneYear >= 0 ? '+' : ''}{performance.oneYear.toFixed(1)}%
                  </h4>
                  <small className="text-muted">1-Year Return</small>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="col-md-6">
            <h6 className="fw-semibold mb-3">Asset Allocation</h6>
            <div className="space-y-3">
              {allocations.map(allocation => (
                <div key={allocation.assetClass} className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle me-2" 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: getAllocationColor(allocation.assetClass) 
                      }}
                    ></div>
                    <span className="small">{allocation.assetClass}</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{allocation.percentage}%</div>
                    <small className="text-muted">${allocation.value.toLocaleString()}M</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="col-md-6">
            <h6 className="fw-semibold mb-3">Performance Trend</h6>
            <div className="bg-light rounded p-4 text-center" style={{ minHeight: '200px' }}>
              <i className="bi bi-graph-up text-muted display-4"></i>
              <p className="text-muted mt-2 mb-0">Performance chart would be displayed here</p>
              <small className="text-muted">Integration with charting library required</small>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="col-12">
            <h6 className="fw-semibold mb-3">Risk Metrics</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h5 text-info">{portfolio.riskMetrics?.sharpeRatio || 'N/A'}</div>
                  <small className="text-muted">Sharpe Ratio</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h5 text-warning">{portfolio.riskMetrics?.volatility || 'N/A'}%</div>
                  <small className="text-muted">Volatility</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h5 text-danger">{portfolio.riskMetrics?.maxDrawdown || 'N/A'}%</div>
                  <small className="text-muted">Max Drawdown</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="h5 text-success">{portfolio.riskMetrics?.beta || 'N/A'}</div>
                  <small className="text-muted">Beta</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
