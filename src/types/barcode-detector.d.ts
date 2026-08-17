// Minimal ambient typing for the Barcode Detection API — not yet in
// TypeScript's DOM lib. Supported in Chrome/Edge/Android WebView; the
// scan flow feature-detects and falls back to manual entry elsewhere.
interface DetectedBarcode {
  rawValue: string;
}

declare class BarcodeDetector {
  constructor(options?: { formats?: string[] });
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
  static getSupportedFormats(): Promise<string[]>;
}

interface Window {
  BarcodeDetector?: typeof BarcodeDetector;
}
