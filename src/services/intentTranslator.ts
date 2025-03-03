
import { classifyIntent, IntentType } from '../components/creative/CommandParser/intentClassifier';

// Add the missing TranslationContext type
export interface TranslationContext {
  conversationHistory?: string[];
  selectedAssetId?: string | null;
}

export interface TranslationStrategy {
  name: string;
  translate: (input: string, context?: TranslationContext) => Promise<TranslationResult>;
  priority: number;
}

export interface AlternativeIntent {
  intent: Intent;
  confidence: number;
}

export interface TranslationResult {
  original: string;
  intent: Intent;
  confidence: number;
  alternativeIntents: AlternativeIntent[];
  parameters: Record<string, any>;
  relatedNodes?: any[]; // Add missing fields
  explanation?: string; // Add missing fields
}

// Export the strategy classes for testing
export class PatternMatchingStrategy implements TranslationStrategy {
  name = 'Pattern Matching';
  priority = 1;
  
  async translate(input: string, context?: TranslationContext): Promise<TranslationResult> {
    const intent = await classifyIntent(input);
    
    // Adjust confidence based on pattern matching precision
    // This is a simplified example - real implementation would have more complex patterns
    if (input.match(/^(create|draw|make|add)\s+a?\s+(circle|square|rectangle|triangle)/i)) {
      intent.type = 'draw.shape';
      intent.confidence = Math.min(intent.confidence + 0.2, 1.0);
    } else if (input.match(/^(animate|move|rotate|spin|scale)\s+the\s+/i)) {
      intent.type = 'animate.general';
      intent.confidence = Math.min(intent.confidence + 0.15, 1.0);
    } else if (input.match(/^(change|set|modify)\s+(color|style|font|size)/i)) {
      intent.type = 'style.general';
      intent.confidence = Math.min(intent.confidence + 0.15, 1.0);
    }
    
    return {
      original: input,
      intent,
      confidence: intent.confidence,
      alternativeIntents: [],
      parameters: intent.parameters
    };
  }
}

export class ContextAwareStrategy implements TranslationStrategy {
  name = 'Context Aware';
  priority = 2;
  
  async translate(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Get base intent from the general classifier
    const intent = await classifyIntent(input);
    
    // If we have context, use it to refine the intent
    if (context) {
      // Example: if we're in the drawing context, bias towards drawing intents
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        const recentMessages = context.conversationHistory.slice(-3);
        const drawingContext = recentMessages.some(msg => 
          msg.toLowerCase().includes('draw') || 
          msg.toLowerCase().includes('shape') || 
          msg.toLowerCase().includes('circle')
        );
        
        if (drawingContext && intent.domain !== 'drawing' && intent.confidence < 0.8) {
          intent.domain = 'drawing';
          intent.type = 'draw.general' as IntentType;
          // Lower confidence since we're overriding
          intent.confidence = Math.min(intent.confidence + 0.1, 0.9);
        }
      }
      
      // Example: if there's a selected element, bias towards modification intents
      if (context.selectedAssetId) {
        if (input.match(/this|it|that|the selected/i)) {
          // Likely referring to the selected element
          if (input.match(/change|modify|update|edit/i)) {
            intent.type = 'style.general';
            intent.confidence = Math.min(intent.confidence + 0.15, 0.95);
          }
        }
        
        try {
          // Get related nodes from the graph database - fixed to use proper GraphDB API
          const relatedNodes = await import('./graphDB').then(module => {
            return module.default.getAllNodes().filter(node => 
              node.connections?.some(conn => conn.targetId === context.selectedAssetId)
            );
          });
          
          return {
            original: input,
            intent,
            confidence: intent.confidence,
            alternativeIntents: this.generateAlternativeIntents(intent),
            parameters: intent.parameters,
            relatedNodes,
            explanation: 'Context-based translation using selected asset and conversation history'
          };
        } catch (error) {
          console.error('Error querying graph database:', error);
        }
      }
    }
    
    return {
      original: input,
      intent,
      confidence: intent.confidence,
      alternativeIntents: this.generateAlternativeIntents(intent),
      parameters: intent.parameters,
      explanation: 'Basic context-aware translation'
    };
  }
  
  private generateAlternativeIntents(primaryIntent: Intent): AlternativeIntent[] {
    // Generate some alternative interpretations with lower confidence
    const alternatives: AlternativeIntent[] = [];
    
    if (primaryIntent.domain === 'drawing') {
      alternatives.push({
        intent: {
          ...primaryIntent,
          domain: 'animation',
          type: 'animate.general',
          confidence: primaryIntent.confidence * 0.8
        },
        confidence: primaryIntent.confidence * 0.8
      });
    } else if (primaryIntent.domain === 'animation') {
      alternatives.push({
        intent: {
          ...primaryIntent,
          domain: 'drawing',
          type: 'draw.general',
          confidence: primaryIntent.confidence * 0.7
        },
        confidence: primaryIntent.confidence * 0.7
      });
    }
    
    // Add a general conversation alternative with lower confidence
    alternatives.push({
      intent: {
        ...primaryIntent,
        domain: 'general',
        type: 'general.conversation' as IntentType, // Fix for 'conversation' type
        confidence: primaryIntent.confidence * 0.6
      },
      confidence: primaryIntent.confidence * 0.6
    });
    
    return alternatives;
  }
}

