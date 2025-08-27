export const sampleClients = [
  {
    id: 'c001',
    name: 'Elena Rossi-Marchetti',
    phone: '+41 22 999 1234',
    aum: 860,
    domicile: 'Switzerland',
    segments: ['Family Office', 'Wealth Preservation'],
    keyContacts: ['Elena Rossi'],
    description: 'Multi-generational family wealth focused on capital preservation and sustainable investments.',
    riskProfile: 'Conservative'
  },
  {
    id: 'c002',
    name: 'Daniel Chen',
    phone: '+1 415 555 0187',
    aum: 1250,
    domicile: 'United States',
    segments: ['Tech Entrepreneur', 'Growth'],
    keyContacts: ['Daniel Lee'],
    description: 'Tech founder post-IPO, diversifying proceeds into low-volatility and impact strategies.',
    riskProfile: 'Moderate'
  },
  {
    id: 'c003',
    name: 'Sophie Turner-Webb',
    phone: '+44 20 7946 0958',
    aum: 430,
    domicile: 'United Kingdom',
    segments: ['VC Proceeds', 'Renewables'],
    keyContacts: ['Sophie Turner', 'Mark Webb'],
    description: 'Recent exits in green energy funds; exploring direct co-investment opportunities.',
    riskProfile: 'Aggressive'
  },
  {
    id: 'c004',
    name: 'Anders Vikström',
    phone: '+47 22 12 3456',
    aum: 980,
    domicile: 'Norway',
    segments: ['Shipping', 'Alternatives'],
    keyContacts: ['Anders Vik'],
    description: 'Maritime industry veteran with liquidity from fleet divestiture.',
    riskProfile: 'Moderate'
  },
  {
    id: 'c005',
    name: 'Priya Singh-Patel',
    phone: '+1 416 555 0923',
    aum: 510,
    domicile: 'Canada',
    segments: ['Foundation', 'ESG'],
    keyContacts: ['Priya Singh'],
    description: 'Philanthropist emphasizing ESG-aligned fixed income and mission-related investments.',
    riskProfile: 'Conservative'
  },
  {
    id: 'c006',
    name: 'Michael Tan-Wong',
    phone: '+65 6555 4821',
    aum: 1575,
    domicile: 'Singapore',
    segments: ['Private Equity', 'Diversification'],
    keyContacts: ['Michael Tan'],
    description: 'PE executive diversifying concentrated exposure toward global multi-asset solutions.',
    riskProfile: 'Moderate'
  },
  {
    id: 'c007',
    name: 'Charlotte King-Harrison',
    phone: '+61 2 9555 7364',
    aum: 690,
    domicile: 'Australia',
    segments: ['Agriculture', 'Real Assets'],
    keyContacts: ['Charlotte King'],
    description: 'Agricultural heiress reallocating from direct land holdings into inflation-protected funds.',
    riskProfile: 'Conservative'
  },
  {
    id: 'c008',
    name: 'Julien Moreau-Dubois',
    phone: '+33 1 42 55 9871',
    aum: 320,
    domicile: 'France',
    segments: ['Art Collector', 'Estate Planning'],
    keyContacts: ['Julien Moreau'],
    description: 'Art collector and gallery owner focusing on art-backed lending and estate optimization.',
    riskProfile: 'Moderate'
  },
  {
    id: 'c009',
    name: 'Isabella Rodriguez-Santos',
    phone: '+34 91 555 2847',
    aum: 745,
    domicile: 'Spain',
    segments: ['Real Estate', 'Family Wealth'],
    keyContacts: ['Isabella Rodriguez'],
    description: 'Property magnate transitioning from direct real estate to diversified portfolios.',
    riskProfile: 'Conservative'
  },
  {
    id: 'c010',
    name: 'James Wellington III',
    phone: '+44 20 7555 6293',
    aum: 1890,
    domicile: 'United Kingdom',
    segments: ['Inherited Wealth', 'Hedge Funds'],
    keyContacts: ['James Wellington'],
    description: 'Third-generation wealth with focus on alternative investments and tax optimization.',
    riskProfile: 'Aggressive'
  }
];

