// API Configuration for AIVest Banking App
// This file centralizes all API endpoint configurations

// Production backend URL (your hosted Flask server on Render)
const PRODUCTION_API_URL = 'https://aivest-7otb.onrender.com';

// Development backend URL (local Flask server)
const DEVELOPMENT_API_URL = 'http://localhost:5000';

// Determine which API base URL to use
export const getApiBaseUrl = () => {
  // Check if running in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Use environment variable if provided, otherwise use production URL
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envApiUrl) {
    console.log('🌐 Using API URL from environment:', envApiUrl);
    return envApiUrl.trim();
  }
  
  // Default to production URL for hosted deployments
  const apiUrl = PRODUCTION_API_URL;
  console.log('🌐 Using production API URL:', apiUrl);
  return apiUrl;
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// API endpoint helpers
export const API_ENDPOINTS = {
  clients: '/api/clients',
  recommendations: '/api/recommendations',
  portfolios: '/api/portfolios',
  
  // Client-specific endpoints
  clientById: (id) => `/api/clients/${id}`,
  clientPortfolio: (id) => `/api/clients/${id}/portfolio`,
  clientRecommendations: (id) => `/api/clients/${id}/recommendations`,
  
  // Recommendation-specific endpoints
  recommendationDetail: (id) => `/api/recommendations/${id}/detail`,
  recommendationAction: (id) => `/api/recommendations/${id}/action`,
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Fetch helper with error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success: ${url}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${url}`, error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiRequest,
  getApiBaseUrl,
};
