
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IntentTranslatorDemo from '../../pages/IntentTranslatorDemo';
import intentTranslator from '../../services/intentTranslator';

// Mock the intentTranslator service
vi.mock('../../services/intentTranslator', () => ({
  default: {
    translateIntent: vi.fn().mockImplementation(async (input) => ({
      original: input,
      intent: {
        domain: input.includes('draw') ? 'drawing' : 'general',
        type: input.includes('draw') ? 'draw.shape' : 'conversation',
        parameters: input.includes('circle') ? { shape: 'circle' } : {},
        confidence: 0.85
      },
      confidence: 0.85,
      alternativeIntents: [],
      parameters: input.includes('circle') ? { shape: 'circle' } : {}
    })),
    translateWithBestStrategy: vi.fn().mockImplementation(async (input) => ({
      original: input,
      intent: {
        domain: input.includes('draw') ? 'drawing' : 'general',
        type: input.includes('draw') ? 'draw.shape' : 'conversation',
        parameters: input.includes('circle') ? { shape: 'circle' } : {},
        confidence: 0.9
      },
      confidence: 0.9,
      alternativeIntents: [
        {
          intent: {
            domain: 'general',
            type: 'conversation',
            parameters: {},
            confidence: 0.4
          },
          confidence: 0.4
        }
      ],
      parameters: input.includes('circle') ? { shape: 'circle' } : {}
    })),
    getStrategies: vi.fn().mockReturnValue([
      { name: 'Pattern Matching' },
      { name: 'Context Aware' }
    ])
  }
}));

describe('Intent Translation Pipeline Integration', () => {
  it('should process user input and display translation results', async () => {
    render(
      <BrowserRouter>
        <IntentTranslatorDemo />
      </BrowserRouter>
    );
    
    // Find the input field and submit button
    const inputField = screen.getByPlaceholderText(/Type a command/i) || 
                        screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /translate/i });
    
    // Enter a command and submit
    fireEvent.change(inputField, { target: { value: 'draw a blue circle' } });
    fireEvent.click(submitButton);
    
    // Wait for the results to appear
    await waitFor(() => {
      expect(intentTranslator.translateIntent).toHaveBeenCalledWith('draw a blue circle', expect.anything());
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });
    
    // Check that the results are displayed correctly
    expect(screen.getByText(/drawing/i)).toBeInTheDocument();
    expect(screen.getByText(/draw\.shape/i)).toBeInTheDocument();
  });
  
  it('should allow switching between translation strategies', async () => {
    render(
      <BrowserRouter>
        <IntentTranslatorDemo />
      </BrowserRouter>
    );
    
    // Find strategy selection controls if they exist
    const strategySelector = screen.getByText(/translation strategy/i)?.closest('div')?.querySelector('select') ||
                             screen.getByRole('combobox');
    
    if (strategySelector) {
      // Switch to a different strategy
      fireEvent.change(strategySelector, { target: { value: 'Context Aware' } });
      
      // Enter and submit a command
      const inputField = screen.getByPlaceholderText(/Type a command/i) || 
                          screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /translate/i });
      
      fireEvent.change(inputField, { target: { value: 'draw a blue circle' } });
      fireEvent.click(submitButton);
      
      // Verify that the correct strategy was used
      await waitFor(() => {
        expect(intentTranslator.translateWithBestStrategy).toHaveBeenCalled();
      });
    }
  });
});
