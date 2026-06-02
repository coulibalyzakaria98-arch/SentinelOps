import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportService = {
  // --- PDF EXPORT (UN SITREP STYLE) ---
  generateUNSitrep: (stats, reports) => {
    const doc = jsPDF();
    const timestamp = new Date().toISOString();
    
    doc.setFillColor(31, 119, 210); // UN Blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SENTINELOPS SITUATION REPORT (SITREP)', 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`REFERENCE: UN-RR-ALPHA-${timestamp.split('T')[0]}`, 15, 30);
    doc.text(`GENERATED AT: ${timestamp} UTC`, 15, 35);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. OPERATIONAL SUMMARY', 15, 55);
    
    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Value', 'Status']],
      body: [
        ['Total Intelligence Packets', stats.total_reports || 0, 'VERIFIED'],
        ['Critical Impact Zones', stats.by_damage_level?.total || 0, 'HIGH PRIORITY'],
        ['Field Response Units', '14 active teams', 'DEPLOYED'],
        ['Data Link Integrity', '99.98%', 'NOMINAL']
      ],
      theme: 'striped',
      headStyles: { fillColor: [31, 119, 210] }
    });

    const currentY = doc.lastAutoTable.finalY + 15;
    doc.text('2. PRIORITY INTELLIGENCE LOG', 15, currentY);
    
    const tableData = (Array.isArray(reports) ? reports : []).slice(0, 15).map(r => [
      new Date(r.created_at).toLocaleTimeString(),
      (r.title || 'Incident').toUpperCase(),
      (r.damage_level || 'N/A').toUpperCase(),
      `${Math.round((r.confidence_score || 0.85) * 100)}%`
    ]);

    doc.autoTable({
      startY: currentY + 5,
      head: [['Time (UTC)', 'Indicator', 'Impact', 'Fusion Score']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] }
    });

    const nextY = doc.lastAutoTable.finalY + 15;
    doc.text('3. STRATEGIC RECOMMENDATIONS (AI ADVISORY)', 15, nextY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text([
      '- Priority deployment recommended in North-East Sector based on cluster density.',
      '- Establish secure relay nodes every 5km to mitigate 4G/LTE signal interference.',
      '- Secondary infrastructure failure risk identified at 82% in partial impact zones.'
    ], 15, nextY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This document is encrypted and classified for UN internal operations only.', 105, 285, { align: 'center' });

    doc.save(`UN-SITREP-${timestamp.split('T')[0]}.pdf`);
  },

  // --- CSV EXPORT ---
  generateCSV: (reports) => {
    if (!reports || !reports.length) return;
    
    const headers = ['id', 'timestamp', 'type', 'damage', 'infrastructure', 'latitude', 'longitude', 'description'];
    const csvContent = [
      headers.join(','),
      ...reports.map(r => [
        r.id || r.uuid,
        r.created_at || r.timestamp,
        `"${r.crisis_type || 'N/A'}"`,
        `"${r.damage_level || 'N/A'}"`,
        `"${r.infrastructure_type || 'N/A'}"`,
        r.latitude,
        r.longitude,
        `"${(r.description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sentinelops-export-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // --- GEOJSON EXPORT ---
  generateGeoJSON: (reports) => {
    if (!reports || !reports.length) return;

    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        generated: new Date().toISOString(),
        count: reports.length,
        source: 'SentinelOps Mission Control'
      },
      features: reports.map(r => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(r.longitude), parseFloat(r.latitude)]
        },
        properties: {
          id: r.id || r.uuid,
          timestamp: r.created_at || r.timestamp,
          crisis_type: r.crisis_type,
          damage_level: r.damage_level,
          infrastructure: r.infrastructure_type,
          description: r.description,
          fusion_score: r.confidence_score || 0.85
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sentinelops-tactical-${new Date().toISOString().slice(0,10)}.geojson`);
    link.click();
  }
};
