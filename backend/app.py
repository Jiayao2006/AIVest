from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
import json
import re

# Determine if we're in production
is_production = os.environ.get('FLASK_ENV') == 'production'

# Configure static folder - in production, serve from the frontend build directory
static_folder = '../frontend/dist' if is_production else None

app = Flask(__name__, static_folder=static_folder)

# CORS Configuration with dynamic origins
allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://aivest-7otb.onrender.com'
]

# Add any additional origins from environment variable
if os.environ.get('ADDITIONAL_CORS_ORIGINS'):
    for origin in os.environ.get('ADDITIONAL_CORS_ORIGINS').split(','):
        if origin.strip():
            allowed_origins.append(origin.strip())

CORS(app, origins=allowed_origins, supports_credentials=True)

# Enhanced logging - matching Express style
print('🚀 Starting AIVest Banking Server (Flask)...')
print(f'📅 Timestamp: {datetime.now().isoformat()}')
print(f'🌐 Target Port: {os.getenv("PORT", 5000)}')
print(f'💻 Python Version: {os.sys.version}')
print(f'📁 Working Directory: {os.getcwd()}')
print(f'🔧 Environment: {os.getenv("FLASK_ENV", "development")}')
print(f'🔧 Production Mode: {is_production}')

# CORS Configuration log
print('🔧 CORS Configuration Initialized')
print(f'   🌐 Allowed Origins: {", ".join(allowed_origins)}')
print(f'   🔧 Mode: {os.getenv("FLASK_ENV", "development")}')

# In-memory dataset - exact copy from your Express server
clients = [
    {
        'id': 'c001',
        'name': 'Elena Rossi-Marchetti',
        'phone': '+41 22 999 1234',
        'aum': 860,
        'domicile': 'Switzerland',
        'segments': ['Family Office', 'Wealth Preservation'],
        'keyContacts': ['Elena Rossi'],
        'description': 'Multi-generational family wealth focused on capital preservation and sustainable investments.',
        'riskProfile': 'Conservative'
    },
    {
        'id': 'c002',
        'name': 'Daniel Chen',
        'phone': '+1 415 555 0187',
        'aum': 1250,
        'domicile': 'United States',
        'segments': ['Tech Entrepreneur', 'Growth'],
        'keyContacts': ['Daniel Lee'],
        'description': 'Tech founder post-IPO, diversifying proceeds into low-volatility and impact strategies.',
        'riskProfile': 'Moderate'
    },
    {
        'id': 'c003',
        'name': 'Sophie Turner-Webb',
        'phone': '+44 20 7946 0958',
        'aum': 430,
        'domicile': 'United Kingdom',
        'segments': ['VC Proceeds', 'Renewables'],
        'keyContacts': ['Sophie Turner', 'Mark Webb'],
        'description': 'Recent exits in green energy funds; exploring direct co-investment opportunities.',
        'riskProfile': 'Aggressive'
    },
    {
        'id': 'c004',
        'name': 'Anders Vikström',
        'phone': '+47 22 12 3456',
        'aum': 980,
        'domicile': 'Norway',
        'segments': ['Shipping', 'Alternatives'],
        'keyContacts': ['Anders Vik'],
        'description': 'Maritime industry veteran with liquidity from fleet divestiture.',
        'riskProfile': 'Moderate'
    },
    {
        'id': 'c005',
        'name': 'Priya Singh-Patel',
        'phone': '+1 416 555 0923',
        'aum': 510,
        'domicile': 'Canada',
        'segments': ['Foundation', 'ESG'],
        'keyContacts': ['Priya Singh'],
        'description': 'Philanthropist emphasizing ESG-aligned fixed income and mission-related investments.',
        'riskProfile': 'Conservative'
    },
    {
        'id': 'c006',
        'name': 'Michael Tan-Wong',
        'phone': '+65 6555 4821',
        'aum': 1575,
        'domicile': 'Singapore',
        'segments': ['Private Equity', 'Diversification'],
        'keyContacts': ['Michael Tan'],
        'description': 'PE executive diversifying concentrated exposure toward global multi-asset solutions.',
        'riskProfile': 'Moderate'
    },
    {
        'id': 'c007',
        'name': 'Charlotte King-Harrison',
        'phone': '+61 2 9555 7364',
        'aum': 690,
        'domicile': 'Australia',
        'segments': ['Agriculture', 'Real Assets'],
        'keyContacts': ['Charlotte King'],
        'description': 'Agricultural heiress reallocating from direct land holdings into inflation-protected funds.',
        'riskProfile': 'Conservative'
    },
    {
        'id': 'c008',
        'name': 'Julien Moreau-Dubois',
        'phone': '+33 1 42 55 9871',
        'aum': 320,
        'domicile': 'France',
        'segments': ['Art Collector', 'Estate Planning'],
        'keyContacts': ['Julien Moreau'],
        'description': 'Art collector and gallery owner focusing on art-backed lending and estate optimization.',
        'riskProfile': 'Moderate'
    },
    {
        'id': 'c009',
        'name': 'Isabella Rodriguez-Santos',
        'phone': '+34 91 555 2847',
        'aum': 745,
        'domicile': 'Spain',
        'segments': ['Real Estate', 'Family Wealth'],
        'keyContacts': ['Isabella Rodriguez'],
        'description': 'Property magnate transitioning from direct real estate to diversified portfolios.',
        'riskProfile': 'Conservative'
    },
    {
        'id': 'c010',
        'name': 'James Wellington III',
        'phone': '+44 20 7555 6293',
        'aum': 1890,
        'domicile': 'United Kingdom',
        'segments': ['Inherited Wealth', 'Hedge Funds'],
        'keyContacts': ['James Wellington'],
        'description': 'Third-generation wealth with focus on alternative investments and tax optimization.',
        'riskProfile': 'Aggressive'
    }
]

