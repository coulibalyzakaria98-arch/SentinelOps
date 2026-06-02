import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Configuration par défaut
const DEFAULT_CONFIG = {
  scale: 2,           // Qualité d'image
  orientation: 'landscape',
  unit: 'mm',
  format: 'a4',
  quality: 0.95,
  logging: false
};

// Interface utilisateur
export class PDFExportService {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isExporting = false;
  }

  // Exporter un élément DOM en PDF
  async exportElement(element, filename = 'sentinelops-report.pdf', options = {}) {
    if (this.isExporting) {
      console.warn('Export already in progress');
      return null;
    }

    this.isExporting = true;

    try {
      const config = { ...this.config, ...options };
      
      // Ajouter une classe temporaire pour le style d'impression
      element.classList.add('pdf-export-mode');
      
      // Capturer l'élément
      const canvas = await html2canvas(element, {
        scale: config.scale,
        useCORS: true,
        logging: config.logging,
        backgroundColor: '#0F172A',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      // Supprimer la classe temporaire
      element.classList.remove('pdf-export-mode');
      
      // Créer le PDF
      const imgData = canvas.toDataURL('image/jpeg', config.quality);
      
      let pdf;
      if (config.orientation === 'landscape') {
        pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
      } else {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
      }
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      let finalHeight = pdfWidth * ratio;
      
      let position = 0;
      
      // Ajouter la première page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalHeight);
      
      // Si l'image dépasse une page, ajouter des pages supplémentaires
      while (finalHeight + position > pdfHeight) {
        position += pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -position, pdfWidth, finalHeight);
      }
      
      // Télécharger le PDF
      pdf.save(filename);
      
      return pdf;
      
    } catch (error) {
      console.error('PDF Export error:', error);
      throw error;
    } finally {
      this.isExporting = false;
    }
  }

  // Exporter avec métadonnées
  async exportWithMetadata(element, metadata, filename) {
    // Créer un conteneur temporaire avec en-tête
    const container = document.createElement('div');
    container.style.background = '#0F172A';
    container.style.padding = '20px';
    container.style.color = 'white';
    
    // Ajouter l'en-tête
    const header = this.createHeader(metadata);
    container.appendChild(header);
    
    // Cloner l'élément à exporter
    const clone = element.cloneNode(true);
    container.appendChild(clone);
    
    // Ajouter le footer
    const footer = this.createFooter(metadata);
    container.appendChild(footer);
    
    document.body.appendChild(container);
    
    const result = await this.exportElement(container, filename);
    
    document.body.removeChild(container);
    
    return result;
  }

  // Créer l'en-tête du PDF
  createHeader(metadata) {
    const header = document.createElement('div');
    header.style.marginBottom = '20px';
    header.style.borderBottom = '2px solid #3B82F6';
    header.style.paddingBottom = '15px';
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 24px; margin: 0; background: linear-gradient(135deg, #60A5FA, #3B82F6); -webkit-background-clip: text; background-clip: text; color: transparent;">
            SENTINELOPS
          </h1>
          <p style="font-size: 12px; color: #94A3B8; margin: 5px 0 0;">Centre de commandement unifié</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11px; color: #94A3B8;">Généré le: ${new Date().toLocaleString('fr-FR')}</p>
          <p style="font-size: 11px; color: #94A3B8;">Document: ${metadata.documentType || 'Rapport de situation'}</p>
        </div>
      </div>
    `;
    return header;
  }

  // Créer le footer du PDF
  createFooter(metadata) {
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.borderTop = '1px solid #334155';
    footer.style.paddingTop = '10px';
    footer.style.fontSize = '10px';
    footer.style.color = '#64748B';
    footer.style.textAlign = 'center';
    footer.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <span>SentinelOps - Système de réponse aux crises</span>
        <span>Page ${metadata.page || '1'} </span>
        <span>Confidentialité: Usage opérationnel</span>
      </div>
    `;
    return footer;
  }

  // Exporter la carte uniquement
  async exportMap(mapElement, filename = 'crisis-map.pdf') {
    return this.exportElement(mapElement, filename, { orientation: 'landscape' });
  }

  // Exporter les alertes
  async exportAlerts(alertsElement, filename = 'critical-alerts.pdf') {
    return this.exportElement(alertsElement, filename, { orientation: 'portrait' });
  }
}

export const pdfExport = new PDFExportService();

// Styles pour l'export PDF
export const pdfStyles = `
  @media\** print {
    body {
      background: #0F172A;
      color: #F8FAFC;
    }
    .no-print,
    .export-modal,
    button:not(.print-button) {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    .dashboard-card, .kpi-card, .alert-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
  
  .pdf-export-mode {
    background: #0F172A !important;
    padding: 20px !important;
  }
  
  .pdf-export-mode .chart-container {
    break-inside: avoid;
  }
  
  .pdf-export-mode .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
`;
