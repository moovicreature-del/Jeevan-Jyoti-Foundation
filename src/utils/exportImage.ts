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
 * Helper to safely extract image dimensions from data URL or element
 */
function getImageDimensions(
  dataUrl: string,
  element: HTMLElement,
  scale: number
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || (element.offsetWidth ? element.offsetWidth * scale : 1080),
        height: img.naturalHeight || (element.offsetHeight ? element.offsetHeight * scale : 1710)
      });
    };
    img.onerror = () => {
      resolve({
        width: element.offsetWidth ? element.offsetWidth * scale : 1080,
        height: element.offsetHeight ? element.offsetHeight * scale : 1710
      });
    };
    img.src = dataUrl;
  });
}

/**
 * Robust capture of any HTMLElement to high-resolution Image Data URL.
 * Uses html-to-image as PRIMARY strategy because it renders via SVG foreignObject in the browser's
 * native engine, which fully supports modern CSS features (like Tailwind v4's oklab/oklch colors).
 * This completely prevents html2canvas's "Attempting to parse an unsupported color function 'oklab'" crash.
 */
export async function captureElementToImageData(
  element: HTMLElement,
  options?: {
    format?: 'png' | 'jpeg';
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  }
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  const scale = options?.scale ?? 3;
  const quality = options?.quality ?? 0.98;
  const format = options?.format ?? 'jpeg';
  const bg = options?.backgroundColor ?? '#FFFFFF';

  let cleanup: (() => void) | null = null;

  // 1. Force resolve public image assets & ensure CORS accessibility
  try {
    cleanup = await forceResolvePublicAssets(element);
  } catch (err) {
    console.warn('Asset resolution warning:', err);
  }

  // 2. Primary Strategy: html-to-image (Native browser rendering, natively supports oklab/oklch)
  try {
    const config = {
      quality: quality,
      pixelRatio: scale,
      backgroundColor: bg,
      cacheBust: false,
      skipFonts: true,
      fontEmbedCSS: '',
      filter: (node: Node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return false;
        }
        return true;
      }
    };

    const dataUrl = format === 'png' 
      ? await toPng(element, config)
      : await toJpeg(element, config);

    const dims = await getImageDimensions(dataUrl, element, scale);
    return {
      dataUrl,
      width: dims.width,
      height: dims.height
    };
  } catch (h2iErr) {
    console.warn('html-to-image capture warning, attempting html2canvas fallback:', h2iErr);
  }

  // 3. Secondary Strategy: html2canvas fallback
  try {
    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: bg,
      useCORS: true,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      ignoreElements: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return true;
        }
        return false;
      }
    });

    const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', quality);
    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height
    };
  } catch (canvasErr) {
    console.error('All image capture methods failed for element:', canvasErr);
    return null;
  } finally {
    if (cleanup) cleanup();
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
  const result = await captureElementToImageData(element, {
    format: 'png',
    quality: options?.quality ?? 1.0,
    scale: options?.pixelRatio ?? 3,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('PNG download link trigger error:', err);
    return false;
  }
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
  const result = await captureElementToImageData(element, {
    format: 'jpeg',
    quality: options?.quality ?? 0.98,
    scale: options?.pixelRatio ?? 3,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('JPG download link trigger error:', err);
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
  const result = await captureElementToImageData(element, {
    format: 'jpeg',
    quality: options?.quality ?? 0.98,
    scale: options?.pixelRatio ?? 3,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const elemWidth = result.width;
    const elemHeight = result.height;
    
    // Auto-detect orientation if not forced
    const isPortrait = elemHeight > elemWidth;
    const orientation = options?.orientation && options.orientation !== 'auto'
      ? options.orientation
      : isPortrait ? 'portrait' : 'landscape';

    // Create A4 PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Preserve exact aspect ratio with crisp margins
    const elemAspect = elemWidth / elemHeight;

    // Margin for clean printing (4mm)
    const margin = 4;
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

    pdf.addImage(result.dataUrl, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save(finalFileName);
    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    return false;
  }
}

/**
 * High-Resolution Multi-Page PDF Export (e.g. Page 1: Front Side, Page 2: Back Side)
 */
export async function exportElementsAsMultiPagePdf(
  elements: (HTMLElement | null)[],
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const validElements = elements.filter((el): el is HTMLElement => el !== null);
  if (validElements.length === 0) return false;

  const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  try {
    let pdf: jsPDF | null = null;

    for (let i = 0; i < validElements.length; i++) {
      const element = validElements[i];
      const result = await captureElementToImageData(element, {
        format: 'jpeg',
        quality: options?.quality ?? 0.98,
        scale: options?.pixelRatio ?? 3,
        backgroundColor: options?.backgroundColor ?? '#FFFFFF'
      });

      if (!result) continue;

      const elemWidth = result.width;
      const elemHeight = result.height;
      const isPortrait = elemHeight > elemWidth;
      const orientation = options?.orientation && options.orientation !== 'auto'
        ? options.orientation
        : isPortrait ? 'portrait' : 'landscape';

      if (i === 0) {
        pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a4'
        });
      } else if (pdf) {
        pdf.addPage('a4', orientation);
      }

      if (!pdf) continue;

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const elemAspect = elemWidth / elemHeight;

      // Clean printing margin (6mm)
      const margin = 6;
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

      pdf.addImage(result.dataUrl, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
    }

    if (pdf) {
      pdf.save(finalFileName);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Multi-page PDF export failed:', err);
    return false;
  }
}

export const exportAsImage = exportElementAsPng;

