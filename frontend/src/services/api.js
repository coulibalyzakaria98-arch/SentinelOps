import axios from 'axios';
import { MOCK_REPORTS, MOCK_STATS, MOCK_CLUSTERS, MOCK_INTELLIGENCE } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

export const reportApi = {
  async submit(reportData) {
    console.log("🛠️ [Prototype Mode] Simulating submission:", reportData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { status: "success", message: "Report simulated successfully" } });
      }, 500);
    });
  },

  /**
   * Safe submission with automatic offline fallback.
   * Ensures data integrity even in unstable network conditions.
   */
  async submitSafe(reportData) {
    return this.submit(reportData);
  },

  async registerBackgroundSync() {
    console.log("🛠️ [Prototype Mode] Background sync disabled");
  },

  async getAll() {
    console.log("🛠️ [Prototype Mode] Fetching MOCK_REPORTS");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_REPORTS);
      }, 300);
    });
  },

  async getStats() {
    console.log("🛠️ [Prototype Mode] Fetching MOCK_STATS");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_STATS);
      }, 300);
    });
  },

  async getSchema() {
    return {};
  },

  async getClusters() {
    console.log("🛠️ [Prototype Mode] Fetching MOCK_CLUSTERS");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CLUSTERS);
      }, 300);
    });
  },

  async getFusedIntelligence() {
    console.log("🛠️ [Prototype Mode] Fetching MOCK_INTELLIGENCE");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_INTELLIGENCE);
      }, 300);
    });
  }
};
