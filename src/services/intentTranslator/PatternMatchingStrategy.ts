
import { TranslationStrategy } from "./TranslationStrategy";
import { TranslationResult, TranslationContext, IntentType } from "./types";

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
