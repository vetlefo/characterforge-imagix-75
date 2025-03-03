
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = vi.fn();

// Define mock Response constructor with all required methods
const mockResponseClass = vi.fn().mockImplementation((body, init) => {
  return {
    body,
    status: init?.status || 200,
    headers: new Headers(init?.headers),
    ok: init?.status ? init.status >= 200 && init.status < 300 : true,
    json: async () => JSON.parse(body),
    text: async () => body,
  };
});

// Add static methods to the mock Response
mockResponseClass.error = vi.fn().mockImplementation(() => {
  return new mockResponseClass(null, { status: 500 });
});

mockResponseClass.json = vi.fn().mockImplementation((data, init) => {
  return new mockResponseClass(JSON.stringify(data), init);
});

mockResponseClass.redirect = vi.fn().mockImplementation((url, status) => {
  return new mockResponseClass(null, { 
    status: status || 302,
    headers: { Location: url.toString() }
  });
});

// Assign the mock to global Response
global.Response = mockResponseClass as any;
