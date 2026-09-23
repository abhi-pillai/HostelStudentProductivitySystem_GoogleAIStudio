import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  reportTitle?: string;
  studentName?: string;
  dateRangeStr?: string;
}

/**
 * Exports a specified DOM element to a professional PDF document.
 * Ensures high DPI rasterization, handles page breaks cleanly, and adds clean margins.
 */
export async function exportReportToPDF(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Export failed: element with id "${elementId}" not found.`);
    return false;
  }

  const filename = options.filename || `Hostel_Productivity_Report_${new Date().toISOString().split('T')[0]}.pdf`;

  // Temporarily adjust classes or styles to ensure pristine print styling
  const originalScrollTop = window.scrollY;

  try {
    // Generate high resolution canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for sharp text and vectors
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force light mode styling for printable PDF
          clonedElement.classList.remove('dark');
          clonedElement.style.color = '#1c1917';
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.width = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.padding = '24px';
          clonedElement.style.margin = '0 auto';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    // Leave 10mm margins on sides
    const margin = 10;
    const contentWidth = pdfPageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let positionY = margin;
    let pageNum = 1;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, positionY, contentWidth, contentHeight, undefined, 'FAST');
    heightLeft -= (pdfPageHeight - margin * 2);

    // If content exceeds 1 page, add subsequent pages with shifted vertical offset
    while (heightLeft > 0) {
      positionY = heightLeft - contentHeight + margin;
      pdf.addPage();
      pageNum++;
      pdf.addImage(imgData, 'PNG', margin, positionY, contentWidth, contentHeight, undefined, 'FAST');
      heightLeft -= (pdfPageHeight - margin * 2);
    }

    // Save PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: Trigger standard browser print if html2canvas/jsPDF encounters an issue
    window.print();
    return false;
  } finally {
    window.scrollTo(0, originalScrollTop);
  }
}
