
import graphDB, { GraphNode, GraphQuery } from './graphDB';
import { classifyIntent, Intent, IntentType } from '../components/creative/CommandParser/intentClassifier';

/**
 * Translation strategy interface
 */
export interface TranslationStrategy {
  name: string;
  translate: (input: string, context?: TranslationContext) => Promise<TranslationResult>;
  getConfidence: (input: string, context?: TranslationContext) => Promise<number>;
}

/**
 * Translation context - provides additional information for more accurate translations
 */
export interface TranslationContext {
  recentIntents?: Intent[];
  conversationHistory?: string[];
  selectedAssetId?: string | null;
  relatedNodes?: GraphNode[];
}

/**
 * Translation result with confidence scoring and alternatives
 */
export interface TranslationResult {
  original: string;
  intent: Intent;
  confidence: number;
  alternativeIntents: {
    intent: Intent;
    confidence: number;
  }[];
  parameters: Record<string, any>;
  relatedNodes?: GraphNode[];
  explanation?: string;
}

/**
 * Pattern-based translation strategy
 * Uses regex patterns and keyword matching for intent detection
 */
export class PatternMatchingStrategy implements TranslationStrategy {
  name = 'Pattern Matching';

  async translate(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Classify the input using the existing intentClassifier
    const intent = classifyIntent(input);
    
    // Basic confidence score from the classifier
    const confidence = intent.confidence;
    
    // Extract any additional parameters that might be relevant
    const parameters = intent.parameters || {};
    
    // Find related nodes in the graph DB if context is provided
    const relatedNodes: GraphNode[] = [];
    
    if (context?.selectedAssetId) {
      try {
        const node = graphDB.getNode(context.selectedAssetId);
        if (node) {
          // Find nodes related to the current selection
          const relationships = graphDB.getNodeRelationships(context.selectedAssetId);
          for (const rel of relationships) {
            const relatedId = rel.sourceId === context.selectedAssetId ? rel.targetId : rel.sourceId;
            const relatedNode = graphDB.getNode(relatedId);
            if (relatedNode) {
              relatedNodes.push(relatedNode);
            }
          }
        }
      } catch (error) {
        console.error("Error finding related nodes:", error);
      }
    }
    
    // Construct the result
    return {
      original: input,
      intent,
      confidence,
      alternativeIntents: [],  // In a real implementation, we would provide alternatives
      parameters,
      relatedNodes,
    };
  }

  async getConfidence(input: string, context?: TranslationContext): Promise<number> {
    const intent = classifyIntent(input);
    return intent.confidence;
  }
}

/**
 * Context-aware translation strategy
 * Uses conversation history and graph relationships for more accurate translations
 */
export class ContextAwareStrategy implements TranslationStrategy {
  name = 'Context Aware';

