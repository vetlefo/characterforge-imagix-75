
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandParser from './CommandParser';
import { classifyCommand } from './domains';

// Mock domain classification
vi.mock('./domains', () => ({
  classifyCommand: vi.fn().mockReturnValue('drawing'),
  domainKeywords: {
    drawing: ['draw', 'sketch', 'paint'],
    styling: ['style', 'color', 'theme'],
    animation: ['animate', 'motion', 'move'],
    website: ['web', 'site', 'page'],
    general: ['help', 'show', 'create']
  }
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
  
  it('should handle command submission', () => {
    const mockOnParsed = vi.fn();
    
    render(
      <CommandParser 
        instruction="Enter a command:"
        onParsed={mockOnParsed}
        onClarificationNeeded={() => {}}
      />
    );
    
    const input = screen.getByPlaceholderText(/type your command/i);
    const submitButton = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'draw a circle' } });
    fireEvent.click(submitButton);
    
    expect(mockOnParsed).toHaveBeenCalled();
    expect(classifyCommand).toHaveBeenCalledWith('draw a circle');
  });
  
  it('should handle confirmation when required', () => {
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
    const submitButton = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'draw a circle' } });
    fireEvent.click(submitButton);
    
    // Check if confirmation dialog appears
    expect(screen.getByText(/confirm/i)).toBeInTheDocument();
    
    // Confirm the command
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnParsed).toHaveBeenCalled();
  });
});
