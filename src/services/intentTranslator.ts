
import { GraphNode } from "./graphDB";

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

export type IntentType = "drawing" | "styling" | "animation" | "transform" | "ui" | "unknown" | "general" | "conversation";

export interface Intent {
  type: IntentType;
  domain: string;
  action: string;
  params?: Record<string, any>;
  confidence?: number;
  rawInput?: string;
}

export interface TranslationResult {
  success: boolean;
  originalInput: string;
  original?: string;
  intent: Intent;
  confidence: number;
  actions?: { type: string; payload: any }[];
  metadata?: Record<string, any>;
  relatedNodes?: GraphNode[];
  explanation?: string;
  parameters?: Record<string, any>;
  alternativeIntents?: Array<{
    intent: Intent;
    confidence: number;
  }>;
}

export interface TranslationContext {
  recentIntents?: Intent[];
  userPreferences?: Record<string, any>;
  projectContext?: {
    currentDomain?: string;
    recentAssets?: string[];
  };
  conversationHistory?: string[];
  selectedAssetId?: string | null;
}

// Abstract strategy class
export abstract class TranslationStrategy {
  abstract translate(input: string, context?: TranslationContext): Promise<TranslationResult> | TranslationResult;
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
      intentType = "general";
      confidence = 0.5;
    }
    
    // Build result
    return {
      success: intentType !== "unknown",
      originalInput: input,
      original: input,
      intent: {
        type: intentType,
        domain: intentType,
        action: "create",
        params: {}
      },
      confidence: confidence,
      parameters: {},
      alternativeIntents: []
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
    
    // For related context, we would need to query a graph database
    // This is a simplified approximation
    if (context?.selectedAssetId) {
      const query: GraphQuery = {
        nodeType: patternResult.intent.type,
        domain: patternResult.intent.domain
      };
      
      // In a real implementation, we would use the query to fetch related nodes
      // from a graph database. For now, we're just simulating it.
      const relatedNodes: GraphNode[] = [];
      
      // Add related nodes if found
      if (relatedNodes.length > 0) {
        return {
          ...patternResult,
          relatedNodes
        };
      }
    }
    
    // Generate alternative interpretations
    const alternativeIntents = [
      {
        intent: {
          type: "general" as IntentType,
          domain: "general",
          action: "respond",
          params: {}
        },
        confidence: 0.4
      }
    ];
    
    return {
      ...patternResult,
      alternativeIntents
    };
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
  
  translateIntent(input: string, context?: TranslationContext): Promise<TranslationResult> | TranslationResult {
    // Try each strategy in order until one succeeds with high confidence
    const currentContext = context || this.context;
    return this.strategies[0].translate(input, currentContext);
  }
  
  async translateWithBestStrategy(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Try each strategy in order until one succeeds with high confidence
    const currentContext = context || this.context;
    
    // Collect all strategy results, resolving any promises
    const resultsPromises = this.strategies.map(strategy => {
      const result = strategy.translate(input, currentContext);
      return result instanceof Promise ? result : Promise.resolve(result);
    });
    
    // Wait for all results to resolve
    const results = await Promise.all(resultsPromises);
    
    if (results.length > 0) {
      // Sort by confidence after all promises have resolved
      results.sort((a, b) => b.confidence - a.confidence);
      return results[0];
    }
    
    // Fallback to first strategy if something went wrong
    const result = await Promise.resolve(this.strategies[0].translate(input, currentContext));
    return result;
  }
  
  getStrategies(): TranslationStrategy[] {
    return this.strategies;
  }
  
  translate(input: string): TranslationResult {
    return this.translateIntent(input, this.context) as TranslationResult;
  }
}

// Export default instance for convenience
export default new IntentTranslator();