export class GraphEnhancedStrategy implements TranslationStrategy {
  name = 'Graph Enhanced';
  priority = 3;
  
  async translate(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Get base intent from the general classifier
    const intent = await classifyIntent(input);
    
    try {
      // Get related concepts from the graph database - fixed to use proper GraphDB API
      const graphDB = (await import('./graphDB')).default;
      const relatedConcepts = graphDB.getAllNodes().filter(node => 
        node.properties && 
        typeof node.properties.text === 'string' && 
        node.properties.text.includes(input.substring(0, 20))
      );
      
      // Use related concepts to enhance understanding
      if (relatedConcepts.length > 0) {
        // Check if any related concepts strongly suggest a domain
        const domainHints = relatedConcepts.filter(concept => 
          concept.type === 'domain' || concept.type === 'intent'
        );
        
        if (domainHints.length > 0) {
          // Bias towards the suggested domain if confidence isn't already high
          const suggestedDomain = domainHints[0].type.toLowerCase();
          if (intent.domain !== suggestedDomain && intent.confidence < 0.8) {
            intent.domain = suggestedDomain;
            intent.type = `${suggestedDomain}.general` as IntentType;
            intent.confidence = Math.min(intent.confidence + 0.1, 0.85);
          }
        }
        
        // Use parameter hints from the graph
        const paramHints = relatedConcepts.filter(concept => 
          concept.type === 'parameter' || concept.type === 'value'
        );
        
        if (paramHints.length > 0) {
          paramHints.forEach(param => {
            if (param.properties && param.properties.key && param.properties.value) {
              intent.parameters[param.properties.key] = param.properties.value;
            }
          });
        }
        
        return {
          original: input,
          intent,
          confidence: intent.confidence,
          alternativeIntents: [],
          parameters: intent.parameters,
          relatedNodes: relatedConcepts,
          explanation: 'Graph-enhanced translation using semantic relationships'
        };
      }
    } catch (error) {
      console.error('Error using graph database for intent enhancement:', error);
    }
    
    return {
      original: input,
      intent,
      confidence: intent.confidence,
      alternativeIntents: [],
      parameters: intent.parameters
    };
  }
}

export class IntentTranslator {
  strategies: TranslationStrategy[];
  
  constructor(strategies: TranslationStrategy[]) {
    this.strategies = strategies;
  }
  
  async translateIntent(input: string, context?: TranslationContext): Promise<TranslationResult> {
    return this.translateWithBestStrategy(input, context);
  }
  
  getStrategies(): TranslationStrategy[] {
    return this.strategies;
  }
  
  async translateWithStrategy(input: string, strategyName: string, context?: TranslationContext): Promise<TranslationResult> {
    const strategy = this.strategies.find(s => s.name === strategyName);
    
    if (!strategy) {
      throw new Error(`Strategy "${strategyName}" not found`);
    }
    
    return strategy.translate(input, context);
  }
  
  async translateWithBestStrategy(input: string, context?: TranslationContext): Promise<TranslationResult> {
    // Run all strategies in parallel
    const results = await Promise.all(
      this.strategies.map(strategy => strategy.translate(input, context))
    );
    
    // Sort by confidence
    const sortedResults = [...results].sort((a, b) => b.confidence - a.confidence);
    
    // The best intent is the one with the highest confidence
    const bestResult = sortedResults[0];
    
    // Create alternative intents list (excluding the best one)
    const alternativeIntents = sortedResults.slice(1).flatMap(result => 
      result.alternativeIntents.concat([{
        intent: result.intent,
        confidence: result.confidence
      }])
    );
    
    return {
      original: input,
      intent: bestResult.intent,
      confidence: bestResult.confidence,
      alternativeIntents,
      parameters: bestResult.parameters,
      relatedNodes: bestResult.relatedNodes,
      explanation: bestResult.explanation
    };
  }
}

// Create a default instance with all strategies
const patternMatchingStrategy = new PatternMatchingStrategy();
const contextAwareStrategy = new ContextAwareStrategy();
const graphEnhancedStrategy = new GraphEnhancedStrategy();

const intentTranslator = new IntentTranslator([
  patternMatchingStrategy,
  contextAwareStrategy,
  graphEnhancedStrategy
]);

export default intentTranslator;