// Sample portfolio data generator
export const generateSamplePortfolio = (client) => {
  // Component expects totalValue in MILLIONS (it appends 'M'), so keep aum number
  const totalValue = client.aum; 

  const template = {
    Conservative: {
      allocations: [
        { assetClass: 'Fixed Income', percentage: 50 },
        { assetClass: 'Equities', percentage: 30 },
        { assetClass: 'Alternatives', percentage: 10 },
        { assetClass: 'Cash', percentage: 10 }
      ],
      performance: { ytd: 3.2, oneYear: 5.1 },
      riskMetrics: { sharpeRatio: 0.9, volatility: 6.5, maxDrawdown: -8.2, beta: 0.55 }
    },
    Moderate: {
      allocations: [
        { assetClass: 'Equities', percentage: 55 },
        { assetClass: 'Fixed Income', percentage: 25 },
        { assetClass: 'Alternatives', percentage: 15 },
        { assetClass: 'Cash', percentage: 5 }
      ],
      performance: { ytd: 6.8, oneYear: 9.4 },
      riskMetrics: { sharpeRatio: 1.1, volatility: 10.2, maxDrawdown: -12.5, beta: 0.9 }
    },
    Aggressive: {
      allocations: [
        { assetClass: 'Equities', percentage: 70 },
        { assetClass: 'Alternatives', percentage: 20 },
        { assetClass: 'Fixed Income', percentage: 5 },
        { assetClass: 'Cash', percentage: 5 }
      ],
      performance: { ytd: 11.4, oneYear: 15.9 },
      riskMetrics: { sharpeRatio: 1.25, volatility: 15.7, maxDrawdown: -20.3, beta: 1.25 }
    }
  };

  const chosen = template[client.riskProfile] || template.Moderate;

  // Add value field (in millions) to each allocation
  const allocations = chosen.allocations.map(a => ({
    ...a,
    value: +(totalValue * (a.percentage / 100)).toFixed(2)
  }));

  return {
    totalValue, // still in millions
    allocations,
    performance: chosen.performance,
    riskMetrics: chosen.riskMetrics,
    lastUpdated: new Date().toISOString()
  };
};

// Sample recommendations data
export const generateSampleRecommendations = (client) => {
  const base = {
    Conservative: [
      {
        id: 'rec-cons-1',
        type: 'rebalance',
        title: 'Rebalance Fixed Income Sleeve',
        summary: 'Shift 5% from cash into investment grade bonds to improve yield.',
        priority: 'Medium',
        confidence: 82,
        estimatedImpact: '+0.4% annualized',
        status: 'pending'
      },
      {
        id: 'rec-cons-2',
        type: 'diversify',
        title: 'Add ESG Bond Fund',
        summary: 'Introduce sustainable bond exposure aligned with mandate.',
        priority: 'Low',
        confidence: 76,
        estimatedImpact: '+0.2% risk-adjusted',
        status: 'pending'
      }
    ],
    Moderate: [
      {
        id: 'rec-mod-1',
        type: 'opportunity',
        title: 'Increase International Exposure',
        summary: 'Allocate 7% to emerging markets to capture growth dispersion.',
        priority: 'High',
        confidence: 88,
        estimatedImpact: '+1.1% 12m expected',
        status: 'pending'
      },
      {
        id: 'rec-mod-2',
        type: 'diversify',
        title: 'Add Core Infrastructure Fund',
        summary: 'Improve inflation hedge and income stability via infra assets.',
        priority: 'Medium',
        confidence: 81,
        estimatedImpact: '+0.6% downside protection',
        status: 'pending'
      }
    ],
    Aggressive: [
      {
        id: 'rec-agg-1',
        type: 'opportunity',
        title: 'Overweight AI Growth Basket',
        summary: 'Deploy 5% tactical sleeve into AI thematic equities.',
        priority: 'High',
        confidence: 79,
        estimatedImpact: '+2.4% upside scenario',
        status: 'pending'
      },
      {
        id: 'rec-agg-2',
        type: 'hedge',
        title: 'Introduce Tail Risk Hedge',
        summary: 'Allocate 1% to structured protective strategy.',
        priority: 'Medium',
        confidence: 73,
        estimatedImpact: '-3.0% max drawdown improvement',
        status: 'pending'
      }
    ]
  };
  return base[client.riskProfile] || base.Moderate;
};
