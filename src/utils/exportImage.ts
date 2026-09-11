import html2canvas from 'html2canvas';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { forceResolvePublicAssets } from './printHelper';

export interface ExportOptions {
  backgroundColor?: string;
  quality?: number;
  pixelRatio?: number;
  orientation?: 'portrait' | 'landscape' | 'auto';
}

/**
 * Direct Print Helper - ensures colors and background graphics print accurately
 */
export function directPrintElement(elementIdOrRef?: HTMLElement | null): void {
  // Add print-ready class to ensure background colors & borders are rendered by printer
  document.body.classList.add('is-printing-certificate');
  
  try {
    window.print();
  } catch (err) {
    console.warn('Standard window.print() had an issue, attempting fallback print window:', err);
    if (elementIdOrRef) {
      fallbackPrintWindow(elementIdOrRef);
    }
  } finally {
    setTimeout(() => {
      document.body.classList.remove('is-printing-certificate');
    }, 1000);
  }
}

/**
 * Fallback print window for environments where standard iframe print may be restricted
 */
function fallbackPrintWindow(element: HTMLElement): void {
  try {
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Jeevan Jyoti Foundation - Official Certificate</title>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Great+Vibes&display=swap" />
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 10mm;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #fff;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .no-print { display: none !important; }
            @page {
              size: auto;
              margin: 5mm;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; max-width: 900px;">
            ${element.outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  } catch (e) {
    console.error('Fallback print window error:', e);
    window.print();
  }
}

/**
 * High-Resolution PNG Export (300 DPI)
 */
export async function exportElementAsPng(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  const bg = options?.backgroundColor ?? '#FFFFFF';
  const scale = options?.pixelRatio ?? 3; // 300 DPI crisp rendering
  let cleanup: (() => void) | null = null;

  // 1. Primary Strategy: html2canvas with asset force-resolution & CORS policy handling
  try {
    cleanup = await forceResolvePublicAssets(element);

    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: bg,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return true;
        }
        return false;
      }
    });

    const dataUrl = canvas.toDataURL('image/png', options?.quality ?? 1.0);
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (canvasErr) {
    console.warn('html2canvas PNG export failed, trying html-to-image fallback:', canvasErr);
  } finally {
    if (cleanup) cleanup();
  }

  // 2. Secondary Strategy: html-to-image
  try {
    const dataUrl = await toPng(element, {
      quality: options?.quality ?? 1.0,
      pixelRatio: scale,
      backgroundColor: bg,
      cacheBust: false,
      skipFonts: false,
      filter: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return false;
        }
        return true;
      }
    });

    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (htmlToImageErr) {
    console.error('html-to-image fallback failed:', htmlToImageErr);
  }

  return false;
}

/**
 * High-Resolution JPG Export (300 DPI, Photographic Quality)
 */
export async function exportElementAsJpg(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? fileName : `${fileName}.jpg`;
  const scale = options?.pixelRatio ?? 3; // 300 DPI high resolution
  const quality = options?.quality ?? 0.98;
  let cleanup: (() => void) | null = null;

  // 1. Primary Strategy: html2canvas with asset force-resolution & CORS policy handling
  try {
    cleanup = await forceResolvePublicAssets(element);

    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: '#FFFFFF',
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return true;
        }
        return false;
      }
    });

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.warn('html2canvas JPG export failed, trying fallback:', err);
  } finally {
    if (cleanup) cleanup();
  }

  // 2. Secondary Strategy: html-to-image toJpeg
  try {
    const dataUrl = await toJpeg(element, {
      quality: quality,
      pixelRatio: scale,
      backgroundColor: '#FFFFFF',
      filter: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return false;
        }
        return true;
      }
    });

    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (fallbackErr) {
    console.error('JPG export fallback failed:', fallbackErr);
    return false;
  }
}

/**
 * High-Resolution Vector-Wrapped PDF Export (A4 Precision Fit with Aspect Ratio Preservation)
 */
export async function exportElementAsPdf(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  let cleanup: (() => void) | null = null;

  try {
    cleanup = await forceResolvePublicAssets(element);

    const canvas = await html2canvas(element, {
      scale: 3, // 300 DPI high fidelity
      backgroundColor: '#FFFFFF',
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return true;
        }
        return false;
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const elemWidth = canvas.width;
    const elemHeight = canvas.height;
    
    // Auto-detect orientation if not forced
    const isPortrait = elemHeight > elemWidth;
    const orientation = options?.orientation && options.orientation !== 'auto'
      ? options.orientation
      : isPortrait ? 'portrait' : 'landscape';

    // Create A4 PDF (297mm x 210mm for Landscape, 210mm x 297mm for Portrait)
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Preserve exact aspect ratio with crisp margins
    const elemAspect = elemWidth / elemHeight;

    // Small margin for clean printing (3mm)
    const margin = 3;
    const usableWidth = pageWidth - (margin * 2);
    const usableHeight = pageHeight - (margin * 2);

    let renderWidth = usableWidth;
    let renderHeight = usableWidth / elemAspect;
    let offsetX = margin;
    let offsetY = margin + ((usableHeight - renderHeight) / 2);

    if (renderHeight > usableHeight) {
      renderHeight = usableHeight;
      renderWidth = usableHeight * elemAspect;
      offsetX = margin + ((usableWidth - renderWidth) / 2);
      offsetY = margin;
    }

    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save(finalFileName);
    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    return false;
  } finally {
    if (cleanup) cleanup();
  }
}

export const exportAsImage = exportElementAsPng;