# Portfolio data - exact copy from Express
portfolio_data = {
    'c001': {
        'totalValue': 860,
        'lastUpdated': '2025-08-25T10:00:00Z',
        'allocations': [
            {'assetClass': 'Fixed Income', 'percentage': 45, 'value': 387},
            {'assetClass': 'Equities', 'percentage': 35, 'value': 301},
            {'assetClass': 'Real Estate', 'percentage': 15, 'value': 129},
            {'assetClass': 'Cash', 'percentage': 5, 'value': 43}
        ],
        'performance': {'ytd': 5.8, 'oneYear': 8.2, 'threeYear': 6.5},
        'riskMetrics': {'sharpeRatio': 1.2, 'volatility': 8.5, 'maxDrawdown': -4.2, 'beta': 0.75}
    },
    'c002': {
        'totalValue': 1250,
        'lastUpdated': '2025-08-25T10:00:00Z',
        'allocations': [
            {'assetClass': 'Equities', 'percentage': 60, 'value': 750},
            {'assetClass': 'Fixed Income', 'percentage': 25, 'value': 312.5},
            {'assetClass': 'Alternatives', 'percentage': 10, 'value': 125},
            {'assetClass': 'Cash', 'percentage': 5, 'value': 62.5}
        ],
        'performance': {'ytd': 12.4, 'oneYear': 15.8, 'threeYear': 11.2},
        'riskMetrics': {'sharpeRatio': 1.45, 'volatility': 12.8, 'maxDrawdown': -8.1, 'beta': 1.15}
    },
    'c003': {
        'totalValue': 430,
        'lastUpdated': '2025-08-25T10:00:00Z',
        'allocations': [
            {'assetClass': 'Equities', 'percentage': 70, 'value': 301},
            {'assetClass': 'Alternatives', 'percentage': 20, 'value': 86},
            {'assetClass': 'Fixed Income', 'percentage': 8, 'value': 34.4},
            {'assetClass': 'Cash', 'percentage': 2, 'value': 8.6}
        ],
        'performance': {'ytd': 18.7, 'oneYear': 22.3, 'threeYear': 14.9},
        'riskMetrics': {'sharpeRatio': 1.32, 'volatility': 16.2, 'maxDrawdown': -12.5, 'beta': 1.35}
    }
}

