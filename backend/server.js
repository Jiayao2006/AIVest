const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory dataset (mirror of frontend sample; in production replace with DB)
const clients = [
  { id: 'c001', name: 'Elena Rossi-Marchetti', aum: 860, domicile: 'Switzerland', segments: ['Family Office','Wealth Preservation'], keyContacts:['Elena Rossi'], description:'Multi-generational family wealth focused on capital preservation and sustainable investments.', riskProfile: 'Conservative' },
  { id: 'c002', name: 'Daniel Chen', aum: 1250, domicile: 'United States', segments: ['Tech Entrepreneur','Growth'], keyContacts:['Daniel Lee'], description:'Tech founder post-IPO, diversifying proceeds into low-volatility and impact strategies.', riskProfile: 'Moderate' },
  { id: 'c003', name: 'Sophie Turner-Webb', aum: 430, domicile: 'United Kingdom', segments: ['VC Proceeds','Renewables'], keyContacts:['Sophie Turner','Mark Webb'], description:'Recent exits in green energy funds; exploring direct co-investment opportunities.', riskProfile: 'Aggressive' },
  { id: 'c004', name: 'Anders Vikström', aum: 980, domicile: 'Norway', segments: ['Shipping','Alternatives'], keyContacts:['Anders Vik'], description:'Maritime industry veteran with liquidity from fleet divestiture.', riskProfile: 'Moderate' },
  { id: 'c005', name: 'Priya Singh-Patel', aum: 510, domicile: 'Canada', segments: ['Foundation','ESG'], keyContacts:['Priya Singh'], description:'Philanthropist emphasizing ESG-aligned fixed income and mission-related investments.', riskProfile: 'Conservative' },
  { id: 'c006', name: 'Michael Tan-Wong', aum: 1575, domicile: 'Singapore', segments: ['Private Equity','Diversification'], keyContacts:['Michael Tan'], description:'PE executive diversifying concentrated exposure toward global multi-asset solutions.', riskProfile: 'Moderate' },
  { id: 'c007', name: 'Charlotte King-Harrison', aum: 690, domicile: 'Australia', segments: ['Agriculture','Real Assets'], keyContacts:['Charlotte King'], description:'Agricultural heiress reallocating from direct land holdings into inflation-protected funds.', riskProfile: 'Conservative' },
  { id: 'c008', name: 'Julien Moreau-Dubois', aum: 320, domicile: 'France', segments: ['Art Collector','Estate Planning'], keyContacts:['Julien Moreau'], description:'Art collector and gallery owner focusing on art-backed lending and estate optimization.', riskProfile: 'Moderate' },
  { id: 'c009', name: 'Isabella Rodriguez-Santos', aum: 745, domicile: 'Spain', segments: ['Real Estate','Family Wealth'], keyContacts:['Isabella Rodriguez'], description:'Property magnate transitioning from direct real estate to diversified portfolios.', riskProfile: 'Conservative' },
  { id: 'c010', name: 'James Wellington III', aum: 1890, domicile: 'United Kingdom', segments: ['Inherited Wealth','Hedge Funds'], keyContacts:['James Wellington'], description:'Third-generation wealth with focus on alternative investments and tax optimization.', riskProfile: 'Aggressive' }
];

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// List all clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Search and filter clients
app.get('/api/clients/search', (req, res) => {
  const { 
    q = '', 
    minAUM, 
    maxAUM, 
    segments, 
    domiciles, 
    riskProfiles, 
    sortBy = 'name', 
    sortOrder = 'asc' 
  } = req.query;

  let filtered = [...clients];

  // Text search
  if (q.trim()) {
    const query = q.toString().toLowerCase().trim();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.segments.some(s => s.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      c.domicile.toLowerCase().includes(query) ||
      (c.riskProfile && c.riskProfile.toLowerCase().includes(query))
    );
  }

  // AUM range filter
  if (minAUM) {
    filtered = filtered.filter(c => c.aum >= parseFloat(minAUM));
  }
  if (maxAUM) {
    filtered = filtered.filter(c => c.aum <= parseFloat(maxAUM));
  }

  // Multi-select filters
  if (segments) {
    const segmentList = Array.isArray(segments) ? segments : [segments];
    filtered = filtered.filter(c =>
      segmentList.some(segment => c.segments.includes(segment))
    );
  }

  if (domiciles) {
    const domicileList = Array.isArray(domiciles) ? domiciles : [domiciles];
    filtered = filtered.filter(c => domicileList.includes(c.domicile));
  }

  if (riskProfiles) {
    const riskList = Array.isArray(riskProfiles) ? riskProfiles : [riskProfiles];
    filtered = filtered.filter(c => riskList.includes(c.riskProfile));
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'aum':
        aVal = a.aum;
        bVal = b.aum;
        break;
      case 'domicile':
        aVal = a.domicile;
        bVal = b.domicile;
        break;
      case 'riskProfile':
        aVal = a.riskProfile;
        bVal = b.riskProfile;
        break;
      default: // name
        aVal = a.name;
        bVal = b.name;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  res.json(filtered);
});

// Single client detail
app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });
  res.json(client);
});

