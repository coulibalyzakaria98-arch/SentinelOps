// API Service pour SentinelOps
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class SentinelOpsAPI {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  }

  // ========== REPORTS ==========
  async getReports(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/reports?${params}` : '/reports';
    return this.request(endpoint);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(formData) {
    const url = `${this.baseURL}/reports`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Ne pas ajouter Content-Type, fetch le gère automatiquement avec FormData
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('[API Error] Create report:', error);
      throw error;
    }
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, { method: 'DELETE' });
  }

  // ========== STATS ==========
  async getStats() {
    return this.request('/stats');
  }

  // ========== HEALTH ==========
  async health() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // ========== EXPORT ==========
  async exportReports(format = 'csv') {
    const url = `${this.baseURL}/export?format=${format}`;
    window.open(url, '_blank');
  }

  // Compatibilité avec le code existant qui attend reportApi
  get getAll() { return this.getReports; }
  get submit() { return this.createReport; }
  get getClusters() { 
    return async () => {
      const res = await this.request('/reports/clusters');
      return res.success ? res.data : [];
    };
  }
}

export const api = new SentinelOpsAPI();
export const reportApi = api; // Alias pour compatibilité
export default api;
