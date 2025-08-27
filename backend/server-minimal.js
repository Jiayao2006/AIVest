const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

console.log('🚀 Starting MINIMAL AIVest Backend Server...');

// Ultra-simple CORS and middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Complete sample client data
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

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

app.get('/api/clients/:id/portfolio', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  res.json({
    totalValue: client.aum * 1000000,
    allocation: { equity: 60, bonds: 30, alternatives: 10 },
    holdings: [
      { name: 'Global Equity Fund', value: client.aum * 600000, percentage: 60 },
      { name: 'Government Bonds', value: client.aum * 300000, percentage: 30 },
      { name: 'Alternative Investments', value: client.aum * 100000, percentage: 10 }
    ]
  });
});

app.get('/api/clients/:id/recommendations', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`✅ MINIMAL Server running on http://localhost:${PORT}`);
  console.log('📋 Endpoints: /api/health, /api/clients, /api/clients/:id, /api/clients/:id/portfolio, /api/clients/:id/recommendations');
});