# Recommendations data - exact copy from Express
recommendations = [
    {
        'id': 'rec001',
        'clientId': 'c001',
        'type': 'rebalance',
        'title': 'Portfolio Rebalancing Opportunity',
        'summary': 'Current allocation has drifted from target. Recommend reducing equity exposure and increasing fixed income.',
        'priority': 'Medium',
        'confidence': 85,
        'estimatedImpact': '+0.8% annual return',
        'status': 'pending',
        'createdAt': '2025-08-20T14:30:00Z'
    },
    {
        'id': 'rec002',
        'clientId': 'c002',
        'type': 'opportunity',
        'title': 'ESG Investment Opportunity',
        'summary': 'New sustainable technology fund launch aligns with client\'s values and growth objectives.',
        'priority': 'High',
        'confidence': 92,
        'estimatedImpact': '+1.2% potential upside',
        'status': 'pending',
        'createdAt': '2025-08-21T09:15:00Z'
    },
    {
        'id': 'rec003',
        'clientId': 'c003',
        'type': 'risk_management',
        'title': 'Hedge Position Recommendation',
        'summary': 'Market volatility suggests implementing protective put strategy for downside protection.',
        'priority': 'Medium',
        'confidence': 78,
        'estimatedImpact': 'Downside protection',
        'status': 'approved',
        'createdAt': '2025-08-19T16:45:00Z'
    }
]

@app.before_request
def log_request_info():
    """Enhanced request logging middleware - matching Express style"""
    if request.path.startswith('/api'):
        print(f'\n📨 [{datetime.now().isoformat()}] {request.method} {request.path}')
        print(f'   🔗 Origin: {request.headers.get("Origin", "None")}')
        print(f'   🌐 User-Agent: {request.headers.get("User-Agent", "")[:100]}...')
        if request.get_json(silent=True):
            print(f'   📋 Body size: {len(str(request.get_json()))} chars')

@app.after_request
def log_response_info(response):
    """Log response information"""
    if request.path.startswith('/api'):
        print(f'   ✅ Response {response.status_code} sent')
        print(f'   📊 Content-Length: {response.content_length or "unknown"}')
    return response

# API Routes - exact copies from Express

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    print('💓 Health check requested')
    print('   🏥 Server status: healthy')
    print('   📊 Memory usage: normal')
    return jsonify({
        'status': 'ok',
        'service': 'AIVest Banking API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'uptime': 'running'
    })

