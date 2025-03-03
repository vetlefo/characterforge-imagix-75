
import { Command, ParsedCommand, commonActions } from './types';
import { CommandDomain, classifyCommand, domainKeywords } from './domains';
import { extractParameters, ExtractedParameters } from './parameterExtractor';

// Function to parse a natural language instruction into a structured command
export function parseInstruction(instruction: string): Command {
  // Start with basic command structure
  const parsedCommand: ParsedCommand = {
    instruction,
    action: '',
    subject: '',
    domain: 'general',
    parameters: {},
    confidence: 0,
    requiresConfirmation: false,
    confirmed: false
  };
  
  // 1. Classify the domain
  const domain = classifyCommand(instruction);
  parsedCommand.domain = domain;
  
  // 2. Extract action and subject
  const { action, subject, confidence } = extractActionAndSubject(instruction, domain);
  parsedCommand.action = action;
  parsedCommand.subject = subject;
  parsedCommand.confidence = confidence;
  
  // 3. Extract parameters
  parsedCommand.parameters = extractParameters(instruction);
  
  // 4. Determine if confirmation is needed (low confidence)
  parsedCommand.requiresConfirmation = confidence < 0.7;
  
  // 5. Create domain-specific command
  return enhanceCommandWithDomainSpecifics(parsedCommand);
}

// Function to extract the action and subject from an instruction
function extractActionAndSubject(
  instruction: string, 
  domain: CommandDomain
): { action: string; subject: string; confidence: number } {
  const words = instruction.toLowerCase().split(/\s+/);
  let action = '';
  let subject = '';
  let confidence = 0;
  
  // Look for common actions
  for (const word of words) {
    if (commonActions.includes(word)) {
      action = word;
      break;
    }
  }
  
  // If no common action found, use the first verb as action
  if (!action) {
    // Simple verb detection (could be enhanced with NLP)
    const verbPatterns = [
      /\b(\w+)ing\b/, // Creating, drawing, etc.
      /\b(\w+)ed\b/, // Created, moved, etc.
      /\b(\w+)s\b/ // Draws, moves, etc.
    ];
    
    for (const pattern of verbPatterns) {
      const match = instruction.match(pattern);
      if (match && match[1]) {
        action = match[1];
        break;
      }
    }
    
    // Fallback to domain-specific default action
    if (!action) {
      switch (domain) {
        case 'drawing': action = 'draw'; break;
        case 'styling': action = 'style'; break;
        case 'animation': action = 'animate'; break;
        case 'website': action = 'create'; break;
        default: action = 'create';
      }
    }
  }
  
  // Extract subject based on domain keywords
  const domainSpecificWords = domainKeywords[domain];
  
  for (const word of words) {
    if (domainSpecificWords.includes(word) && word !== action) {
      subject = word;
      confidence += 0.3; // Increase confidence when subject matches domain
      break;
    }
  }
  
  // If no subject found, guess based on common patterns
  if (!subject) {
    // Look for noun phrases after action words
    const actionIndex = words.findIndex(w => w === action);
    if (actionIndex >= 0 && actionIndex < words.length - 1) {
      subject = words[actionIndex + 1];
    } else {
      // Fallback to a generic subject
      subject = 'element';
    }
  }
  
  // Calculate confidence based on clarity of parsing
  confidence += action ? 0.4 : 0.1;
  confidence += subject ? 0.3 : 0.1;
  
  // Cap confidence
  confidence = Math.min(confidence, 1.0);
  
  return { action, subject, confidence };
}

