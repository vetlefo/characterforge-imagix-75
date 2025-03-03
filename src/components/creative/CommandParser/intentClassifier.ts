import { CommandDomain, classifyCommand, domainKeywords } from './domains';
import { extractParameters } from './parameterExtractor';

// Types of intents that can be detected
export type IntentType = 
  // Drawing intents
  | 'draw.shape'
  | 'draw.line'
  | 'draw.erase'
  | 'draw.fill'
  
  // Styling intents
  | 'style.changeColor'
  | 'style.changeFont'
  | 'style.changeSpacing'
  | 'style.applyTheme'
  
  // Animation intents
  | 'animate.fadeIn'
  | 'animate.fadeOut'
  | 'animate.move'
  | 'animate.rotate'
  
  // Website intents
  | 'website.preview'
  | 'website.addSection'
  | 'website.editElement'
  | 'website.exportCode'
  
  // Transformation intents
  | 'transform.imageToAnimation'
  | 'transform.drawingToCode'
  | 'transform.styleExtraction'
  
  // Miscellaneous
  | 'conversation'
  | 'unknown';

// Intent structure
export interface Intent {
  domain: CommandDomain;
  type: IntentType;
  parameters: Record<string, any>;
  confidence: number;
  rawInput: string;
}

// Keywords for specific intent types
const intentKeywords: Record<IntentType, string[]> = {
  // Drawing intents
  'draw.shape': ['circle', 'square', 'rectangle', 'triangle', 'polygon', 'star', 'heart'],
  'draw.line': ['line', 'curve', 'path', 'arrow', 'connector', 'stroke'],
  'draw.erase': ['erase', 'delete', 'remove', 'clear'],
  'draw.fill': ['fill', 'color', 'paint', 'shade', 'tint'],
  
  // Styling intents
  'style.changeColor': ['color', 'hue', 'shade', 'tint', 'palette', 'theme color'],
  'style.changeFont': ['font', 'typeface', 'typography', 'text style', 'serif', 'sans-serif'],
  'style.changeSpacing': ['spacing', 'margin', 'padding', 'gap', 'distance', 'layout'],
  'style.applyTheme': ['theme', 'style guide', 'design system', 'look and feel'],
  
  // Animation intents
  'animate.fadeIn': ['fade in', 'appear', 'show', 'reveal', 'opacity'],
  'animate.fadeOut': ['fade out', 'disappear', 'hide', 'vanish'],
  'animate.move': ['move', 'translate', 'shift', 'position', 'slide'],
  'animate.rotate': ['rotate', 'spin', 'turn', 'pivot', 'angle'],
  
  // Website intents
  'website.preview': ['preview', 'view', 'show', 'display', 'render'],
  'website.addSection': ['add section', 'new section', 'create section', 'insert'],
  'website.editElement': ['edit element', 'modify', 'change', 'update', 'adjust'],
  'website.exportCode': ['export', 'code', 'html', 'css', 'download', 'save as'],
  
  // Transformation intents
  'transform.imageToAnimation': ['animate image', 'make it move', 'bring to life', 'add motion'],
  'transform.drawingToCode': ['convert to code', 'generate html', 'code from drawing', 'export as html'],
  'transform.styleExtraction': ['extract style', 'get colors', 'capture design', 'identify theme'],
  
  // Miscellaneous
  'conversation': ['hello', 'hi', 'help', 'thanks', 'question', 'explain'],
  'unknown': []
};

/**
 * Analyzes input text to determine the specific creative intent
 * @param input The user's input text
 * @returns A structured Intent object
 */
export function classifyIntent(input: string): Intent {
  // Normalize the input
  const normalizedInput = input.toLowerCase().trim();
  
  // First determine the general domain
  const domain = classifyCommand(normalizedInput);
  
  // Get extracted parameters
  const parameters = extractParameters(normalizedInput);
  
  // Calculate scores for each intent type based on keyword matches
  const intentScores: Record<IntentType, number> = {} as Record<IntentType, number>;
  const intentTypes = Object.keys(intentKeywords) as IntentType[];
  
  for (const intentType of intentTypes) {
    // Skip intents from non-matching domains
    if (!intentMatchesDomain(intentType, domain) && domain !== 'general') {
      intentScores[intentType] = 0;
      continue;
    }
    
    // Calculate basic score based on keyword matches
    const keywords = intentKeywords[intentType];
    let score = keywords.filter(keyword => normalizedInput.includes(keyword)).length;
    
    // Boost score based on parameter matches
    score = adjustScoreBasedOnParameters(score, intentType, parameters);
    
    intentScores[intentType] = score;
  }
  
  // Sort intent types by score
  const sortedIntents = intentTypes
    .filter(type => intentScores[type] > 0)
    .sort((a, b) => intentScores[b] - intentScores[a]);
  
  // If no matches, return conversation or unknown intent
  if (sortedIntents.length === 0 || intentScores[sortedIntents[0]] === 0) {
    return {
      domain: 'general',
      type: isConversational(normalizedInput) ? 'conversation' : 'unknown',
      parameters,
      confidence: 0.3,
      rawInput: input
    };
  }
  
  // Calculate confidence between 0 and 1 based on score
  // Higher scores and bigger gap to second best score mean higher confidence
  const bestScore = intentScores[sortedIntents[0]];
  const secondBestScore = sortedIntents.length > 1 ? intentScores[sortedIntents[1]] : 0;
  const scoreDifference = bestScore - secondBestScore;
  
  // Base confidence on score and difference from next best match
  let confidence = Math.min(0.9, 0.5 + (bestScore / 10) * 0.3 + (scoreDifference / 5) * 0.2);
  
  return {
    domain,
    type: sortedIntents[0],
    parameters,
    confidence,
    rawInput: input
  };
}

/**
 * Checks if an intent type matches a given domain
 */
function intentMatchesDomain(intentType: IntentType, domain: CommandDomain): boolean {
  const intentDomain = intentType.split('.')[0];
  
  // Map intent domains to command domains
  const domainMap: Record<string, CommandDomain> = {
    'draw': 'drawing',
    'style': 'styling',
    'animate': 'animation',
    'website': 'website',
    'transform': 'general'
  };
  
  return domainMap[intentDomain] === domain;
}

/**
 * Adjusts intent score based on the presence of relevant parameters
 */
function adjustScoreBasedOnParameters(
  score: number, 
  intentType: IntentType, 
  parameters: Record<string, any>
): number {
  // Adjust score based on parameter matches
  if (intentType.startsWith('draw.') && parameters.shapes?.length > 0) {
    score += 2;
  }
  
  if (intentType.includes('Color') && parameters.colors?.length > 0) {
    score += 2;
  }
  
  if (intentType.startsWith('animate.') && parameters.timing?.length > 0) {
    score += 2;
  }
  
  if (intentType.includes('size') && parameters.sizes?.length > 0) {
    score += 2;
  }
  
  if (intentType.includes('move') && parameters.positions?.length > 0) {
    score += 2;
  }
  
  return score;
}

/**
 * Checks if input is conversational rather than a command
 */
function isConversational(input: string): boolean {
  const conversationalPhrases = [
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'help', 'how do', 'what is',
    'could you', 'please', 'explain', 'tell me', 'show me', 'question'
  ];
  
  return conversationalPhrases.some(phrase => input.includes(phrase));
}

/**
 * Maps creative intent to executable actions
 */
export function mapIntentToAction(intent: Intent): any {
  // Implementations will map intents to specific actions in the application
  // This is a placeholder for future implementation
  return {
    type: intent.type,
    payload: {
      ...intent.parameters,
      source: intent.rawInput
    }
  };
}