import React from 'react';
import ClientCard from './ClientCard.jsx';

export default function ClientList({ clients, loading, dataLoaded, onDeleteClient, onScheduleCall, onSendMessage }) {
  if (loading) {
    return <div className="alert alert-info py-2">Loading clients...</div>;
  }
  if (!clients.length) {
    // Distinguish between no data loaded yet vs filters produced zero
    return (
      <div className="alert alert-warning py-2">
        {dataLoaded ? 'No clients match your current filters/search.' : 'No client data loaded (backend unreachable & no fallback).'}
      </div>
    );
  }
  return (
    <div className="client-list overflow-auto" style={{ maxHeight: '70vh' }}>
      <div className="row g-3" style={{ minHeight: '200px' }}>
        {clients.map(c => (
          <div key={c.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <ClientCard
              client={c}
              onDelete={onDeleteClient}
              onScheduleCall={onScheduleCall}
              onSendMessage={onSendMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
