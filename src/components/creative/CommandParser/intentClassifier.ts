
// Intent classification system for command parsing
// This module is responsible for classifying natural language instructions into structured intent objects

import { classifyCommand } from './domains';
import { extractParameters } from './parameterExtractor';

export type IntentType = 
  | 'draw.shape' | 'draw.line' | 'draw.text' | 'draw.image' | 'draw.general'
  | 'style.color' | 'style.typography' | 'style.layout' | 'style.size' | 'style.general'
  | 'animate.move' | 'animate.rotate' | 'animate.scale' | 'animate.fade' | 'animate.general'
  | 'website.layout' | 'website.navigation' | 'website.form' | 'website.content' | 'website.general'
  | 'media.extract' | 'media.generate' | 'media.transform' | 'media.general'
  | 'general.conversation';

export interface Intent {
  domain: string;         // e.g., 'drawing', 'styling', 'animation'
  type: IntentType;       // e.g., 'draw.shape', 'style.color', 'animate.bounce'
  parameters: Record<string, any>; // Extracted parameters like color, size, position
  confidence: number;     // 0-1 value indicating confidence in classification
  rawInput: string;       // Original input text
}

/**
 * Classifies a natural language instruction into a structured intent
 * @param input The text instruction to classify
 * @returns A structured Intent object with domain, type, parameters, and confidence
 */
export async function classifyIntent(input: string): Promise<Intent> {
  // Determine the domain (drawing, styling, animation, etc.)
  const domain = classifyCommand(input);
  
  // Extract intent type based on domain and input
  const type = determineIntentType(input, domain);
  
  // Extract parameters from the input
  const parameters = extractParameters(input);
  
  // Calculate confidence score
  const confidence = calculateConfidence(input, domain, type, parameters);
  
  return {
    domain,
    type,
    parameters,
    confidence,
    rawInput: input
  };
}

/**
 * Determines the specific intent type based on domain and input text
 */
function determineIntentType(input: string, domain: string): IntentType {
  const normalizedInput = input.toLowerCase();
  
  // Domain-specific intent type classification
  switch (domain) {
    case 'drawing':
      if (normalizedInput.includes('circle') || normalizedInput.includes('square') || 
          normalizedInput.includes('triangle') || normalizedInput.includes('rectangle') ||
          normalizedInput.includes('shape')) {
        return 'draw.shape';
      } else if (normalizedInput.includes('line') || normalizedInput.includes('path')) {
        return 'draw.line';
      } else if (normalizedInput.includes('text') || normalizedInput.includes('write')) {
        return 'draw.text';
      } else if (normalizedInput.includes('image') || normalizedInput.includes('picture')) {
        return 'draw.image';
      }
      return 'draw.general';
      
    case 'styling':
      if (normalizedInput.includes('color') || normalizedInput.includes('background') || 
          normalizedInput.includes('fill') || normalizedInput.includes('stroke')) {
        return 'style.color';
      } else if (normalizedInput.includes('font') || normalizedInput.includes('text')) {
        return 'style.typography';
      } else if (normalizedInput.includes('layout') || normalizedInput.includes('position') ||
                normalizedInput.includes('arrange')) {
        return 'style.layout';
      } else if (normalizedInput.includes('size') || normalizedInput.includes('dimension') ||
                normalizedInput.includes('scale')) {
        return 'style.size';
      }
      return 'style.general';
      
    case 'animation':
      if (normalizedInput.includes('move') || normalizedInput.includes('translate')) {
        return 'animate.move';
      } else if (normalizedInput.includes('rotate') || normalizedInput.includes('spin')) {
        return 'animate.rotate';
      } else if (normalizedInput.includes('scale') || normalizedInput.includes('grow') || 
                normalizedInput.includes('shrink')) {
        return 'animate.scale';
      } else if (normalizedInput.includes('fade') || normalizedInput.includes('opacity') ||
                normalizedInput.includes('transparent')) {
        return 'animate.fade';
      }
      return 'animate.general';
      
    case 'website':
      if (normalizedInput.includes('layout') || normalizedInput.includes('structure')) {
        return 'website.layout';
      } else if (normalizedInput.includes('navigation') || normalizedInput.includes('menu')) {
        return 'website.navigation';
      } else if (normalizedInput.includes('form') || normalizedInput.includes('input')) {
        return 'website.form';
      } else if (normalizedInput.includes('content') || normalizedInput.includes('text')) {
        return 'website.content';
      }
      return 'website.general';
      
    case 'media':
      if (normalizedInput.includes('extract') || normalizedInput.includes('get')) {
        return 'media.extract';
      } else if (normalizedInput.includes('generate') || normalizedInput.includes('create')) {
        return 'media.generate';
      } else if (normalizedInput.includes('transform') || normalizedInput.includes('convert')) {
        return 'media.transform';
      }
      return 'media.general';
      
    default:
      return 'general.conversation';
  }
}

/**
 * Calculates a confidence score for the classification based on various factors
 */
function calculateConfidence(
  input: string, 
  domain: string, 
  type: IntentType, 
  parameters: Record<string, any>
): number {
  let confidence = 0.5; // Base confidence
  
  // More specific intent types increase confidence
  if (type !== `${domain}.general` as IntentType) {
    confidence += 0.15;
  }
  
  // More parameters increase confidence
  const paramCount = Object.keys(parameters).length;
  confidence += Math.min(paramCount * 0.05, 0.2);
  
  // Longer input generally means more context, which can increase confidence
  // But very long inputs might be ambiguous
  const wordCount = input.split(/\s+/).length;
  if (wordCount >= 3 && wordCount <= 10) {
    confidence += 0.1;
  } else if (wordCount > 10) {
    confidence -= 0.05;
  }
  
  // Cap confidence between 0 and 1
  return Math.max(0, Math.min(confidence, 1));
}
