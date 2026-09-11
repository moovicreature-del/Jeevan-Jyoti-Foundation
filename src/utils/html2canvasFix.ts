import { exportAsImage } from './exportImage';

/**
 * Universal certificate & card export utility with safe CSS color parsing
 * and print fallback.
 */
export async function captureAndDownload(
  elementId: string,
  fileName: string,
  options?: { scale?: number; backgroundColor?: string }
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for capture.`);
    return false;
  }

  return await exportAsImage(element, fileName, {
    pixelRatio: options?.scale || 2,
    backgroundColor: options?.backgroundColor || '#ffffff'
  });
}
