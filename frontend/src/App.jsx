import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientListPage from './pages/ClientListPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage_new.jsx';
import SuggestionDetailPage from './pages/SuggestionDetailPage.jsx';
import CallsPage from './pages/CallsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientListPage />} />
      <Route path="/calls" element={<CallsPage />} />
      <Route path="/clients/:clientId" element={<ClientDetailPage />} />
      <Route path="/clients/:clientId/suggestions/:suggestionId" element={<SuggestionDetailPage />} />
    </Routes>
  );
}