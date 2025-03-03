
import { Command, CommandDomain } from './types';

// Simplified version to avoid type errors
export const parseCommand = (input: string): Command | null => {
  // Remove extra spaces and convert to lowercase for easier parsing
  const normalizedInput = input.trim().toLowerCase();
  
  // Simple regex to extract action and subject
  const commandRegex = /^(create|update|delete|get|list|apply|generate|transform|extract|analyze|save|load|export)\s+([a-z\s]+)(?:\s+with\s+(.+))?$/i;
  const match = normalizedInput.match(commandRegex);
  
  if (match) {
    const action = match[1];
    const subject = match[2].trim();
    const paramStr = match[3] || '';
    
    // Simple parameters parsing
    const parameters: Record<string, any> = {};
    if (paramStr) {
      const paramPairs = paramStr.split(',');
      for (const pair of paramPairs) {
        const [key, value] = pair.split(':').map(s => s.trim());
        parameters[key] = value;
      }
    }
    
    return {
      domain: determineDomain(subject),
      action,
      subject,
      parameters,
      originalCommand: input
    };
  }
  
  return null;
};

// Simple domain determination based on subject keywords
const determineDomain = (subject: string): CommandDomain => {
  if (subject.includes('style') || subject.includes('color') || subject.includes('font')) {
    return 'style';
  } else if (subject.includes('animation') || subject.includes('animate')) {
    return 'animation';
  } else if (subject.includes('draw') || subject.includes('shape')) {
    return 'drawing';
  } else if (subject.includes('website') || subject.includes('page')) {
    return 'website';
  } else if (subject.includes('transform') || subject.includes('convert')) {
    return 'transform';
  } else {
    return 'general';
  }
};
