const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced logging
console.log('🚀 Starting AIVest Banking Server...');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🌐 Target Port:', PORT);
console.log('💻 Node Version:', process.version);
console.log('📁 Working Directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// CORS Configuration with detailed logging
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('🔒 CORS Configuration:');
console.log('   📍 Allowed Origins:', corsOptions.origin);
console.log('   🔑 Credentials:', corsOptions.credentials);
console.log('   📤 Methods:', corsOptions.methods);
console.log('   📋 Headers:', corsOptions.allowedHeaders);

// CORS configuration - fixed and simplified
app.use(cors(corsOptions));

app.use(express.json());

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📨 [${timestamp}] ${req.method} ${req.path}`);
  console.log('   🔗 Origin:', req.get('Origin') || 'None');
  console.log('   🌐 User-Agent:', req.get('User-Agent')?.substring(0, 100) || 'None');
  console.log('   📋 Content-Type:', req.get('Content-Type') || 'None');
  console.log('   🔑 Authorization:', req.get('Authorization') ? 'Present' : 'None');
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`   ✅ Response ${res.statusCode} sent (${data?.length || 0} chars)`);
    if (res.statusCode >= 400) {
      console.log('   ❌ Error Response Body:', data);
    }
    return originalSend.call(this, data);
  };
  
  next();
});

// In-memory dataset (mirror of frontend sample; in production replace with DB)
const clients = [
  { id: 'c001', name: 'Elena Rossi-Marchetti', phone: '+41 22 999 1234', aum: 860, domicile: 'Switzerland', segments: ['Family Office','Wealth Preservation'], keyContacts:['Elena Rossi'], description:'Multi-generational family wealth focused on capital preservation and sustainable investments.', riskProfile: 'Conservative' },
  { id: 'c002', name: 'Daniel Chen', phone: '+1 415 555 0187', aum: 1250, domicile: 'United States', segments: ['Tech Entrepreneur','Growth'], keyContacts:['Daniel Lee'], description:'Tech founder post-IPO, diversifying proceeds into low-volatility and impact strategies.', riskProfile: 'Moderate' },
  { id: 'c003', name: 'Sophie Turner-Webb', phone: '+44 20 7946 0958', aum: 430, domicile: 'United Kingdom', segments: ['VC Proceeds','Renewables'], keyContacts:['Sophie Turner','Mark Webb'], description:'Recent exits in green energy funds; exploring direct co-investment opportunities.', riskProfile: 'Aggressive' },
  { id: 'c004', name: 'Anders Vikström', phone: '+47 22 12 3456', aum: 980, domicile: 'Norway', segments: ['Shipping','Alternatives'], keyContacts:['Anders Vik'], description:'Maritime industry veteran with liquidity from fleet divestiture.', riskProfile: 'Moderate' },
  { id: 'c005', name: 'Priya Singh-Patel', phone: '+1 416 555 0923', aum: 510, domicile: 'Canada', segments: ['Foundation','ESG'], keyContacts:['Priya Singh'], description:'Philanthropist emphasizing ESG-aligned fixed income and mission-related investments.', riskProfile: 'Conservative' },
  { id: 'c006', name: 'Michael Tan-Wong', phone: '+65 6555 4821', aum: 1575, domicile: 'Singapore', segments: ['Private Equity','Diversification'], keyContacts:['Michael Tan'], description:'PE executive diversifying concentrated exposure toward global multi-asset solutions.', riskProfile: 'Moderate' },
  { id: 'c007', name: 'Charlotte King-Harrison', phone: '+61 2 9555 7364', aum: 690, domicile: 'Australia', segments: ['Agriculture','Real Assets'], keyContacts:['Charlotte King'], description:'Agricultural heiress reallocating from direct land holdings into inflation-protected funds.', riskProfile: 'Conservative' },
  { id: 'c008', name: 'Julien Moreau-Dubois', phone: '+33 1 42 55 9871', aum: 320, domicile: 'France', segments: ['Art Collector','Estate Planning'], keyContacts:['Julien Moreau'], description:'Art collector and gallery owner focusing on art-backed lending and estate optimization.', riskProfile: 'Moderate' },
  { id: 'c009', name: 'Isabella Rodriguez-Santos', phone: '+34 91 555 2847', aum: 745, domicile: 'Spain', segments: ['Real Estate','Family Wealth'], keyContacts:['Isabella Rodriguez'], description:'Property magnate transitioning from direct real estate to diversified portfolios.', riskProfile: 'Conservative' },
  { id: 'c010', name: 'James Wellington III', phone: '+44 20 7555 6293', aum: 1890, domicile: 'United Kingdom', segments: ['Inherited Wealth','Hedge Funds'], keyContacts:['James Wellington'], description:'Third-generation wealth with focus on alternative investments and tax optimization.', riskProfile: 'Aggressive' }
];

app.get('/api/health', (_, res) => {
  console.log('💓 Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List all clients
app.get('/api/clients', (req, res) => {
  console.log('📋 GET /api/clients - Fetching all clients');
  console.log('   📊 Total clients in memory:', clients.length);
  console.log('   🔍 Query params:', req.query);
  
  try {
    console.log('   ✅ Sending client list response');
    res.json(clients);
  } catch (error) {
    console.error('   ❌ Error sending clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Search and filter clients
app.get('/api/clients/search', (req, res) => {
  console.log('🔍 GET /api/clients/search - Search request');
  console.log('   📝 Query params:', req.query);
  
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

  console.log('   🔍 Search text:', q);
  console.log('   💰 AUM range:', minAUM, '-', maxAUM);
  console.log('   📊 Segments filter:', segments);
  console.log('   🌍 Domiciles filter:', domiciles);

  let filtered = [...clients];
  console.log('   📋 Starting with', filtered.length, 'clients');

  // Text search
  if (q.trim()) {
    const query = q.toString().toLowerCase().trim();
    const originalCount = filtered.length;
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.segments.some(s => s.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      c.domicile.toLowerCase().includes(query) ||
      (c.riskProfile && c.riskProfile.toLowerCase().includes(query))
    );
    console.log('   🔍 After text search:', filtered.length, '(was', originalCount + ')');
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
  console.log('Fetching client with ID:', req.params.id);
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    console.log('Client not found:', req.params.id);
    return res.status(404).json({ error: 'Client not found', id: req.params.id });
  }
  console.log('Client found:', client.name);
  console.log('Sending response:', JSON.stringify(client));
  res.json(client);
});

// Create new client
app.post('/api/clients', (req, res) => {
  console.log('=== Creating new client ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  const { name, phone, aum, domicile, segments, keyContacts, description, riskProfile } = req.body;
  
  // Validation
  if (!name || !phone || !aum || !domicile || !riskProfile) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({ 
      error: 'Missing required fields', 
      required: ['name', 'phone', 'aum', 'domicile', 'riskProfile'],
      received: { name: !!name, phone: !!phone, aum: !!aum, domicile: !!domicile, riskProfile: !!riskProfile }
    });
  }
  
  try {
    // Generate new ID
    const existingIds = clients.map(c => parseInt(c.id.substring(1))).filter(n => !isNaN(n));
    const nextId = Math.max(...existingIds, 0) + 1;
    const newId = `c${nextId.toString().padStart(3, '0')}`;
    
    // Create new client
    const newClient = {
      id: newId,
      name: name.trim(),
      phone: phone.trim(),
      aum: parseFloat(aum),
      domicile: domicile.trim(),
      segments: Array.isArray(segments) ? segments : (segments ? [segments] : []).filter(Boolean),
      keyContacts: Array.isArray(keyContacts) ? keyContacts : (keyContacts ? [keyContacts] : []).filter(Boolean),
      description: description ? description.trim() : '',
      riskProfile: riskProfile.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Add to clients array
    clients.push(newClient);
    
    console.log('New client created successfully:', JSON.stringify(newClient, null, 2));
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Delete a client
app.delete('/api/clients/:id', (req, res) => {
  console.log('=== Deleting client ===');
  console.log('Client ID:', req.params.id);
  
  const clientId = req.params.id;
  const clientIndex = clients.findIndex(c => c.id === clientId);
  
  if (clientIndex === -1) {
    console.log('Client not found');
    return res.status(404).json({ error: 'Client not found' });
  }
  
  const deletedClient = clients.splice(clientIndex, 1)[0];
  console.log('Client deleted successfully:', deletedClient.name);
  
  res.json({ 
    message: 'Client deleted successfully', 
    deletedClient: { id: deletedClient.id, name: deletedClient.name }
  });
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
  },
  'c003': {
    totalValue: 430,
    lastUpdated: '2025-08-26T15:30:00Z',
    allocations: [
      { assetClass: 'Equities', percentage: 70, value: 301 },
      { assetClass: 'Alternatives', percentage: 20, value: 86 },
      { assetClass: 'Cash', percentage: 10, value: 43 }
    ],
    performance: {
      ytd: 18.7,
      oneYear: 24.3,
      threeYear: 19.8
    },
    riskMetrics: {
      sharpeRatio: 1.6,
      volatility: 22.1,
      maxDrawdown: -18.3,
      beta: 1.8
    }
  },
  'c004': {
    totalValue: 980,
    lastUpdated: '2025-08-26T09:45:00Z',
    allocations: [
      { assetClass: 'Alternatives', percentage: 40, value: 392 },
      { assetClass: 'Equities', percentage: 30, value: 294 },
      { assetClass: 'Fixed Income', percentage: 20, value: 196 },
      { assetClass: 'Cash', percentage: 10, value: 98 }
    ],
    performance: {
      ytd: 9.3,
      oneYear: 12.8,
      threeYear: 11.4
    },
    riskMetrics: {
      sharpeRatio: 1.4,
      volatility: 12.7,
      maxDrawdown: -8.9,
      beta: 1.1
    }
  },
  'c005': {
    totalValue: 510,
    lastUpdated: '2025-08-26T11:20:00Z',
    allocations: [
      { assetClass: 'Fixed Income', percentage: 60, value: 306 },
      { assetClass: 'Equities', percentage: 25, value: 127.5 },
      { assetClass: 'ESG Funds', percentage: 10, value: 51 },
      { assetClass: 'Cash', percentage: 5, value: 25.5 }
    ],
    performance: {
      ytd: 4.2,
      oneYear: 6.8,
      threeYear: 5.1
    },
    riskMetrics: {
      sharpeRatio: 0.9,
      volatility: 6.3,
      maxDrawdown: -3.1,
      beta: 0.6
    }
  },
  'c006': {
    totalValue: 1575,
    lastUpdated: '2025-08-26T14:10:00Z',
    allocations: [
      { assetClass: 'Equities', percentage: 45, value: 708.75 },
      { assetClass: 'Alternatives', percentage: 30, value: 472.5 },
      { assetClass: 'Fixed Income', percentage: 15, value: 236.25 },
      { assetClass: 'Cash', percentage: 10, value: 157.5 }
    ],
    performance: {
      ytd: 11.7,
      oneYear: 15.9,
      threeYear: 13.2
    },
    riskMetrics: {
      sharpeRatio: 1.5,
      volatility: 13.8,
      maxDrawdown: -9.7,
      beta: 1.2
    }
  },
  'c007': {
    totalValue: 690,
    lastUpdated: '2025-08-26T16:00:00Z',
    allocations: [
      { assetClass: 'Real Estate', percentage: 35, value: 241.5 },
      { assetClass: 'Fixed Income', percentage: 30, value: 207 },
      { assetClass: 'Commodities', percentage: 20, value: 138 },
      { assetClass: 'Equities', percentage: 10, value: 69 },
      { assetClass: 'Cash', percentage: 5, value: 34.5 }
    ],
    performance: {
      ytd: 7.1,
      oneYear: 9.4,
      threeYear: 8.8
    },
    riskMetrics: {
      sharpeRatio: 1.1,
      volatility: 9.2,
      maxDrawdown: -5.6,
      beta: 0.8
    }
  },
  'c008': {
    totalValue: 320,
    lastUpdated: '2025-08-26T12:45:00Z',
    allocations: [
      { assetClass: 'Art & Collectibles', percentage: 40, value: 128 },
      { assetClass: 'Fixed Income', percentage: 30, value: 96 },
      { assetClass: 'Equities', percentage: 20, value: 64 },
      { assetClass: 'Cash', percentage: 10, value: 32 }
    ],
    performance: {
      ytd: 6.8,
      oneYear: 10.2,
      threeYear: 7.9
    },
    riskMetrics: {
      sharpeRatio: 1.0,
      volatility: 11.5,
      maxDrawdown: -7.2,
      beta: 0.9
    }
  },
  'c009': {
    totalValue: 745,
    lastUpdated: '2025-08-26T13:30:00Z',
    allocations: [
      { assetClass: 'Real Estate', percentage: 50, value: 372.5 },
      { assetClass: 'Fixed Income', percentage: 30, value: 223.5 },
      { assetClass: 'Equities', percentage: 15, value: 111.75 },
      { assetClass: 'Cash', percentage: 5, value: 37.25 }
    ],
    performance: {
      ytd: 5.9,
      oneYear: 8.7,
      threeYear: 7.2
    },
    riskMetrics: {
      sharpeRatio: 1.0,
      volatility: 8.1,
      maxDrawdown: -4.8,
      beta: 0.7
    }
  },
  'c010': {
    totalValue: 1890,
    lastUpdated: '2025-08-26T17:15:00Z',
    allocations: [
      { assetClass: 'Hedge Funds', percentage: 40, value: 756 },
      { assetClass: 'Equities', percentage: 35, value: 661.5 },
      { assetClass: 'Alternatives', percentage: 15, value: 283.5 },
      { assetClass: 'Fixed Income', percentage: 7, value: 132.3 },
      { assetClass: 'Cash', percentage: 3, value: 56.7 }
    ],
    performance: {
      ytd: 16.2,
      oneYear: 22.8,
      threeYear: 18.5
    },
    riskMetrics: {
      sharpeRatio: 1.9,
      volatility: 18.4,
      maxDrawdown: -15.2,
      beta: 1.6
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
  },
  {
    id: 'rec004',
    clientId: 'c003',
    type: 'risk-management',
    title: 'Volatility Protection Strategy',
    summary: 'High equity concentration suggests adding downside protection through structured products or options.',
    priority: 'High',
    confidence: 88,
    estimatedImpact: '-15% portfolio volatility',
    status: 'pending',
    createdAt: '2025-08-24T11:20:00Z',
    detailedDescription: 'With 70% equity allocation and aggressive risk profile, consider adding tail risk hedging to protect against significant market downturns while maintaining upside participation.',
    benefits: [
      'Downside protection in market stress',
      'Maintains growth potential',
      'Peace of mind for concentrated holdings',
      'Flexible implementation options'
    ],
    risks: [
      'Cost of protection reduces returns',
      'Complexity of structured products',
      'Timing dependency of strategies'
    ],
    implementationSteps: [
      'Assess risk tolerance for hedging costs',
      'Evaluate protection strategy options',
      'Implement pilot hedging program',
      'Monitor and adjust coverage levels'
    ]
  },
  {
    id: 'rec005',
    clientId: 'c006',
    type: 'opportunity',
    title: 'Private Credit Allocation',
    summary: 'Given PE background, consider direct lending opportunities to enhance yield in current rate environment.',
    priority: 'Medium',
    confidence: 82,
    estimatedImpact: '+1.8% yield enhancement',
    status: 'pending',
    createdAt: '2025-08-25T09:30:00Z',
    detailedDescription: 'Client\'s private equity expertise provides unique insight for evaluating direct lending opportunities. Current market conditions favor private credit with attractive risk-adjusted yields.',
    benefits: [
      'Higher yields than traditional fixed income',
      'Floating rate protection',
      'Leverage existing PE expertise',
      'Portfolio diversification benefits'
    ],
    risks: [
      'Illiquidity of private credit investments',
      'Credit risk in economic downturns',
      'Manager selection challenges'
    ],
    implementationSteps: [
      'Review private credit market landscape',
      'Identify suitable fund managers',
      'Determine appropriate allocation size',
      'Structure commitment timeline'
    ]
  },
  {
    id: 'rec006',
    clientId: 'c010',
    type: 'tax-optimization',
    title: 'Tax-Efficient Rebalancing',
    summary: 'Significant hedge fund gains present opportunity for tax-loss harvesting and charitable giving strategies.',
    priority: 'High',
    confidence: 89,
    estimatedImpact: '+$180k tax savings',
    status: 'pending',
    createdAt: '2025-08-26T14:45:00Z',
    detailedDescription: 'Strong hedge fund performance creates substantial unrealized gains. Implementing tax-loss harvesting and charitable remainder trust strategies could optimize after-tax wealth.',
    benefits: [
      'Significant tax savings opportunity',
      'Charitable giving tax benefits',
      'Portfolio rebalancing advantages',
      'Estate planning optimization'
    ],
    risks: [
      'Complexity of tax strategies',
      'Timing dependency for implementation',
      'Regulatory compliance requirements'
    ],
    implementationSteps: [
      'Conduct comprehensive tax analysis',
      'Coordinate with tax advisors',
      'Evaluate charitable giving options',
      'Execute optimized rebalancing plan'
    ]
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

// Enhanced debugging endpoints for network diagnostics
app.get('/api/debug/network', (req, res) => {
  console.log('🔧 Network diagnostics requested');
  const networkInfo = {
    timestamp: new Date().toISOString(),
    serverStatus: 'running',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: corsOptions.origin,
    endpoints: {
      health: '/api/health',
      clients: '/api/clients',
      search: '/api/clients/search',
      test: '/api/test'
    },
    connectionTest: 'Server is responding correctly',
    databaseStatus: 'in-memory (operational)',
    totalClients: clients.length,
    lastRequestTime: new Date().toISOString()
  };
  
  console.log('   📊 Returning network diagnostics:', Object.keys(networkInfo));
  res.json(networkInfo);
});

// Simple test endpoint for connectivity verification
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint accessed');
  console.log('   📍 Origin:', req.get('Origin') || 'None');
  console.log('   🔗 User-Agent:', req.get('User-Agent')?.substring(0, 50) || 'None');
  
  const testResponse = {
    status: 'success',
    message: 'Backend server is reachable',
    timestamp: new Date().toISOString(),
    echo: {
      method: req.method,
      path: req.path,
      query: req.query,
      origin: req.get('Origin'),
      userAgent: req.get('User-Agent')?.substring(0, 100)
    }
  };
  
  console.log('   ✅ Test response prepared');
  res.json(testResponse);
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  console.error('   📍 Request:', req.method, req.path);
  console.error('   🔗 Origin:', req.get('Origin'));
  console.error('   📊 Error stack:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  console.log(`❓ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log('   📍 Origin:', req.get('Origin') || 'None');
  
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/clients',
      'GET /api/clients/search',
      'GET /api/clients/:id',
      'POST /api/clients',
      'DELETE /api/clients/:id',
      'GET /api/debug/network',
      'GET /api/test'
    ],
    timestamp: new Date().toISOString()
  });
});

// Start server with enhanced startup logging
const server = app.listen(PORT, () => {
  console.log('\n🎉 =================================');
  console.log('🚀 AIVest Banking Server Started!');
  console.log('🎉 =================================');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log('📋 Available Endpoints:');
  console.log('   💓 Health Check: /api/health');
  console.log('   👥 Clients List: /api/clients');
  console.log('   🔍 Client Search: /api/clients/search');
  console.log('   👤 Client Detail: /api/clients/:id');
  console.log('   ➕ Create Client: POST /api/clients');
  console.log('   🗑️  Delete Client: DELETE /api/clients/:id');
  console.log('   📊 Analytics: /api/analytics/summary');
  console.log('   🔧 Network Debug: /api/debug/network');
  console.log('   🧪 Test Endpoint: /api/test');
  console.log('🔒 CORS Origins:', corsOptions.origin.join(', '));
  console.log(`📊 Initial Client Count: ${clients.length}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('🎯 Ready for connections!');
  console.log('=================================\n');
});

// Enhanced graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('🔥 Stack:', error.stack);
  console.log('🛑 Server will shut down...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise);
  console.error('🔥 Reason:', reason);
  console.log('🛑 Server will shut down...');
  process.exit(1);
});
