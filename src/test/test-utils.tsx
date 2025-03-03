
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreativeContextProvider } from '../components/creative/CreativeContext';

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { route = '/', ...renderOptions } = options || {};

  // Set up window.location for the test
  window.history.pushState({}, 'Test page', route);

  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <CreativeContextProvider>
          {children}
        </CreativeContextProvider>
      </BrowserRouter>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data generators
export const createMockIntent = (overrides = {}) => ({
  domain: 'drawing',
  type: 'draw.shape',
  parameters: { shape: 'circle', color: 'blue' },
  confidence: 0.85,
  rawInput: 'Draw a blue circle',
  ...overrides
});

export const createMockGraphNode = (overrides = {}) => ({
  id: 'node-1',
  label: 'Test Node',
  type: 'asset',
  properties: {},
  ...overrides
});

export const createMockTranslationResult = (overrides = {}) => ({
  original: 'Draw a blue circle',
  intent: createMockIntent(),
  confidence: 0.85,
  alternativeIntents: [],
  parameters: { shape: 'circle', color: 'blue' },
  ...overrides
});
