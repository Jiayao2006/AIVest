import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation.jsx';
import CallCalendar from '../components/CallCalendar.jsx';
import { sampleClients } from '../data/clients.js';

export default function CallsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduledCalls, setScheduledCalls] = useState(() => {
    const saved = localStorage.getItem('aivest-scheduled-calls');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [callStatus, setCallStatus] = useState('');

  // Load clients data
  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      console.log('🔄 CallsPage: Loading clients with enhanced logging...');
      
      try {
        console.log('📡 Fetching clients from:', 'http://localhost:5000/api/clients');
        const response = await fetch('http://localhost:5000/api/clients');
        
        console.log('📥 Response status:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API data received:', data.length, 'clients');
          
          // Map aum to portfolioValue for consistency
          const clientsWithPortfolioValue = data.map(client => ({
            ...client,
            portfolioValue: client.aum * 1000000 // Convert millions to actual value
          }));
          
          setClients(clientsWithPortfolioValue);
          console.log('💰 Portfolio values mapped from AUM');
        } else {
          throw new Error(`API responded with ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('❌ CallsPage fetch error:', error.message);
        console.log('🔄 Falling back to sample data...');
        
        // Enhanced sample data with portfolioValue
        const enhancedSampleData = sampleClients.map(client => ({
          ...client,
          portfolioValue: client.aum * 1000000 // Convert millions to actual value
        }));
        
        setClients(enhancedSampleData);
        console.log('📊 Sample data loaded with portfolio values:', enhancedSampleData.length, 'clients');
      } finally {
        setLoading(false);
        console.log('🏁 CallsPage client loading completed');
      }
    }
    loadClients();
  }, []);

  // Save scheduled calls to localStorage
  useEffect(() => {
    localStorage.setItem('aivest-scheduled-calls', JSON.stringify(scheduledCalls));
  }, [scheduledCalls]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.domicile.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.segments.some(segment => segment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInstantCall = (client) => {
    setCurrentCall(client);
    setCallStatus('connecting');
    
    // Open call interface in new popup window
    const callWindow = window.open(
      '',
      `call-${client.id}`,
      'width=1200,height=800,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
    );
    
    if (callWindow) {
      // Create the call interface HTML
      const callHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Call with ${client.name}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
          <style>
            body { 
              margin: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              height: 100vh;
              overflow: hidden;
            }
            .call-container {
              height: 100vh;
              display: flex;
              flex-direction: column;
              color: white;
            }
            .call-header {
              background: rgba(0,0,0,0.3);
              padding: 20px;
              text-align: center;
              border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .call-timer {
              font-size: 2rem;
              font-weight: bold;
              color: #00ff88;
              margin: 10px 0;
            }
            .call-content {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            .client-avatar {
              width: 150px;
              height: 150px;
              border-radius: 50%;
              background: rgba(255,255,255,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 4rem;
              margin-bottom: 20px;
              border: 3px solid rgba(255,255,255,0.3);
            }
            .call-controls {
              background: rgba(0,0,0,0.4);
              padding: 30px;
              text-align: center;
            }
            .control-btn {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border: none;
              margin: 0 15px;
              font-size: 1.5rem;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .control-btn.mute { background: #6c757d; color: white; }
            .control-btn.video { background: #007bff; color: white; }
            .control-btn.end { background: #dc3545; color: white; }
            .control-btn:hover { transform: scale(1.1); }
            .notes-section {
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
              padding: 20px;
              margin: 20px;
              backdrop-filter: blur(10px);
            }
            .notes-textarea {
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              border-radius: 8px;
              color: white;
              padding: 15px;
              width: 100%;
              min-height: 100px;
              resize: vertical;
            }
            .notes-textarea::placeholder { color: rgba(255,255,255,0.7); }
            .status-indicator {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #00ff88;
              animation: pulse 2s infinite;
              margin-right: 10px;
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          </style>
        </head>
        <body>
          <div class="call-container">
            <div class="call-header">
              <h3><i class="fas fa-phone status-indicator"></i>Connected to ${client.name}</h3>
              <div class="call-timer" id="timer">00:00</div>
              <small>Portfolio: $${((client.portfolioValue || client.aum * 1000000) || 0).toLocaleString()}</small>
            </div>
            
            <div class="call-content">
              <div class="client-avatar">
                <i class="fas fa-user"></i>
              </div>
              <h4>${client.name}</h4>
              <p>${client.phone || 'No phone number'}</p>
            </div>
            
            <div class="notes-section">
              <h6><i class="fas fa-sticky-note me-2"></i>Call Notes</h6>
              <textarea class="notes-textarea" id="callNotes" placeholder="Enter call notes here..."></textarea>
            </div>
            
            <div class="call-controls">
              <button class="control-btn mute" onclick="toggleMute()" id="muteBtn">
                <i class="fas fa-microphone"></i>
              </button>
              <button class="control-btn video" onclick="toggleVideo()" id="videoBtn">
                <i class="fas fa-video"></i>
              </button>
              <button class="control-btn end" onclick="endCall()">
                <i class="fas fa-phone-slash"></i>
              </button>
            </div>
          </div>
          
          <script>
            let startTime = Date.now();
            let isMuted = false;
            let isVideoOn = true;
            
            function updateTimer() {
              const elapsed = Date.now() - startTime;
              const minutes = Math.floor(elapsed / 60000);
              const seconds = Math.floor((elapsed % 60000) / 1000);
              document.getElementById('timer').textContent = 
                minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            }
            
            function toggleMute() {
              isMuted = !isMuted;
              const btn = document.getElementById('muteBtn');
              btn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
              btn.style.background = isMuted ? '#dc3545' : '#6c757d';
            }
            
            function toggleVideo() {
              isVideoOn = !isVideoOn;
              const btn = document.getElementById('videoBtn');
              btn.innerHTML = isVideoOn ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
              btn.style.background = isVideoOn ? '#007bff' : '#dc3545';
            }
            
            function endCall() {
              const duration = Math.floor((Date.now() - startTime) / 1000);
              const minutes = Math.floor(duration / 60);
              const seconds = duration % 60;
              const durationString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
              const notes = document.getElementById('callNotes').value;
              
              // Send data back to parent window
              if (window.opener) {
                window.opener.postMessage({
                  type: 'callEnded',
                  data: {
                    clientId: '${client.id}',
                    clientName: '${client.name}',
                    duration: durationString,
                    notes: notes,
                    startTime: new Date(startTime).toISOString()
                  }
                }, '*');
              }
              
              window.close();
            }
            
            // Update timer every second
            setInterval(updateTimer, 1000);
            
            // Handle window close
            window.addEventListener('beforeunload', function() {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'callEnded',
                  data: {
                    clientId: '${client.id}',
                    clientName: '${client.name}',
                    duration: '00:00',
                    notes: 'Call ended',
                    startTime: new Date(startTime).toISOString()
                  }
                }, '*');
              }
            });
          </script>
        </body>
        </html>
      `;
      
      callWindow.document.write(callHTML);
      callWindow.document.close();
      
      // Listen for messages from the popup
      const handleMessage = (event) => {
        if (event.data.type === 'callEnded') {
          handleEndCall(event.data.data);
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
    }
  };

  const handleEndCall = (callData) => {
    const callRecord = {
      id: Date.now().toString(),
      clientId: callData.clientId,
      clientName: callData.clientName,
      type: 'completed',
      startTime: callData.startTime,
      duration: callData.duration,
      notes: callData.notes || 'Call completed successfully',
      outcome: 'discussed_portfolio'
    };
    
    setScheduledCalls(prev => [...prev, callRecord]);
    setCurrentCall(null);
    setCallStatus('');
  };

  const handleRemoveSchedule = (scheduleId) => {
    console.log('\n🗑️ === DELETE SCHEDULE OPERATION ===');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('🆔 Schedule ID to delete:', scheduleId);
    console.log('📊 Current scheduled calls count:', scheduledCalls.length);
    
    // Find the call being deleted for logging
    const callToDelete = scheduledCalls.find(call => call.id === scheduleId);
    if (callToDelete) {
      console.log('📋 Call details being deleted:', {
        id: callToDelete.id,
        clientName: callToDelete.clientName,
        type: callToDelete.type,
        scheduledTime: callToDelete.scheduledTime,
        purpose: callToDelete.purpose
      });
    } else {
      console.warn('⚠️ Call not found with ID:', scheduleId);
    }
    
    // Remove the schedule
    const previousCount = scheduledCalls.length;
    setScheduledCalls(prev => {
      const newCalls = prev.filter(call => call.id !== scheduleId);
      console.log('✅ Schedule removed successfully');
      console.log('📊 Previous count:', previousCount, '→ New count:', newCalls.length);
      return newCalls;
    });
    
    console.log('💾 Schedule deletion completed');
    console.log('🔄 localStorage will be updated by useEffect');
    console.log('🏁 Delete operation finished\n');
  };

  const handleScheduleCall = (client) => {
    setSelectedClient(client);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = (scheduleData) => {
    const newCall = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      type: 'scheduled',
      scheduledTime: scheduleData.datetime,
      purpose: scheduleData.purpose,
      notes: scheduleData.notes,
      status: 'pending'
    };
    
    setScheduledCalls(prev => [...prev, newCall]);
    setShowScheduleModal(false);
    setSelectedClient(null);
  };

  const getTodaysCalls = () => {
    const today = new Date().toDateString();
    return scheduledCalls.filter(call => 
      call.type === 'scheduled' && 
      new Date(call.scheduledTime).toDateString() === today
    );
  };

  const getUpcomingCalls = () => {
    const today = new Date();
    return scheduledCalls.filter(call => 
      call.type === 'scheduled' && 
      new Date(call.scheduledTime) > today
    ).sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  };

  const getCallHistory = () => {
    return scheduledCalls.filter(call => call.type === 'completed')
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Navigation />
        <div className="container-fluid py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navigation />
      <div className="container-fluid py-4">
        
        {/* Current Call Interface */}
        {currentCall && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <span className="fw-bold">Active Call</span>
                </div>
                <span className={`badge ${callStatus === 'connected' ? 'bg-success' : 'bg-warning'}`}>
                  {callStatus === 'connecting' ? 'Connecting...' : 'Connected'}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-1">{currentCall.name}</h5>
                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {currentCall.domicile} • 
                    <i className="bi bi-currency-dollar ms-2 me-1"></i>
                    ${currentCall.aum}M AUM
                  </p>
                  <div className="d-flex gap-2">
                    {currentCall.segments.map((segment, index) => (
                      <span key={index} className="badge bg-secondary">{segment}</span>
                    ))}
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn btn-danger"
                    onClick={handleEndCall}
                    disabled={callStatus === 'connecting'}
                  >
                    <i className="bi bi-telephone-x me-2"></i>
                    End Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Client List for Calls */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">
                    <i className="bi bi-people-fill me-2 text-primary"></i>
                    Client Directory
                  </h5>
                  <div className="input-group" style={{ width: '250px' }}>
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light sticky-top">
                      <tr>
                        <th>Client</th>
                        <th>AUM</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <div>
                              <div className="fw-semibold">{client.name}</div>
                              <div className="small text-muted">{client.phone}</div>
                              <div className="small">
                                <span className="badge bg-light text-dark me-1">{client.domicile}</span>
                                <span className={`badge ${
                                  client.riskProfile === 'Conservative' ? 'bg-success' :
                                  client.riskProfile === 'Moderate' ? 'bg-warning' : 'bg-danger'
                                }`}>
                                  {client.riskProfile}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="fw-semibold">${client.aum}M</td>
                          <td>
                            <div className="btn-group-vertical gap-1">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleInstantCall(client)}
                                disabled={currentCall !== null}
                              >
                                <i className="bi bi-telephone me-1"></i>
                                Call Now
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleScheduleCall(client)}
                              >
                                <i className="bi bi-calendar-plus me-1"></i>
                                Schedule
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="col-lg-6">
            <CallCalendar 
              scheduledCalls={scheduledCalls}
              onCallSelect={(calls) => console.log('Selected calls:', calls)}
            />
          </div>
        </div>

        {/* Call Management Section */}
        <div className="row mt-4">
          <div className="col-lg-4">
            {/* Today's Calls */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">
                  <i className="bi bi-calendar-day me-2"></i>
                  Today's Calls
                </h6>
              </div>
              <div className="card-body">
                {getTodaysCalls().length === 0 ? (
                  <p className="text-muted mb-0">No calls scheduled for today</p>
                ) : (
                  getTodaysCalls().map((call) => (
                    <div key={call.id} className="border-bottom pb-2 mb-2 last:border-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-semibold">{call.clientName}</div>
                          <div className="small text-muted">
                            {new Date(call.scheduledTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="small text-primary">{call.purpose}</div>
                        </div>
                        <span className="badge bg-warning">Pending</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Upcoming Calls */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="bi bi-calendar-week me-2"></i>
                  Upcoming Calls
                </h6>
              </div>
              <div className="card-body">
                {getUpcomingCalls().length === 0 ? (
                  <p className="text-muted mb-0">No upcoming calls scheduled</p>
                ) : (
                  getUpcomingCalls().slice(0, 5).map((call) => (
                    <div key={call.id} className="border-bottom pb-2 mb-2 last:border-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{call.clientName}</div>
                          <div className="small text-muted">
                            {new Date(call.scheduledTime).toLocaleDateString()} at{' '}
                            {new Date(call.scheduledTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="small text-primary">{call.purpose}</div>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleRemoveSchedule(call.id)}
                          title="Delete Scheduled Call"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Call History */}
            <div className="card">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Call History
                </h6>
              </div>
              <div className="card-body">
                {getCallHistory().length === 0 ? (
                  <p className="text-muted mb-0">No call history available</p>
                ) : (
                  getCallHistory().slice(0, 5).map((call) => (
                    <div key={call.id} className="border-bottom pb-2 mb-2 last:border-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{call.clientName}</div>
                          <div className="small text-muted">
                            Duration: {call.duration}
                          </div>
                          <div className="small text-success">Completed</div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2">
                            {new Date(call.startTime).toLocaleDateString()}
                          </span>
                          <button 
                            className="btn btn-sm btn-outline-secondary opacity-50"
                            onClick={() => handleRemoveSchedule(call.id)}
                            title="Remove from History"
                            style={{ fontSize: '0.7rem' }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Call Modal */}
        {showScheduleModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Schedule Call with {selectedClient?.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowScheduleModal(false)}
                  ></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const datetime = `${formData.get('date')}T${formData.get('time')}`;
                  handleScheduleSubmit({
                    datetime,
                    purpose: formData.get('purpose'),
                    notes: formData.get('notes')
                  });
                }}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="time"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Purpose</label>
                      <select className="form-select" name="purpose" required>
                        <option value="">Select purpose...</option>
                        <option value="Portfolio Review">Portfolio Review</option>
                        <option value="Investment Discussion">Investment Discussion</option>
                        <option value="Risk Assessment">Risk Assessment</option>
                        <option value="Market Update">Market Update</option>
                        <option value="Client Check-in">Client Check-in</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notes (Optional)</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        rows="3"
                        placeholder="Additional notes for the call..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowScheduleModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-calendar-check me-2"></i>
                      Schedule Call
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
