import { useMemo } from 'react';

export const useClientFiltering = (clients, query, filters) => {
  return useMemo(() => {
    let filtered = [...clients];

    // Text search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.segments.some(s => s.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.domicile.toLowerCase().includes(q) ||
        (c.riskProfile && c.riskProfile.toLowerCase().includes(q))
      );
    }

    // AUM range filter
    if (filters.minAUM) {
      filtered = filtered.filter(c => c.aum >= parseFloat(filters.minAUM));
    }
    if (filters.maxAUM) {
      filtered = filtered.filter(c => c.aum <= parseFloat(filters.maxAUM));
    }

    // Segments filter
    if (filters.segments && filters.segments.length > 0) {
      filtered = filtered.filter(c =>
        filters.segments.some(segment => c.segments.includes(segment))
      );
    }

    // Domiciles filter
    if (filters.domiciles && filters.domiciles.length > 0) {
      filtered = filtered.filter(c => filters.domiciles.includes(c.domicile));
    }

    // Risk profiles filter
    if (filters.riskProfiles && filters.riskProfiles.length > 0) {
      filtered = filtered.filter(c => filters.riskProfiles.includes(c.riskProfile));
    }

    // Sorting
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'aum':
          aVal = a.aum;
          bVal = b.aum;
          break;
        case 'domicile':
          aVal = a.domicile;
          bVal = b.domicile;
          break;
        case 'riskProfile':
          aVal = a.riskProfile;
          bVal = b.riskProfile;
          break;
        default: // name
          aVal = a.name;
          bVal = b.name;
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, query, filters]);
};

export const useSearchAnalytics = (originalClients, filteredClients) => {
  return useMemo(() => {
    const totalAUM = filteredClients.reduce((sum, c) => sum + c.aum, 0);
    const avgAUM = filteredClients.length > 0 ? totalAUM / filteredClients.length : 0;
    
    const riskDistribution = filteredClients.reduce((acc, c) => {
      acc[c.riskProfile] = (acc[c.riskProfile] || 0) + 1;
      return acc;
    }, {});

    const domicileDistribution = filteredClients.reduce((acc, c) => {
      acc[c.domicile] = (acc[c.domicile] || 0) + 1;
      return acc;
    }, {});

    const segmentDistribution = filteredClients.reduce((acc, c) => {
      c.segments.forEach(segment => {
        acc[segment] = (acc[segment] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalClients: filteredClients.length,
      totalAUM,
      avgAUM,
      riskDistribution,
      domicileDistribution,
      segmentDistribution,
      filterReduction: originalClients.length - filteredClients.length
    };
  }, [originalClients, filteredClients]);
};