// Function to enhance a base command with domain-specific details
function enhanceCommandWithDomainSpecifics(command: ParsedCommand): Command {
  const { domain, parameters } = command;
  
  switch (domain) {
    case 'drawing':
      // Enhanced drawing parameters
      const drawingParams: any = { ...parameters };
      
      // Detect brush type
      if (command.instruction.includes('spray')) {
        drawingParams.brushType = 'spray';
      } else if (command.instruction.includes('eraser') || command.instruction.includes('erase')) {
        drawingParams.brushType = 'eraser';
      } else {
        drawingParams.brushType = 'pencil';
      }
      
      // Detect drawing mode
      if (parameters.shapes) {
        if (parameters.shapes.includes('circle')) {
          drawingParams.drawingMode = 'circle';
        } else if (parameters.shapes.includes('rectangle') || parameters.shapes.includes('square')) {
          drawingParams.drawingMode = 'rectangle';
        } else if (parameters.shapes.includes('line')) {
          drawingParams.drawingMode = 'line';
        }
      }
      
      return {
        ...command,
        domain: 'drawing',
        parameters: drawingParams
      };
      
    case 'styling':
      // Enhanced styling parameters
      const stylingParams: any = { ...parameters };
      
      // Extract font-related information
      if (command.instruction.includes('font')) {
        // Simple pattern matching for font family
        const fontFamilyMatch = command.instruction.match(/font\s+(?:to|as)\s+([a-zA-Z\s]+)/i);
        if (fontFamilyMatch && fontFamilyMatch[1]) {
          stylingParams.fontFamily = fontFamilyMatch[1].trim();
        }
        
        // Extract font size if present
        if (parameters.sizes && parameters.sizes.length > 0) {
          stylingParams.fontSize = parameters.sizes[0];
        }
      }
      
      // Extract text alignment
      if (command.instruction.includes('align')) {
        if (command.instruction.includes('left')) {
          stylingParams.textAlign = 'left';
        } else if (command.instruction.includes('center')) {
          stylingParams.textAlign = 'center';
        } else if (command.instruction.includes('right')) {
          stylingParams.textAlign = 'right';
        } else if (command.instruction.includes('justify')) {
          stylingParams.textAlign = 'justify';
        }
      }
      
      return {
        ...command,
        domain: 'styling',
        parameters: stylingParams
      };
      
    case 'animation':
      // Enhanced animation parameters
      const animationParams: any = { ...parameters };
      
      // Extract duration
      if (parameters.timing && parameters.timing.length > 0) {
        const durationMatch = parameters.timing[0].match(/(\d+(?:\.\d+)?)\s*(s|ms)?/);
        if (durationMatch) {
          const value = parseFloat(durationMatch[1]);
          const unit = durationMatch[2] || 's';
          animationParams.duration = unit === 'ms' ? value / 1000 : value;
        }
      }
      
      // Extract easing
      const easingTerms = [
        'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 
        'bounce', 'elastic', 'cubic'
      ];
      
      for (const term of easingTerms) {
        if (command.instruction.includes(term)) {
          animationParams.easing = term;
          break;
        }
      }
      
      // Extract repeat
      if (command.instruction.includes('infinite') || command.instruction.includes('forever')) {
        animationParams.repeat = 'infinite';
      } else {
        const repeatMatch = command.instruction.match(/repeat\s+(\d+)\s+times/i);
        if (repeatMatch && repeatMatch[1]) {
          animationParams.repeat = parseInt(repeatMatch[1], 10);
        }
      }
      
      return {
        ...command,
        domain: 'animation',
        parameters: animationParams
      };
      
    case 'website':
      // Enhanced website parameters
      const websiteParams: any = { ...parameters };
      
      // Detect viewport preference
      if (command.instruction.includes('mobile')) {
        websiteParams.viewport = 'mobile';
      } else if (command.instruction.includes('tablet')) {
        websiteParams.viewport = 'tablet';
      } else {
        websiteParams.viewport = 'desktop';
      }
      
      return {
        ...command,
        domain: 'website',
        parameters: websiteParams
      };
      
    default:
      return command;
  }
}

// Helper function to get an appropriate suggestion for ambiguous commands
export function getSuggestionForCommand(command: Command): string {
  const { domain, action, subject, parameters } = command;
  
  switch (domain) {
    case 'drawing':
      if (!subject) {
        return `What would you like to draw? (e.g., circle, rectangle)`;
      }
      if (!parameters.colors || parameters.colors.length === 0) {
        return `What color would you like to use?`;
      }
      return `I'll ${action} a ${parameters.colors?.[0] || ''} ${subject}. Is that correct?`;
      
    case 'styling':
      return `I'll update the styling to ${action} the ${subject}. Is that correct?`;
      
    case 'animation':
      return `I'll create an animation to ${action} the ${subject}. Is that correct?`;
      
    case 'website':
      return `I'll ${action} a website ${subject} for you. Is that correct?`;
      
    default:
      return `I'll try to ${action} ${subject}. Is that correct?`;
  }
}

// Function to generate a text description of what a command will do
export function describeCommand(command: Command): string {
  const { domain, action, subject, parameters } = command;
  
  let description = `Command: ${action} ${subject}\n`;
  description += `Domain: ${domain}\n`;
  
  if (parameters) {
    description += 'Parameters:\n';
    
    if (parameters.colors && parameters.colors.length > 0) {
      description += `- Colors: ${parameters.colors.join(', ')}\n`;
    }
    
    if (parameters.sizes && parameters.sizes.length > 0) {
      description += `- Sizes: ${parameters.sizes.join(', ')}\n`;
    }
    
    if (parameters.positions && parameters.positions.length > 0) {
      description += `- Positions: ${parameters.positions.join(', ')}\n`;
    }
    
    if (parameters.shapes && parameters.shapes.length > 0) {
      description += `- Shapes: ${parameters.shapes.join(', ')}\n`;
    }
    
    if (parameters.timing && parameters.timing.length > 0) {
      description += `- Timing: ${parameters.timing.join(', ')}\n`;
    }
    
    if (parameters.numbers && parameters.numbers.length > 0) {
      description += `- Numbers: ${parameters.numbers.join(', ')}\n`;
    }
    
    // Domain-specific parameters
    switch (domain) {
      case 'drawing':
        if ('brushType' in parameters) {
          description += `- Brush Type: ${parameters.brushType}\n`;
        }
        if ('drawingMode' in parameters) {
          description += `- Drawing Mode: ${parameters.drawingMode}\n`;
        }
        break;
        
      case 'styling':
        if ('fontFamily' in parameters) {
          description += `- Font Family: ${parameters.fontFamily}\n`;
        }
        if ('fontSize' in parameters) {
          description += `- Font Size: ${parameters.fontSize}\n`;
        }
        if ('textAlign' in parameters) {
          description += `- Text Alignment: ${parameters.textAlign}\n`;
        }
        break;
        
      case 'animation':
        if ('duration' in parameters) {
          description += `- Duration: ${parameters.duration}s\n`;
        }
        if ('easing' in parameters) {
          description += `- Easing: ${parameters.easing}\n`;
        }
        if ('repeat' in parameters) {
          description += `- Repeat: ${parameters.repeat}\n`;
        }
        break;
        
      case 'website':
        if ('viewport' in parameters) {
          description += `- Viewport: ${parameters.viewport}\n`;
        }
        break;
    }
  }
  
  return description;
}
