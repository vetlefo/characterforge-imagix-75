
import { TranslationResult, TranslationContext } from "./types";

// Abstract strategy class
export abstract class TranslationStrategy {
  abstract translate(input: string, context?: TranslationContext): Promise<TranslationResult> | TranslationResult;
  abstract name: string;
}
