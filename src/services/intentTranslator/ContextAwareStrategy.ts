
import { TranslationStrategy } from "./TranslationStrategy";
import { TranslationResult, TranslationContext, GraphQuery, IntentType } from "./types";
import { PatternMatchingStrategy } from "./PatternMatchingStrategy";
import graphDB from "../graphDB";

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
      const relatedNodes = graphDB.executeQuery(query) || [];
      
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
