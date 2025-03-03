
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import CommandParser from './CommandParser';
import { classifyIntent } from './intentClassifier';

// Mock intent classification
vi.mock('./intentClassifier', () => ({
  classifyIntent: vi.fn().mockResolvedValue({
    domain: 'drawing',
    type: 'draw.shape',
    parameters: { shape: 'circle' },
    confidence: 0.9,
    rawInput: 'draw a circle'
  })
}));

describe('CommandParser Component', () => {
  it('should render the command input', () => {
    render(
      <CommandParser 
        instruction="Enter a command:"
        onParsed={() => {}}
        onClarificationNeeded={() => {}}
      />
    );
    
    expect(screen.getByPlaceholderText(/type your command/i)).toBeInTheDocument();
  });
  
  it('should handle command submission', async () => {
    const mockOnParsed = vi.fn();
    
    render(
      <CommandParser 
        instruction="Enter a command:"
        onParsed={mockOnParsed}
        onClarificationNeeded={() => {}}
      />
    );
    
    const input = screen.getByPlaceholderText(/type your command/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(input, { target: { value: 'draw a circle' } });
    fireEvent.click(submitButton);
    
    // Wait for the async operation to complete
    await vi.waitFor(() => {
      expect(classifyIntent).toHaveBeenCalledWith('draw a circle');
      expect(mockOnParsed).toHaveBeenCalled();
    });
    
    // Verify that the onParsed callback was called with the expected result
    expect(mockOnParsed).toHaveBeenCalledWith(expect.objectContaining({
      command: expect.objectContaining({
        domain: 'drawing',
        action: 'shape',
      }),
      confidence: 0.9,
      rawInput: 'draw a circle'
    }));
  });
  
  it('should handle confirmation when required', async () => {
    const mockOnParsed = vi.fn();
    
    render(
      <CommandParser 
        instruction="Enter a command:"
        onParsed={mockOnParsed}
        onClarificationNeeded={() => {}}
        requireConfirmation={true}
      />
    );
    
    const input = screen.getByPlaceholderText(/type your command/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(input, { target: { value: 'draw a circle' } });
    fireEvent.click(submitButton);
    
    // Wait for the confirmation dialog to appear
    await vi.waitFor(() => {
      expect(screen.getByText(/confirm action/i)).toBeInTheDocument();
    });
    
    // Confirm the command
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnParsed).toHaveBeenCalled();
  });
  
  it('should handle domain restrictions', async () => {
    const mockOnParsed = vi.fn();
    const mockOnClarificationNeeded = vi.fn();
    
    // Mock intent classification to return a domain that's not allowed
    (classifyIntent as any).mockResolvedValueOnce({
      domain: 'drawing',
      type: 'draw.shape',
      parameters: { shape: 'circle' },
      confidence: 0.9,
      rawInput: 'draw a circle'
    });
    
    render(
      <CommandParser 
        instruction="Enter a command:"
        onParsed={mockOnParsed}
        onClarificationNeeded={mockOnClarificationNeeded}
        allowedDomains={['styling', 'animation']}
      />
    );
    
    const input = screen.getByPlaceholderText(/type your command/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(input, { target: { value: 'draw a circle' } });
    fireEvent.click(submitButton);
    
    // Wait for the async operation to complete
    await vi.waitFor(() => {
      expect(mockOnClarificationNeeded).toHaveBeenCalled();
      expect(mockOnParsed).not.toHaveBeenCalled();
    });
  });
});
