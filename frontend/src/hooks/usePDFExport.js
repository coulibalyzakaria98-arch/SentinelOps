import { useState, useCallback, useRef } from 'react';
import { pdfExport } from '../services/exportPDF';

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const elementRef = useRef(null);

  // Exporter le dashboard complet
  const exportDashboard = useCallback(async (filename = 'sentinelops-dashboard.pdf') => {
    if (!elementRef.current) {
      setError('Aucun élément à exporter');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress(10);

    try {
      const config = { orientation: 'landscape' }; // Default to landscape for dashboard
      const metadata = {
        documentType: 'Rapport de situation',
        generatedBy: 'SentinelOps Command Center',
        version: '1.0'
      };
      
      setProgress(30);
      
      // Create a temporary container for header/footer injection for export
      const exportContainer = document.createElement('div');
      exportContainer.style.backgroundColor = '#0F172A'; // Match dashboard background
      exportContainer.style.padding = '20px';
      exportContainer.style.color = 'white';

      // Inject header
      const header = pdfExport.createHeader(metadata);
      exportContainer.appendChild(header);

      // Clone the dashboard element to avoid modifying the original DOM
      const dashboardClone = elementRef.current.cloneNode(true);
      exportContainer.appendChild(dashboardClone);

      // Inject footer (will be handled by exportWithMetadata)
      const footer = pdfExport.createFooter(metadata);
      exportContainer.appendChild(footer);

      document.body.appendChild(exportContainer); // Append to body to allow html2canvas to render it

      setProgress(60);
      
      const result = await pdfExport.exportElement(
        exportContainer,
        filename,
        config
      );
      
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsExporting(false);
      }, 1000);
      
      return result;
      
    } catch (err) {
      setError(err.message);
      console.error('Dashboard Export error:', err);
      setIsExporting(false);
      setProgress(0);
      throw err;
    } finally {
      // Clean up the appended container
      if (exportContainer.parentNode) {
        document.body.removeChild(exportContainer);
      }
    }
  }, []); // Dependencies are empty as they don't change

  // Exporter avec options spécifiques
  const exportWithOptions = useCallback(async (options = {}) => {
    const {
      filename = 'sentinelops-report.pdf',
      orientation = 'landscape'
    } = options;

    if (!elementRef.current) {
      setError('Aucun élément à exporter');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress(10);
    
    try {
      const result = await pdfExport.exportElement(
        elementRef.current,
        filename,
        { orientation }
      );
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsExporting(false);
      }, 1000);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Export options error:', err);
      setIsExporting(false);
      setProgress(0);
      throw err;
    }
  }, []);

  // Exporter la carte uniquement
  const exportMapOnly = useCallback(async (mapElement, filename = 'crisis-map.pdf') => {
    if (!mapElement) {
      setError('Carte non trouvée');
      return;
    }
    setIsExporting(true);
    setError(null);
    setProgress(10);
    try {
      const result = await pdfExport.exportMap(mapElement, filename);
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsExporting(false);
      }, 1000);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Map Export error:', err);
      setIsExporting(false);
      setProgress(0);
      throw err;
    }
  }, []);

  return {
    elementRef,
    isExporting,
    progress,
    error,
    exportDashboard,
    exportWithOptions,
    exportMapOnly
  };
};
