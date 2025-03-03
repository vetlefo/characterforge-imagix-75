
import { getGraphNeighbors } from './graphDB';
import { Intent, classifyIntent, IntentType } from '../components/creative/CommandParser/intentClassifier';

export interface TranslationStrategy {
  name: string;
  translate: (input: string, context?: any) => Promise<Intent>;
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
}

// Pattern matching strategy using regular expressions
const patternMatchingStrategy: TranslationStrategy = {
  name: 'Pattern Matching',
  priority: 1,
  async translate(input: string): Promise<Intent> {
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
    
    return intent;
  }
};

// Context-aware strategy that considers previous interactions and application state
const contextAwareStrategy: TranslationStrategy = {
  name: 'Context Aware',
  priority: 2,
  async translate(input: string, context?: any): Promise<Intent> {
    // Get base intent from the general classifier
    const intent = await classifyIntent(input);
    
    // If we have context, use it to refine the intent
    if (context) {
      // Example: if we're in the drawing context, bias towards drawing intents
      if (context.currentTool === 'drawing') {
        if (intent.domain !== 'drawing' && intent.confidence < 0.8) {
          intent.domain = 'drawing';
          intent.type = 'draw.general';
          // Lower confidence since we're overriding
          intent.confidence = Math.min(intent.confidence + 0.1, 0.9);
        }
      }
      
      // Example: if there's a selected element, bias towards modification intents
      if (context.selectedElementId) {
        if (input.match(/this|it|that|the selected/i)) {
          // Likely referring to the selected element
          if (input.match(/change|modify|update|edit/i)) {
            intent.type = 'style.general';
            intent.confidence = Math.min(intent.confidence + 0.15, 0.95);
          }
        }
      }
    }
    
    return intent;
  }
};

// Graph-enhanced strategy that uses the graph database for context and understanding
const graphEnhancedStrategy: TranslationStrategy = {
  name: 'Graph Enhanced',
  priority: 3,
  async translate(input: string): Promise<Intent> {
    // Get base intent from the general classifier
    const intent = await classifyIntent(input);
    
    try {
      // Get related concepts from the graph database
      const relatedConcepts = await getGraphNeighbors('input', input, 2);
      
      // Use related concepts to enhance understanding
      if (relatedConcepts.length > 0) {
        // Check if any related concepts strongly suggest a domain
        const domainHints = relatedConcepts.filter(concept => 
          concept.type === 'domain' || concept.type === 'intent'
        );
        
        if (domainHints.length > 0) {
          // Bias towards the suggested domain if confidence isn't already high
          const suggestedDomain = domainHints[0].label.toLowerCase();
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
      }
    } catch (error) {
      console.error('Error using graph database for intent enhancement:', error);
    }
    
    return intent;
  }
};

// Combine all strategies
const strategies: TranslationStrategy[] = [
  patternMatchingStrategy,
  contextAwareStrategy,
  graphEnhancedStrategy
];

// Main service object
const intentTranslator = {
  /**
   * Translate a natural language input into a structured intent
   */
  async translateIntent(input: string, context?: any): Promise<TranslationResult> {
    // Use the best strategy by default
    const result = await this.translateWithBestStrategy(input, context);
    return result;
  },
  
  /**
   * Get all available translation strategies
   */
  getStrategies(): { name: string }[] {
    return strategies.map(strategy => ({ name: strategy.name }));
  },
  
  /**
   * Translate using a specific named strategy
   */
  async translateWithStrategy(input: string, strategyName: string, context?: any): Promise<TranslationResult> {
    const strategy = strategies.find(s => s.name === strategyName);
    
    if (!strategy) {
      throw new Error(`Strategy "${strategyName}" not found`);
    }
    
    const intent = await strategy.translate(input, context);
    
    return {
      original: input,
      intent,
      confidence: intent.confidence,
      alternativeIntents: [],
      parameters: intent.parameters
    };
  },
  
  /**
   * Translate using all strategies and pick the best result based on confidence
   */
  async translateWithBestStrategy(input: string, context?: any): Promise<TranslationResult> {
    // Run all strategies in parallel
    const intents = await Promise.all(
      strategies.map(strategy => strategy.translate(input, context))
    );
    
    // Sort by confidence
    const sortedIntents = [...intents].sort((a, b) => b.confidence - a.confidence);
    
    // The best intent is the one with the highest confidence
    const bestIntent = sortedIntents[0];
    
    // Create alternative intents list (excluding the best one)
    const alternativeIntents = sortedIntents.slice(1).map(intent => ({
      intent,
      confidence: intent.confidence
    }));
    
    return {
      original: input,
      intent: bestIntent,
      confidence: bestIntent.confidence,
      alternativeIntents,
      parameters: bestIntent.parameters
    };
  }
};

export default intentTranslator;