// Get filter metadata
app.get('/api/metadata/segments', (req, res) => {
  const segments = [...new Set(clients.flatMap(c => c.segments))].sort();
  res.json(segments);
});

app.get('/api/metadata/domiciles', (req, res) => {
  const domiciles = [...new Set(clients.map(c => c.domicile))].sort();
  res.json(domiciles);
});

app.get('/api/metadata/risk-profiles', (req, res) => {
  const riskProfiles = [...new Set(clients.map(c => c.riskProfile))].sort();
  res.json(riskProfiles);
});

// Get aggregated statistics
app.get('/api/analytics/summary', (req, res) => {
  const totalAUM = clients.reduce((sum, c) => sum + c.aum, 0);
  const avgAUM = clients.length > 0 ? totalAUM / clients.length : 0;
  
  const riskDistribution = clients.reduce((acc, c) => {
    acc[c.riskProfile] = (acc[c.riskProfile] || 0) + 1;
    return acc;
  }, {});

  const domicileDistribution = clients.reduce((acc, c) => {
    acc[c.domicile] = (acc[c.domicile] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalClients: clients.length,
    totalAUM,
    avgAUM: Math.round(avgAUM),
    riskDistribution,
    domicileDistribution,
    aumRange: {
      min: Math.min(...clients.map(c => c.aum)),
      max: Math.max(...clients.map(c => c.aum))
    }
  });
});

// Sample portfolio data for clients
const portfolioData = {
  'c001': {
    totalValue: 860,
    lastUpdated: '2025-08-25T10:00:00Z',
    allocations: [
      { assetClass: 'Fixed Income', percentage: 45, value: 387 },
      { assetClass: 'Equities', percentage: 35, value: 301 },
      { assetClass: 'Real Estate', percentage: 15, value: 129 },
      { assetClass: 'Cash', percentage: 5, value: 43 }
    ],
    performance: {
      ytd: 5.8,
      oneYear: 8.2,
      threeYear: 6.5
    },
    riskMetrics: {
      sharpeRatio: 1.2,
      volatility: 8.5,
      maxDrawdown: -4.2,
      beta: 0.75
    }
  },
  'c002': {
    totalValue: 1250,
    lastUpdated: '2025-08-25T10:00:00Z',
    allocations: [
      { assetClass: 'Equities', percentage: 60, value: 750 },
      { assetClass: 'Alternatives', percentage: 25, value: 312.5 },
      { assetClass: 'Fixed Income', percentage: 10, value: 125 },
      { assetClass: 'Cash', percentage: 5, value: 62.5 }
    ],
    performance: {
      ytd: 12.4,
      oneYear: 18.7,
      threeYear: 15.2
    },
    riskMetrics: {
      sharpeRatio: 1.8,
      volatility: 15.2,
      maxDrawdown: -12.5,
      beta: 1.4
    }
  }
};

// Sample AI recommendations
const recommendations = [
  {
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
  {
    id: 'rec002',
    clientId: 'c001',
    type: 'opportunity',
    title: 'ESG Investment Opportunity',
    summary: 'New sustainable infrastructure fund aligns with client values and offers attractive risk-adjusted returns.',
    priority: 'Low',
    confidence: 72,
    estimatedImpact: '+1.2% ESG score',
    status: 'pending',
    createdAt: '2025-08-18T09:15:00Z'
  },
  {
    id: 'rec003',
    clientId: 'c002',
    type: 'diversify',
    title: 'Geographic Diversification',
    summary: 'Consider adding emerging market exposure to reduce concentration risk in US tech sector.',
    priority: 'High',
    confidence: 91,
    estimatedImpact: '+2.1% Sharpe ratio',
    status: 'pending',
    createdAt: '2025-08-22T16:45:00Z'
  }
];

// Get client portfolio
app.get('/api/clients/:id/portfolio', (req, res) => {
  const portfolio = portfolioData[req.params.id];
  if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
  res.json(portfolio);
});

// Get client recommendations
app.get('/api/clients/:id/recommendations', (req, res) => {
  const clientRecs = recommendations.filter(rec => rec.clientId === req.params.id);
  res.json(clientRecs);
});

// Get recommendation details
app.get('/api/recommendations/:id/detail', (req, res) => {
  const rec = recommendations.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
  res.json(rec);
});

// Handle recommendation action
app.post('/api/recommendations/:id/action', (req, res) => {
  const { action, notes } = req.body;
  const recIndex = recommendations.findIndex(r => r.id === req.params.id);
  
  if (recIndex === -1) return res.status(404).json({ error: 'Recommendation not found' });
  
  recommendations[recIndex] = {
    ...recommendations[recIndex],
    status: action,
    actionDate: new Date().toISOString(),
    notes
  };
  
  res.json({ success: true, recommendation: recommendations[recIndex] });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
