import React from 'react';
import ClientCard from './ClientCard.jsx';

export default function ClientList({ clients }) {
  if (!clients.length) {
    return <div className="alert alert-warning">No clients match your search.</div>;
  }
  return (
    <div className="client-list overflow-auto" style={{ maxHeight: '70vh' }}>
      <div className="row g-3" style={{ minHeight: '200px' }}>
        {clients.map(c => (
          <div key={c.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <ClientCard client={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
