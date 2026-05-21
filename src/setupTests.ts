import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  (global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
    TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
    TextDecoder as unknown as typeof TextDecoder;
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}
