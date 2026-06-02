/**
 * 🛰️ SentinelOps SMS Protocol (RR_v1)
 * Optimized for low-bandwidth 2G/GSM networks in crisis zones.
 * Packs critical intelligence into < 160 characters.
 */

const DAMAGE_MAP = { 'minimal': 1, 'partial': 2, 'total': 3 };
const INFRA_MAP = { 'health': 'H', 'bridge': 'B', 'water': 'W', 'telecom': 'T', 'power': 'P', 'unknown': 'U' };

export const smsService = {
  /**
   * Encodes a report into a human-readable tactical SMS string.
   * Format: RR|[INFRA]|[DAMAGE]|[LAT]|[LNG]|[DESC]
   */
  encodeReport(data) {
    const infra = (data.infrastructure_type || 'unknown').toUpperCase();
    const damage = (data.damage_level || 'minimal').toUpperCase();
    const lat = parseFloat(data.latitude).toFixed(5);
    const lng = parseFloat(data.longitude).toFixed(5);
    const desc = (data.description || 'No desc').substring(0, 60);

    return `RR|${infra}|${damage}|${lat}|${lng}|${desc}`;
  },

  /**
   * Generates a native SMS URI for mobile dispatch.
   */
  generateSmsUri(data, phoneNumber = "+2250102030405") { // Example Ivorian emergency number
    const body = this.encodeReport(data);
    const encodedBody = encodeURIComponent(body);
    
    // Cross-platform SMS URI
    return `sms:${phoneNumber}?body=${encodedBody}`;
  },

  /**
   * Simulates a USSD code generation for ultra-low tech reporting.
   * Format: *123*DAM*INFRA*LAT*LNG#
   */
  generateUssdCode(data) {
    const damage = DAMAGE_MAP[data.damage_level] || 1;
    const infra = Object.keys(INFRA_MAP).indexOf(data.infrastructure_type) + 1;
    // USSD doesn't handle decimals well, so we multiply by 1000
    const lat = Math.round(data.latitude * 1000);
    const lng = Math.round(data.longitude * 1000);
    
    return `*123*${damage}*${infra}*${lat}*${lng}#`;
  }
};
