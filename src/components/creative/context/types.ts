
import { Asset, Relationship, ConversationMessage } from "../types";

export interface CreativeState {
  activeDrawing: boolean;
  currentIntent: string;
  suggestionsVisible: boolean;
  lastPrompt: string;
  assets: Asset[];
  selectedAssetId: string | null;
  conversationHistory: ConversationMessage[];
  creativeIntent?: string;
  lastAction?: {
    type: string;
    payload: any;
  };
}

export interface CreativeContextType extends CreativeState {
  // Simple state setters
  setActiveDrawing: (active: boolean) => void;
  setCurrentIntent: (intent: string) => void;
  setSuggestionsVisible: (visible: boolean) => void;
  setLastPrompt: (prompt: string) => void;
  triggerSuggestion: () => void;
  
  // Asset management methods
  addAsset: (type: Asset["type"], content: string, tags?: string[], metadata?: Record<string, any>) => Promise<Asset>;
  updateAsset: (id: string, data: Partial<Omit<Asset, "id" | "createdAt">>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByType: (type: Asset["type"]) => Asset[];
  getAssetsByTag: (tag: string) => Asset[];
  
  // Relationship management
  createRelationship: (sourceId: string, targetId: string, type: Relationship["type"], strength?: number, metadata?: Record<string, any>) => Promise<Relationship>;
  updateRelationship: (id: string, data: Partial<Omit<Relationship, "id" | "createdAt">>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  getRelatedAssets: (assetId: string, relationshipType?: Relationship["type"]) => Asset[];
  
  // Selection management
  setSelectedAssetId: (id: string | null) => void;
  
  // Helper to get all unique tags
  tags: string[];
  
  // Conversation methods
  addConversationMessage: (message: ConversationMessage) => ConversationMessage;
  executeCreativeAction: (actionType: string, payload: any) => void;
  suggestRelevantAssets: () => Asset[];
  analyzeCreativeIntent: (input: string) => void;
}
