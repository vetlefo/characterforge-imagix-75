
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = vi.fn();

// Create a proper Response mock
const mockResponse = {
  body: null,
  status: 200,
  headers: new Headers(),
  ok: true,
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(""),
};

// Define mock Response constructor with all required methods
const MockResponse = vi.fn().mockImplementation((body, init) => {
  return {
    body,
    status: init?.status || 200,
    headers: new Headers(init?.headers),
    ok: init?.status ? init.status >= 200 && init.status < 300 : true,
    json: async () => JSON.parse(body),
    text: async () => body,
  };
});

// Assign it to global
global.Response = MockResponse as any;

// Add static methods to Response
global.Response.error = vi.fn().mockImplementation(() => {
  return new Response(null, { status: 500 });
});

global.Response.json = vi.fn().mockImplementation((data, init) => {
  return new Response(JSON.stringify(data), init);
});

global.Response.redirect = vi.fn().mockImplementation((url, status) => {
  return new Response(null, { 
    status: status || 302,
    headers: { Location: url.toString() }
  });
});
