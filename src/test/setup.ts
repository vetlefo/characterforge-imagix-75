
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch API
global.fetch = vi.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: "OK",
    type: "basic" as ResponseType,
    url: "",
    clone: function() { return this; },
    body: null,
    bodyUsed: false
  })
);

global.Request = vi.fn();
global.Response = vi.fn().mockImplementation(() => ({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(""),
  blob: () => Promise.resolve(new Blob()),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  formData: () => Promise.resolve(new FormData()),
  headers: new Headers(),
  redirected: false,
  status: 200,
  statusText: "OK",
  type: "basic" as ResponseType,
  url: "",
  clone: function() { return this; },
  body: null,
  bodyUsed: false
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('React does not recognize the'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