@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Get all clients - exact copy from Express"""
    print('📋 GET /api/clients - Fetching all clients')
    print(f'   📊 Total clients in memory: {len(clients)}')
    
    try:
        print('   ✅ Sending client list response')
        print(f'   📤 Response size: {len(clients)} clients')
        return jsonify(clients)
    except Exception as error:
        print(f'   ❌ Error sending clients: {error}')
        return jsonify({'error': 'Failed to fetch clients'}), 500

@app.route('/api/clients/search', methods=['GET'])
def search_clients():
    """Search clients with filters - exact copy from Express"""
    print('🔍 GET /api/clients/search - Search request')
    
    # Get query parameters
    q = request.args.get('q', '').lower().strip()
    min_aum = request.args.get('minAUM')
    max_aum = request.args.get('maxAUM')
    segments = request.args.getlist('segments')
    domiciles = request.args.getlist('domiciles')
    risk_profiles = request.args.getlist('riskProfiles')
    sort_by = request.args.get('sortBy', 'name')
    sort_order = request.args.get('sortOrder', 'asc')
    
    print(f'   🔍 Search text: "{q}"')
    print(f'   💰 AUM range: {min_aum} - {max_aum}')
    print(f'   📊 Filters: segments={segments}, domiciles={domiciles}, risk={risk_profiles}')
    print(f'   📈 Sort: {sort_by} {sort_order}')
    
    filtered = clients.copy()
    initial_count = len(filtered)
    
    # Text search
    if q:
        filtered = [c for c in filtered if (
            q in c['name'].lower() or
            any(q in s.lower() for s in c['segments']) or
            q in c['description'].lower() or
            q in c['domicile'].lower() or
            q in c['riskProfile'].lower()
        )]
        print(f'   📝 Text filter: {initial_count} → {len(filtered)} clients')
    
    # AUM range filter
    if min_aum:
        filtered = [c for c in filtered if c['aum'] >= float(min_aum)]
        print(f'   💰 Min AUM filter: → {len(filtered)} clients')
    if max_aum:
        filtered = [c for c in filtered if c['aum'] <= float(max_aum)]
        print(f'   💰 Max AUM filter: → {len(filtered)} clients')
    
    # Segments filter
    if segments:
        filtered = [c for c in filtered if any(seg in c['segments'] for seg in segments)]
        print(f'   🏷️ Segments filter: → {len(filtered)} clients')
    
    # Domiciles filter
    if domiciles:
        filtered = [c for c in filtered if c['domicile'] in domiciles]
        print(f'   🌍 Domiciles filter: → {len(filtered)} clients')
    
    # Risk profiles filter
    if risk_profiles:
        filtered = [c for c in filtered if c['riskProfile'] in risk_profiles]
        print(f'   ⚖️ Risk profiles filter: → {len(filtered)} clients')
    
    # Sorting
    reverse = sort_order == 'desc'
    if sort_by == 'aum':
        filtered.sort(key=lambda x: x['aum'], reverse=reverse)
    elif sort_by == 'domicile':
        filtered.sort(key=lambda x: x['domicile'], reverse=reverse)
    elif sort_by == 'riskProfile':
        filtered.sort(key=lambda x: x['riskProfile'], reverse=reverse)
    else:  # name
        filtered.sort(key=lambda x: x['name'].lower(), reverse=reverse)
    
    print(f'   📊 Final result: {len(filtered)} clients (sorted by {sort_by} {sort_order})')
    return jsonify(filtered)

@app.route('/api/clients/<client_id>', methods=['GET'])
def get_client(client_id):
    """Get specific client - exact copy from Express"""
    print(f'👤 GET /api/clients/{client_id} - Fetching client details')
    
    client = next((c for c in clients if c['id'] == client_id), None)
    
    if not client:
        print(f'   ❌ Client not found: {client_id}')
        return jsonify({'error': 'Client not found', 'id': client_id}), 404
    
    print(f'   ✅ Client found: {client["name"]} (AUM: ${client["aum"]}M)')
    return jsonify(client)

@app.route('/api/clients', methods=['POST'])
def create_client():
    """Create new client - exact copy from Express"""
    print('=== Creating new client ===')
    data = request.get_json()
    print(f'📝 Request body: {json.dumps(data, indent=2)}')
    
    # Validation
    required_fields = ['name', 'phone', 'aum', 'domicile', 'riskProfile']
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    
    if missing_fields:
        print(f'❌ Validation failed - missing required fields: {missing_fields}')
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields,
            'missing': missing_fields
        }), 400
    
    try:
        # Generate new ID
        existing_ids = [int(c['id'][1:]) for c in clients if c['id'][1:].isdigit()]
        next_id = max(existing_ids, default=0) + 1
        new_id = f'c{next_id:03d}'
        
        print(f'🆔 Generated new client ID: {new_id}')
        
        # Create new client
        new_client = {
            'id': new_id,
            'name': data['name'].strip(),
            'phone': data['phone'].strip(),
            'aum': float(data['aum']),
            'domicile': data['domicile'].strip(),
            'segments': data.get('segments', []),
            'keyContacts': data.get('keyContacts', []),
            'description': data.get('description', '').strip(),
            'riskProfile': data['riskProfile'].strip(),
            'createdAt': datetime.now().isoformat()
        }
        
        clients.append(new_client)
        print(f'✅ New client created successfully:')
        print(f'   👤 Name: {new_client["name"]}')
        print(f'   💰 AUM: ${new_client["aum"]}M')
        print(f'   🌍 Domicile: {new_client["domicile"]}')
        print(f'   📊 Total clients: {len(clients)}')
        
        return jsonify(new_client), 201
        
    except ValueError as e:
        print(f'❌ Validation error: {e}')
        return jsonify({'error': 'Invalid data format', 'details': str(e)}), 400
    except Exception as error:
        print(f'❌ Error creating client: {error}')
        return jsonify({'error': 'Internal server error', 'details': str(error)}), 500

@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    """Delete client - exact copy from Express"""
    print('=== Deleting client ===')
    print(f'🗑️ Client ID: {client_id}')
    
    global clients
    client_index = next((i for i, c in enumerate(clients) if c['id'] == client_id), -1)
    
    if client_index == -1:
        print('❌ Client not found')
        return jsonify({'error': 'Client not found'}), 404
    
    deleted_client = clients.pop(client_index)
    print(f'✅ Client deleted successfully: {deleted_client["name"]}')
    print(f'📊 Remaining clients: {len(clients)}')
    
    return jsonify({
        'message': 'Client deleted successfully',
        'deletedClient': {'id': deleted_client['id'], 'name': deleted_client['name']}
    })

@app.route('/api/clients/<client_id>/portfolio', methods=['GET'])
def get_portfolio(client_id):
    """Get client portfolio - exact copy from Express"""
    print(f'💼 GET /api/clients/{client_id}/portfolio - Fetching portfolio')
    
    portfolio = portfolio_data.get(client_id)
    if not portfolio:
        print(f'   ❌ Portfolio not found for client: {client_id}')
        return jsonify({'error': 'Portfolio not found'}), 404
    
    print(f'   ✅ Portfolio found: ${portfolio["totalValue"]}M total value')
    print(f'   📊 Allocations: {len(portfolio["allocations"])} asset classes')
    return jsonify(portfolio)

@app.route('/api/clients/<client_id>/recommendations', methods=['GET'])
def get_recommendations(client_id):
    """Get client recommendations - exact copy from Express"""
    print(f'🤖 GET /api/clients/{client_id}/recommendations')
    print(f'   🔍 Looking for recommendations for client: {client_id}')
    
    # Find static recommendations for this client
    client_recs = [rec for rec in recommendations if rec['clientId'] == client_id]
    print(f'   📊 Found static recommendations: {len(client_recs)}')
    
    # If no static recommendations exist, generate generic ones
    if not client_recs:
        print('   🔄 No static recommendations found, generating generic ones')
        client = next((c for c in clients if c['id'] == client_id), None)
        if client:
            generic_recs = generate_generic_recommendations(client)
            print(f'   ✅ Generated {len(generic_recs)} generic recommendations')
            print(f'   📋 Recommendations: {[r["title"] for r in generic_recs]}')
            return jsonify(generic_recs)
        else:
            print(f'   ❌ Client not found: {client_id}')
            return jsonify({'error': 'Client not found'}), 404
    
    print(f'   ✅ Returning {len(client_recs)} static recommendations')
    return jsonify(client_recs)

def generate_generic_recommendations(client):
    """Generate generic recommendations based on risk profile - exact copy from Express"""
    print(f'   🤖 Generating recommendations for {client["name"]} ({client["riskProfile"]})')
    
    risk_profile_recommendations = {
        'Conservative': [{
            'id': f'rec-{client["id"]}-1',
            'clientId': client['id'],
            'type': 'rebalance',
            'title': 'Annual Portfolio Review',
            'summary': 'Quarterly rebalancing to maintain conservative allocation targets and ensure capital preservation focus.',
            'priority': 'Medium',
            'confidence': 78,
            'estimatedImpact': '+0.3% stability improvement',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }, {
            'id': f'rec-{client["id"]}-2',
            'clientId': client['id'],
            'type': 'risk_management',
            'title': 'Bond Duration Adjustment',
            'summary': 'Consider shortening bond duration given current interest rate environment.',
            'priority': 'Low',
            'confidence': 72,
            'estimatedImpact': '+0.2% yield protection',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }],
        'Moderate': [{
            'id': f'rec-{client["id"]}-1',
            'clientId': client['id'],
            'type': 'diversify',
            'title': 'International Diversification',
            'summary': 'Expand international equity exposure to capture global growth opportunities while managing home country bias.',
            'priority': 'Medium',
            'confidence': 82,
            'estimatedImpact': '+0.7% risk-adjusted returns',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }, {
            'id': f'rec-{client["id"]}-2',
            'clientId': client['id'],
            'type': 'opportunity',
            'title': 'Alternative Investment Allocation',
            'summary': 'Consider 5-10% allocation to REITs or commodities for inflation protection.',
            'priority': 'Medium',
            'confidence': 75,
            'estimatedImpact': '+0.5% inflation hedge',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }],
        'Aggressive': [{
            'id': f'rec-{client["id"]}-1',
            'clientId': client['id'],
            'type': 'opportunity',
            'title': 'Growth Sector Concentration',
            'summary': 'Increase exposure to high-growth technology and healthcare sectors aligned with aggressive risk tolerance.',
            'priority': 'High',
            'confidence': 75,
            'estimatedImpact': '+1.2% upside potential',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }, {
            'id': f'rec-{client["id"]}-2',
            'clientId': client['id'],
            'type': 'rebalance',
            'title': 'Emerging Markets Exposure',
            'summary': 'Consider adding emerging markets equity exposure for enhanced growth potential.',
            'priority': 'Medium',
            'confidence': 68,
            'estimatedImpact': '+1.0% growth acceleration',
            'status': 'pending',
            'createdAt': datetime.now().isoformat()
        }]
    }
    
    recommendations = risk_profile_recommendations.get(client['riskProfile'], risk_profile_recommendations['Moderate'])
    print(f'   📋 Generated {len(recommendations)} recommendations for {client["riskProfile"]} profile')
    return recommendations

@app.route('/api/recommendations/<rec_id>/detail', methods=['GET'])
def get_recommendation_detail(rec_id):
    """Get recommendation detail - exact copy from Express"""
    print(f'🔍 GET /api/recommendations/{rec_id}/detail')
    print(f'   🔍 Looking for recommendation: {rec_id}')
    
    # Check static recommendations first
    rec = next((r for r in recommendations if r['id'] == rec_id), None)
    if rec:
        print('   ✅ Found in static recommendations')
        print(f'   📋 Recommendation: {rec["title"]}')
        return jsonify(rec)
    
    # Check for generic recommendation pattern (rec-c001-1, rec-c002-2, etc.)
    generic_match = re.match(r'^rec-(.+)-(\d+)$', rec_id)
    if generic_match:
        client_id = generic_match.group(1)
        rec_number = generic_match.group(2)
        print(f'   🔄 Generic recommendation detected for client: {client_id}, number: {rec_number}')
        
        client = next((c for c in clients if c['id'] == client_id), None)
        if client:
            generic_recs = generate_generic_recommendations(client)
            matching_rec = next((r for r in generic_recs if r['id'] == rec_id), None)
            if matching_rec:
                print('   ✅ Generated generic recommendation found')
                print(f'   📋 Recommendation: {matching_rec["title"]}')
                return jsonify(matching_rec)
    
    print('   ❌ Recommendation not found')
    return jsonify({'error': 'Recommendation not found'}), 404

@app.route('/api/recommendations/<rec_id>/action', methods=['POST'])
def handle_recommendation_action(rec_id):
    """Handle recommendation action (approve/reject) - exact copy from Express"""
    print(f'⚡ POST /api/recommendations/{rec_id}/action')
    data = request.get_json()
    print(f'   📝 Action data: {data}')
    
    action = data.get('action')  # 'approved' or 'rejected'
    notes = data.get('notes', '')
    
    if action not in ['approved', 'rejected']:
        print(f'   ❌ Invalid action: {action}')
        return jsonify({'error': 'Invalid action. Must be "approved" or "rejected"'}), 400
    
    print(f'   🎯 Action: {action}')
    print(f'   📝 Notes: {notes[:100]}...' if len(notes) > 100 else f'   📝 Notes: {notes}')
    
    # Find in static recommendations first
    rec_index = next((i for i, r in enumerate(recommendations) if r['id'] == rec_id), -1)
    
    if rec_index != -1:
        print('   ✅ Found in static recommendations, updating')
        recommendations[rec_index].update({
            'status': action,
            'actionDate': datetime.now().isoformat(),
            'notes': notes
        })
        print(f'   ✅ Static recommendation updated: {recommendations[rec_index]["title"]}')
        return jsonify({'success': True, 'recommendation': recommendations[rec_index]})
    
    # Handle generic recommendation
    generic_match = re.match(r'^rec-(.+)-(\d+)$', rec_id)
    if generic_match:
        client_id = generic_match.group(1)
        print(f'   🔄 Generic recommendation action for client: {client_id}')
        
        client = next((c for c in clients if c['id'] == client_id), None)
        if client:
            generic_recs = generate_generic_recommendations(client)
            matching_rec = next((r for r in generic_recs if r['id'] == rec_id), None)
            if matching_rec:
                # Update the recommendation and save it to static array for persistence
                updated_rec = {
                    **matching_rec,
                    'status': action,
                    'actionDate': datetime.now().isoformat(),
                    'notes': notes
                }
                recommendations.append(updated_rec)
                print('   ✅ Generic recommendation updated and saved to static array')
                print(f'   📊 Total recommendations now: {len(recommendations)}')
                return jsonify({'success': True, 'recommendation': updated_rec})
    
    print('   ❌ Recommendation not found')
    return jsonify({'error': 'Recommendation not found'}), 404

# Debug endpoints - exact copies from Express

@app.route('/api/debug/cors', methods=['GET'])
def debug_cors():
    """Debug CORS configuration"""
    origin = request.headers.get('Origin')
    print(f'🔧 CORS Debug - Origin: {origin}')
    return jsonify({
        'status': 'ok',
        'message': 'CORS working correctly',
        'originReceived': origin,
        'timestamp': datetime.now().isoformat(),
        'corsEnabled': True
    })

# This endpoint is already defined above - commenting out to avoid duplicate
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     """Health check endpoint for monitoring services"""
#     return jsonify({
#         'status': 'healthy',
#         'service': 'AIVest Flask Backend',
#         'timestamp': datetime.now().isoformat(),
#         'environment': os.getenv('FLASK_ENV', 'development'),
#         'version': '1.1.0'
#     })

@app.route('/api/debug/network', methods=['GET'])
def debug_network():
    """Network diagnostic endpoint"""
    print('🌐 Network diagnostic requested')
    return jsonify({
        'status': 'success',
        'message': 'Network connectivity verified',
        'server': 'Flask/Python',
        'timestamp': datetime.now().isoformat(),
        'clientsCount': len(clients),
        'recommendationsCount': len(recommendations),
        'portfoliosCount': len(portfolio_data)
    })

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint"""
    print('🧪 Test endpoint accessed')
    return jsonify({
        'status': 'success',
        'message': 'Flask backend server is reachable and working',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

# Static file serving for production (React app)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    """Serve React app in production"""
    if os.getenv('FLASK_ENV') == 'production' or os.getenv('NODE_ENV') == 'production':
        print(f'📁 Serving static file: {path or "index.html"}')
        static_folder = os.path.join(os.path.dirname(__file__), '../frontend/dist')
        
        if path and os.path.exists(os.path.join(static_folder, path)):
            return send_from_directory(static_folder, path)
        
        # Serve index.html for React Router
        return send_from_directory(static_folder, 'index.html')
    
    return jsonify({
        'message': 'Development mode - use separate frontend server',
        'frontend': 'http://localhost:5173',
        'backend': f'http://localhost:{os.getenv("PORT", 5000)}'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production' and os.getenv('NODE_ENV') != 'production'
    
    print('\n🎉 =================================')
    print('🚀 AIVest Banking Server Started (Flask)!')
    print('🎉 =================================')
    print(f'🌐 Server URL: http://localhost:{port}')
    print(f'📊 Initial Client Count: {len(clients)}')
    print(f'🤖 Initial Recommendations: {len(recommendations)}')
    print(f'💼 Available Portfolios: {len(portfolio_data)}')
    print(f'⏰ Started at: {datetime.now().isoformat()}')
    print('🎯 Ready for connections!')
    print('=================================\n')
    
    app.run(host='0.0.0.0', port=port, debug=debug)
