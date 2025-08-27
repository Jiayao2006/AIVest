import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientListPage from './pages/ClientListPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage.jsx';
import SuggestionDetailPage from './pages/SuggestionDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientListPage />} />
      <Route path="/clients/:clientId" element={<ClientDetailPage />} />
      <Route path="/clients/:clientId/suggestions/:suggestionId" element={<SuggestionDetailPage />} />
    </Routes>
  );
}
