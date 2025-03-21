
import { GraphNode } from "../graphDB";

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
