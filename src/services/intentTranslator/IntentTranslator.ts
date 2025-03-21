
import { TranslationStrategy } from "./TranslationStrategy";
import { TranslationContext, TranslationResult } from "./types";
import { ContextAwareStrategy } from "./ContextAwareStrategy";
import { PatternMatchingStrategy } from "./PatternMatchingStrategy";

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

// Create a default instance
const intentTranslator = new IntentTranslator();
export default intentTranslator;
