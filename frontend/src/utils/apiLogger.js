// API Logger utility for tracking backend connections and errors
class APILogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  log(type, endpoint, data = {}) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type, // 'request', 'success', 'error', 'fallback'
      endpoint,
      data,
      userAgent: navigator.userAgent.substring(0, 50)
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging with emojis
    const emoji = {
      request: '📤',
      success: '✅',
      error: '❌',
      fallback: '🔄'
    }[type] || '📝';

    console.log(`${emoji} [${type.toUpperCase()}] ${endpoint}`, data);
    
    // Store in localStorage for debugging
    try {
      localStorage.setItem('aivest-api-logs', JSON.stringify(this.logs.slice(0, 20)));
    } catch (e) {
      console.warn('Could not save logs to localStorage:', e.message);
    }
  }

  getLogs() {
    return this.logs;
  }

  getErrorLogs() {
    return this.logs.filter(log => log.type === 'error');
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('aivest-api-logs');
  }

  exportLogs() {
    const logsData = {
      exported: new Date().toISOString(),
      totalLogs: this.logs.length,
      errorCount: this.getErrorLogs().length,
      logs: this.logs
    };
    
    const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aivest-api-logs-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global instance
export const apiLogger = new APILogger();

// Enhanced fetch wrapper with automatic logging
export async function fetchWithLogging(endpoint, options = {}) {
  const fullUrl = endpoint.startsWith('http') ? endpoint : `http://localhost:5000${endpoint}`;
  
  apiLogger.log('request', endpoint, {
    method: options.method || 'GET',
    headers: options.headers,
    hasBody: !!options.body
  });

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.ok) {
      const data = await response.json();
      apiLogger.log('success', endpoint, {
        status: response.status,
        dataLength: Array.isArray(data) ? data.length : 'object'
      });
      return { data, response };
    } else {
      const errorText = await response.text();
      apiLogger.log('error', endpoint, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    apiLogger.log('error', endpoint, {
      error: error.message,
      type: error.constructor.name
    });
    throw error;
  }
}

// Debug panel component (for development)
export function DebugPanel() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...apiLogger.getLogs()]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999
        }}
      >
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer'
          }}
          title="Open Debug Panel"
        >
          🔍
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '300px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        zIndex: 9999,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <div 
        style={{
          background: '#f8f9fa',
          padding: '10px',
          borderBottom: '1px solid #ccc',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <strong>🔍 API Debug Panel</strong>
        <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'none' }}>✕</button>
      </div>
      <div style={{ padding: '10px', height: '200px', overflow: 'auto', fontSize: '12px' }}>
        {logs.slice(0, 10).map(log => (
          <div key={log.id} style={{ marginBottom: '5px', padding: '5px', background: log.type === 'error' ? '#ffebee' : '#f0f0f0' }}>
            <strong>{log.type}</strong> {log.endpoint}
            <br />
            <small>{new Date(log.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
        <button onClick={() => apiLogger.exportLogs()} style={{ marginRight: '10px' }}>Export Logs</button>
        <button onClick={() => apiLogger.clearLogs()}>Clear Logs</button>
      </div>
    </div>
  );
}

export default apiLogger;
