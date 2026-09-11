import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export const PUBLIC_LOGO_URL = '';

/**
 * Converts an image URL to a clean base64 data URL via canvas/fetch.
 * This guarantees cross-origin compliance (CORS bypass for local assets)
 * and prevents html2canvas from failing or omitting images.
 */
export async function convertImageToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    // Fallback using an Image object drawn to an offscreen canvas
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 200;
          canvas.height = img.naturalHeight || img.height || 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
            return;
          }
        } catch {
          // Ignored
        }
        resolve(url);
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }
}

/**
 * Helper function that forces all image elements (and background-image watermarks)
 * within a certificate/document container to resolve to the public asset URL,
 * configures cross-origin policies ('anonymous' & 'no-referrer'), pre-loads them,
 * and caches them as base64 data URLs before triggering html2canvas.
 *
 * Returns a restoration/cleanup function to be called in a finally block.
 */
export async function forceResolvePublicAssets(element: HTMLElement): Promise<() => void> {
  const images = Array.from(element.querySelectorAll('img'));
  const allElements = Array.from(element.querySelectorAll('*')) as HTMLElement[];
  const originalImgStates: Array<{ img: HTMLImageElement; src: string; crossOrigin: string | null }> = [];
  const originalBgStates: Array<{ el: HTMLElement; bgImage: string }> = [];

  // 1. Process <img> elements
  const imgPromises = images.map(async (img) => {
    const origSrc = img.getAttribute('src') || img.src;
    const origCrossOrigin = img.getAttribute('crossorigin');
    originalImgStates.push({ img, src: origSrc, crossOrigin: origCrossOrigin });

    // Handle crossOrigin & referrer policies
    img.crossOrigin = 'anonymous';
    img.setAttribute('crossorigin', 'anonymous');
    img.setAttribute('referrerpolicy', 'no-referrer');

    // Resolve target src for image (custom logo, remote url, or fallback asset)
    let targetSrc = origSrc;
    if (!targetSrc && PUBLIC_LOGO_URL) {
      targetSrc = PUBLIC_LOGO_URL;
    }

    try {
      if (targetSrc && !targetSrc.startsWith('data:')) {
        // Convert to base64 Data URL to guarantee CORS and instant rendering in html2canvas
        const dataUrl = await convertImageToDataUrl(targetSrc);
        img.src = dataUrl;
      }
    } catch {
      img.src = targetSrc;
    }

    // Ensure image is fully decoded and ready
    if (!img.complete) {
      await new Promise((res) => {
        img.onload = res;
        img.onerror = res;
      });
    }
    try {
      if ('decode' in img) {
        await img.decode();
      }
    } catch {
      // Decode fallback
    }
  });

  // 2. Process elements with CSS background-image (such as 12% watermark containers)
  const bgPromises = allElements.map(async (el) => {
    const computedBg = window.getComputedStyle(el).backgroundImage;
    const inlineBg = el.style.backgroundImage;
    const currentBg = inlineBg || computedBg;

    if (currentBg && currentBg.includes('url(') && !currentBg.includes('data:')) {
      const match = currentBg.match(/url\(['"]?(.*?)['"]?\)/);
      if (match && match[1]) {
        const rawUrl = match[1];
        originalBgStates.push({ el, bgImage: inlineBg });

        let resolvedUrl = rawUrl;
        if (
          rawUrl.includes('logo') ||
          rawUrl.includes('jeevan_jyoti') ||
          rawUrl.startsWith('src/') ||
          rawUrl.startsWith('public/')
        ) {
          resolvedUrl = PUBLIC_LOGO_URL;
        }

        try {
          const dataUrl = await convertImageToDataUrl(resolvedUrl);
          el.style.backgroundImage = `url("${dataUrl}")`;
        } catch {
          el.style.backgroundImage = `url("${resolvedUrl}")`;
        }
      }
    }
  });

  await Promise.all([...imgPromises, ...bgPromises]);

  // Give the DOM a tiny frame to settle loaded bitmaps
  await new Promise((resolve) => requestAnimationFrame(resolve));

  // Return cleanup function to restore DOM state after capture
  return () => {
    originalImgStates.forEach(({ img, src, crossOrigin }) => {
      img.src = src;
      if (crossOrigin !== null) {
        img.setAttribute('crossorigin', crossOrigin);
      } else {
        img.removeAttribute('crossorigin');
      }
    });

    originalBgStates.forEach(({ el, bgImage }) => {
      el.style.backgroundImage = bgImage;
    });
  };
}

/**
 * Downloads an HTMLElement as a formatted PDF with full asset resolution & CORS handling.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string = 'jeevan-jyoti-document.pdf',
  orientation: 'p' | 'portrait' | 'l' | 'landscape' = 'portrait'
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  let cleanup: (() => void) | null = null;

  try {
    // 1. Force resolve all images to public URLs and data URLs for CORS safety
    cleanup = await forceResolvePublicAssets(element);

    // 2. Render to high-fidelity canvas with html2canvas
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
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

    // Detect or apply orientation
    const isPortrait = orientation === 'p' || orientation === 'portrait' || elemHeight > elemWidth;
    const pdfOrientation = isPortrait ? 'portrait' : 'landscape';

    const pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const elemAspect = elemWidth / elemHeight;

    const margin = 4;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    let renderWidth = usableWidth;
    let renderHeight = usableWidth / elemAspect;
    let offsetX = margin;
    let offsetY = margin + (usableHeight - renderHeight) / 2;

    if (renderHeight > usableHeight) {
      renderHeight = usableHeight;
      renderWidth = usableHeight * elemAspect;
      offsetX = margin + (usableWidth - renderWidth) / 2;
      offsetY = margin;
    }

    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save(finalFileName);
    return true;
  } catch (err) {
    console.warn('html2canvas PDF generation failed, attempting toPng fallback:', err);
    try {
      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true
      });

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(finalFileName);
      return true;
    } catch (fallbackErr) {
      console.error('All PDF export strategies failed:', fallbackErr);
      window.print();
      return false;
    }
  } finally {
    if (cleanup) cleanup();
  }
}

/**
 * Native print trigger
 */
export function triggerPrint(): void {
  window.print();
}

export default {
  forceResolvePublicAssets,
  convertImageToDataUrl,
  downloadElementAsPdf,
  triggerPrint,
  PUBLIC_LOGO_URL
};
