
import { GraphNode, GraphConnection } from "./graphDB";

// Define interfaces and types
export interface GraphQuery {
  keyword?: string;
  domain?: string;
  nodeType?: string;
  connections?: {
    type?: string;
    target?: string;
  }[];
}

export type IntentType = "drawing" | "styling" | "animation" | "transform" | "ui" | "unknown";

export interface Intent {
  type: IntentType;
  domain: string;
  action: string;
  params?: Record<string, any>;
}

export interface TranslationResult {
  success: boolean;
  originalInput: string;
  intent?: Intent;
  confidence: number;
  actions?: { type: string; payload: any }[];
  metadata?: Record<string, any>;
  relatedNodes?: GraphNode[];
  explanation?: string;
}

export interface TranslationContext {
  recentIntents: Intent[];
  userPreferences?: Record<string, any>;
  projectContext?: {
    currentDomain?: string;
    recentAssets?: string[];
  };
}

// Abstract strategy class
export abstract class TranslationStrategy {
  abstract translate(input: string, context?: TranslationContext): TranslationResult;
  abstract name: string;
}

// Pattern matching strategy implementation
export class PatternMatchingStrategy extends TranslationStrategy {
  name = "pattern-matching";

  translate(input: string, context?: TranslationContext): TranslationResult {
    // Simple pattern matching implementation
    const drawingPatterns = [
      /\bdraw\b/i, /\bsketch\b/i, /\bcreate\s+(?:a|an)\s+image\b/i
    ];
    
    const stylingPatterns = [
      /\bstyle\b/i, /\bdesign\b/i, /\bcolor\b/i, /\btheme\b/i
    ];
    
    const animationPatterns = [
      /\banimate\b/i, /\bmotion\b/i, /\bmove\b/i
    ];
    
    const transformPatterns = [
      /\btransform\b/i, /\bconvert\b/i, /\bchange\b/i
    ];
    
    const uiPatterns = [
      /\bbutton\b/i, /\binterface\b/i, /\bui\b/i, /\bux\b/i
    ];
    
    const conversations = [
      /\bhello\b/i, /\bhi\b/i, /\bhey\b/i, /\bgreetings\b/i, /\bhow are you\b/i
    ];

    // Determine intent type based on patterns
    let intentType: IntentType = "unknown";
    let confidence = 0.0;
    
    if (drawingPatterns.some(pattern => pattern.test(input))) {
      intentType = "drawing";
      confidence = 0.7;
    } else if (stylingPatterns.some(pattern => pattern.test(input))) {
      intentType = "styling";
      confidence = 0.7;
    } else if (animationPatterns.some(pattern => pattern.test(input))) {
      intentType = "animation";
      confidence = 0.7;
    } else if (transformPatterns.some(pattern => pattern.test(input))) {
      intentType = "transform";
      confidence = 0.7;
    } else if (uiPatterns.some(pattern => pattern.test(input))) {
      intentType = "ui";
      confidence = 0.7;
    } else if (conversations.some(pattern => pattern.test(input))) {
      intentType = "unknown";
      confidence = 0.5;
    }
    
    // Build result
    return {
      success: intentType !== "unknown",
      originalInput: input,
      intent: intentType !== "unknown" ? {
        type: intentType,
        domain: intentType,
        action: "create",
        params: {}
      } : undefined,
      confidence: confidence
    };
  }
}

// Context-aware strategy implementation
export class ContextAwareStrategy extends TranslationStrategy {
  name = "context-aware";

  translate(input: string, context?: TranslationContext): TranslationResult {
    // First use pattern matching for basic understanding
    const patternStrategy = new PatternMatchingStrategy();
    const patternResult = patternStrategy.translate(input, context);
    
    // If we have context, use it to improve understanding
    if (context?.recentIntents?.length && patternResult.intent) {
      const mostRecentIntent = context.recentIntents[0];
      
      // If intent type is unknown but we have a recent intent, bias toward that type
      if (patternResult.confidence < 0.5 && mostRecentIntent) {
        return {
          ...patternResult,
          intent: {
            ...patternResult.intent,
            type: mostRecentIntent.type,
            domain: mostRecentIntent.domain
          },
          confidence: Math.min(patternResult.confidence + 0.2, 0.7),
          metadata: {
            ...patternResult.metadata,
            contextBoosted: true,
            originalConfidence: patternResult.confidence
          }
        };
      }
      
      // If intent type is the same as recent intent, increase confidence
      if (patternResult.intent.type === mostRecentIntent.type) {
        return {
          ...patternResult,
          confidence: Math.min(patternResult.confidence + 0.1, 0.9),
          metadata: {
            ...patternResult.metadata,
            contextBoosted: true,
            originalConfidence: patternResult.confidence
          }
        };
      }
    }
    
    return patternResult;
  }
}

// Main translator class that uses strategies
export class IntentTranslator {
  private strategies: TranslationStrategy[] = [];
  private context: TranslationContext = { recentIntents: [] };
  
  constructor() {
    // Register default strategies in priority order
    this.registerStrategy(new ContextAwareStrategy());
    this.registerStrategy(new PatternMatchingStrategy());
  }
  
  registerStrategy(strategy: TranslationStrategy) {
    this.strategies.push(strategy);
  }
  
  setContext(context: TranslationContext) {
    this.context = context;
  }
  
  translate(input: string): TranslationResult {
    // Try each strategy in order until one succeeds with high confidence
    for (const strategy of this.strategies) {
      const result = strategy.translate(input, this.context);
      
      if (result.success && result.confidence > 0.7) {
        // Update context with this new intent if it exists
        if (result.intent) {
          this.context.recentIntents = [
            result.intent, 
            ...this.context.recentIntents.slice(0, 2)
          ];
        }
        return result;
      }
    }
    
    // If no strategy gave a high-confidence result, use the first strategy's result
    const fallbackResult = this.strategies[0].translate(input, this.context);
    
    // Only update context if the result has some confidence
    if (fallbackResult.intent && fallbackResult.confidence > 0.4) {
      this.context.recentIntents = [
        fallbackResult.intent, 
        ...this.context.recentIntents.slice(0, 2)
      ];
    }
    
    return fallbackResult;
  }
}

// Export default instance for convenience
export default new IntentTranslator();