  async translate(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Base classification
    const intent = classifyIntent(input);
    let confidence = intent.confidence;
    
    // Extract parameters
    const parameters = { ...intent.parameters };
    
    // Find related nodes in the graph DB
    const relatedNodes: GraphNode[] = [];
    let explanation = '';
    
    // Boost confidence based on context
    if (context) {
      // 1. Check conversation history for context clues
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        const recentMessages = context.conversationHistory.slice(-3);
        
        // Check if recent messages have related keywords
        const domainKeywords = this.getDomainKeywords(intent.domain);
        const hasRelevantHistory = recentMessages.some(msg => 
          domainKeywords.some(keyword => msg.toLowerCase().includes(keyword))
        );
        
        if (hasRelevantHistory) {
          confidence = Math.min(0.95, confidence + 0.1);
          explanation += 'Confidence boosted by recent conversation history. ';
        }
      }
      
      // 2. Use graph DB for related content
      if (context.selectedAssetId) {
        try {
          // Query the graph for nodes related to the current context
          const query: GraphQuery = {
            properties: {
              type: intent.domain
            }
          };
          
          const relevantNodes = graphDB.executeQuery(query);
          
          if (relevantNodes.length > 0) {
            confidence = Math.min(0.95, confidence + 0.15);
            explanation += 'Confidence boosted by related graph nodes. ';
            relatedNodes.push(...relevantNodes.slice(0, 5));
            
            // Extract additional parameters from related nodes
            relevantNodes.forEach(node => {
              if (node.properties && node.properties.parameters) {
                Object.entries(node.properties.parameters).forEach(([key, value]) => {
                  if (!parameters[key]) {
                    parameters[key] = value;
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error("Error querying graph DB:", error);
        }
      }
    }
    
    // Generate alternative intents
    const alternativeIntents = this.generateAlternatives(intent, input);
    
    return {
      original: input,
      intent,
      confidence,
      alternativeIntents,
      parameters,
      relatedNodes,
      explanation
    };
  }

  async getConfidence(input: string, context?: TranslationContext): Promise<number> {
    const result = await this.translate(input, context);
    return result.confidence;
  }
  
  private getDomainKeywords(domain: string): string[] {
    // Map domains to relevant keywords for context matching
    const keywords: Record<string, string[]> = {
      'drawing': ['draw', 'sketch', 'color', 'shape', 'line', 'canvas'],
      'styling': ['style', 'theme', 'color', 'font', 'layout', 'design'],
      'animation': ['animate', 'move', 'transition', 'timing', 'motion'],
      'website': ['website', 'page', 'section', 'element', 'component'],
      'general': ['help', 'create', 'transform', 'convert', 'generate']
    };
    
    return keywords[domain] || keywords['general'];
  }
  
  private generateAlternatives(
    primaryIntent: Intent, 
    input: string
  ): { intent: Intent; confidence: number }[] {
    const alternatives: { intent: Intent; confidence: number }[] = [];
    
    // For demonstration purposes, generate some alternatives with lower confidence
    // In a real implementation, we would use more sophisticated methods
    
    // Create an alternative with the same domain but different type
    const alternativeTypes: Record<string, IntentType[]> = {
      'drawing': ['draw.shape', 'draw.line', 'draw.fill'],
      'styling': ['style.changeColor', 'style.changeFont', 'style.applyTheme'],
      'animation': ['animate.fadeIn', 'animate.move', 'animate.rotate'],
      'website': ['website.addSection', 'website.editElement', 'website.preview'],
      'general': ['conversation', 'transform.styleExtraction']
    };
    
    const possibleTypes = alternativeTypes[primaryIntent.domain] || alternativeTypes['general'];
    const filteredTypes = possibleTypes.filter(type => type !== primaryIntent.type);
    
    if (filteredTypes.length > 0) {
      // Take the first two alternatives
      filteredTypes.slice(0, 2).forEach((type, index) => {
        const confidenceReduction = 0.2 + (index * 0.1); // First alternative has higher confidence
        
        alternatives.push({
          intent: {
            ...primaryIntent,
            type,
            confidence: Math.max(0.1, primaryIntent.confidence - confidenceReduction)
          },
          confidence: Math.max(0.1, primaryIntent.confidence - confidenceReduction)
        });
      });
    }
    
    return alternatives;
  }
}

/**
 * Intent Translator class
 * Provides methods for translating natural language to structured intents
 */
export class IntentTranslator {
  private strategies: TranslationStrategy[] = [];
  private defaultStrategy: TranslationStrategy;
  
  constructor() {
    // Register translation strategies
    const patternStrategy = new PatternMatchingStrategy();
    const contextStrategy = new ContextAwareStrategy();
    
    this.strategies = [patternStrategy, contextStrategy];
    this.defaultStrategy = contextStrategy; // Use context-aware as default
  }
  
  /**
   * Translates natural language input to a structured intent
   */
  async translateIntent(
    input: string, 
    context?: TranslationContext
  ): Promise<TranslationResult> {
    // Use the default strategy
    return this.defaultStrategy.translate(input, context);
  }
  
  /**
   * Compares multiple translation strategies and returns the best result
   */
  async translateWithBestStrategy(
    input: string, 
    context?: TranslationContext
  ): Promise<TranslationResult> {
    // Get results from all strategies
    const results = await Promise.all(
      this.strategies.map(async strategy => ({
        strategy: strategy.name,
        result: await strategy.translate(input, context)
      }))
    );
    
    // Find the strategy with the highest confidence
    let bestResult = results[0];
    for (let i = 1; i < results.length; i++) {
      if (results[i].result.confidence > bestResult.result.confidence) {
        bestResult = results[i];
      }
    }
    
    return bestResult.result;
  }
  
  /**
   * Gets all available translation strategies
   */
  getStrategies(): TranslationStrategy[] {
    return this.strategies;
  }
}

// Create a singleton instance for global use
const intentTranslator = new IntentTranslator();
export default intentTranslator;
