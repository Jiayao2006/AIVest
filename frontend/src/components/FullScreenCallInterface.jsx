import React, { useState, useEffect } from 'react';

export default function FullScreenCallInterface({ client, isOpen, onClose, onEndCall }) {
  const [callStatus, setCallStatus] = useState('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [notes, setNotes] = useState('');

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Simulate call connection
  useEffect(() => {
    if (isOpen && callStatus === 'connecting') {
      const timer = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, callStatus]);

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    const callData = {
      clientId: client.id,
      clientName: client.name,
      duration: formatDuration(callDuration),
      startTime: new Date().toISOString(),
      notes: notes,
      status: 'completed'
    };
    onEndCall(callData);
    setCallDuration(0);
    setCallStatus('connecting');
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-flex flex-column" style={{ zIndex: 9999 }}>
      {/* Header */}
      <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className="bi bi-telephone-fill me-3 fs-4"></i>
          <div>
            <h5 className="mb-0">AIVest Call</h5>
            <small className="opacity-75">Secure Banking Communication</small>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-center">
            <div className="fs-5 fw-bold">{formatDuration(callDuration)}</div>
            <small className="opacity-75">Duration</small>
          </div>
          <span className={`badge fs-6 ${callStatus === 'connected' ? 'bg-success' : 'bg-warning'}`}>
            {callStatus === 'connecting' ? 'Connecting...' : 'Connected'}
          </span>
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={onClose}
            title="Minimize"
          >
            <i className="bi bi-dash-lg"></i>
          </button>
        </div>
      </div>

      {/* Main Call Area */}
      <div className="flex-grow-1 d-flex">
        {/* Video/Avatar Area */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-gradient" 
             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          
          {/* Client Info */}
          <div className="text-center text-white mb-4">
            <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style={{ width: '120px', height: '120px' }}>
              <i className="bi bi-person-fill" style={{ fontSize: '4rem', color: 'white' }}></i>
            </div>
            <h2 className="fw-bold mb-2">{client.name}</h2>
            <p className="mb-1 fs-5">
              <i className="bi bi-geo-alt me-2"></i>
              {client.domicile}
            </p>
            <p className="mb-3 fs-5">
              <i className="bi bi-currency-dollar me-2"></i>
              ${client.aum}M AUM
            </p>
            <div className="d-flex justify-content-center gap-2">
              {client.segments.map((segment, index) => (
                <span key={index} className="badge bg-white bg-opacity-20 text-white px-3 py-2">
                  {segment}
                </span>
              ))}
            </div>
          </div>

          {/* Call Status Indicator */}
          {callStatus === 'connecting' && (
            <div className="text-center text-white">
              <div className="spinner-border mb-3" role="status">
                <span className="visually-hidden">Connecting...</span>
              </div>
              <p className="fs-5">Connecting to {client.name}...</p>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="text-center text-white">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-success rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
                <span className="fs-5">Call in progress</span>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel - Call Notes */}
        <div className="bg-white border-start" style={{ width: '320px' }}>
          <div className="p-3 border-bottom bg-light">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-journal-text me-2"></i>
              Call Notes
            </h6>
          </div>
          <div className="p-3">
            <div className="mb-3">
              <label className="form-label small text-muted">Client Information</label>
              <div className="bg-light p-2 rounded small">
                <div><strong>Phone:</strong> {client.phone}</div>
                <div><strong>Risk Profile:</strong> {client.riskProfile}</div>
                <div><strong>Key Contacts:</strong> {client.keyContacts?.join(', ')}</div>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label small text-muted">Call Notes</label>
              <textarea
                className="form-control"
                rows="8"
                placeholder="Add notes about this call..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">Quick Actions</label>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Schedule Follow-up
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-envelope me-2"></i>
                  Send Summary Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-dark text-white p-4">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button 
            className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'} rounded-circle`}
            style={{ width: '60px', height: '60px' }}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'} fs-4`}></i>
          </button>

          <button 
            className={`btn ${isVideoOn ? 'btn-secondary' : 'btn-danger'} rounded-circle`}
            style={{ width: '60px', height: '60px' }}
            onClick={() => setIsVideoOn(!isVideoOn)}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            <i className={`bi ${isVideoOn ? 'bi-camera-video-fill' : 'bi-camera-video-off-fill'} fs-4`}></i>
          </button>

          <button 
            className="btn btn-danger rounded-circle"
            style={{ width: '80px', height: '80px' }}
            onClick={handleEndCall}
            disabled={callStatus === 'connecting'}
            title="End Call"
          >
            <i className="bi bi-telephone-x-fill fs-3"></i>
          </button>

          <button 
            className="btn btn-secondary rounded-circle"
            style={{ width: '60px', height: '60px' }}
            title="More options"
          >
            <i className="bi bi-three-dots fs-4"></i>
          </button>

          <button 
            className="btn btn-secondary rounded-circle"
            style={{ width: '60px', height: '60px' }}
            title="Share screen"
          >
            <i className="bi bi-display fs-4"></i>
          </button>
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-shield-check me-1"></i>
            End-to-end encrypted • Secure banking call
          </small>
        </div>
      </div>
    </div>
  );
}
