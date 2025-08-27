const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Simple CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Sample clients data
const clients = [
  { id: 'c001', name: 'Elena Rossi-Marchetti', phone: '+41 22 999 1234', aum: 860, domicile: 'Switzerland', segments: ['Family Office','Wealth Preservation'], keyContacts:['Elena Rossi'], description:'Multi-generational family wealth focused on capital preservation and sustainable investments.', riskProfile: 'Conservative' },
  { id: 'c002', name: 'Daniel Chen', phone: '+1 415 555 0187', aum: 1250, domicile: 'United States', segments: ['Tech Entrepreneur','Growth'], keyContacts:['Daniel Lee'], description:'Tech founder post-IPO, diversifying proceeds into low-volatility and impact strategies.', riskProfile: 'Moderate' },
  { id: 'c003', name: 'Sophie Turner-Webb', phone: '+44 20 7946 0958', aum: 430, domicile: 'United Kingdom', segments: ['VC Proceeds','Renewables'], keyContacts:['Sophie Turner','Mark Webb'], description:'Recent exits in green energy funds; exploring direct co-investment opportunities.', riskProfile: 'Aggressive' }
];

// Basic endpoints
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

app.get('/api/clients', (req, res) => {
  console.log('Clients requested');
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Endpoints available:');
  console.log('- GET /api/health');
  console.log('- GET /api/clients');
  console.log('- GET /api/clients/:id');
});
