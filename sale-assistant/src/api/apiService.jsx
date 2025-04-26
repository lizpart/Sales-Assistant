// api/apiService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  checkHealth: () => apiClient.get('/api/health'),
  
  // Authentication
  login: (credentials) => apiClient.post('/api/login', credentials),
  
  // Sales data
  getSalesInteractions: (params) => apiClient.get('/api/sales-interactions', { params }),
  getSalesInvoices: (params) => apiClient.get('/api/sales-invoices', { params }),
  getInvoiceItems: (invoiceId) => apiClient.get(`/api/invoice-items/${invoiceId}`),
  
  // Insights and recommendations
  getSalesInsights: () => apiClient.get('/api/sales-insights'),
  getProductRecommendations: (customerData) => apiClient.post('/api/recommend-products', customerData),
  getOptimalFollowUp: (customerId) => apiClient.get(`/api/optimal-follow-up?customer_id=${customerId}`),
  
  // AI-powered features
  analyzeObjections: (interactionData) => apiClient.post('/api/analyze-objections', interactionData),
  generateProposal: (proposalData) => apiClient.post('/api/generate-proposal', proposalData, {
    responseType: 'blob' // Important for file download
  }),
  
  // Product details
  getPumpDetails: (pumpData) => apiClient.post('/api/pump-details', pumpData)
};

export default apiService;