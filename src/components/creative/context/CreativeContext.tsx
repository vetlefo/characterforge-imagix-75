
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Asset, Relationship, ConversationMessage } from "../types";
import { CreativeState, CreativeContextType } from "./types";
import { assetService } from "./assetService";
import { conversationService } from "./conversationService";

const CreativeContext = createContext<CreativeContextType | undefined>(undefined);

export const CreativeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CreativeState>({
    activeDrawing: false,
    currentIntent: "",
    suggestionsVisible: false,
    lastPrompt: "",
    assets: [],
    selectedAssetId: null,
    conversationHistory: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch assets on mount
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const assets = await assetService.fetchAssets();
        setState(prev => ({ ...prev, assets }));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  // Save to localStorage as a fallback
  useEffect(() => {
    if (state.assets.length > 0 && !isLoading) {
      assetService.saveToLocalStorage(state.assets);
    }
  }, [state.assets, isLoading]);

  // Simple state setters
  const setActiveDrawing = useCallback((active: boolean) => {
    setState(prev => ({ ...prev, activeDrawing: active }));
  }, []);

  const setCurrentIntent = useCallback((intent: string) => {
    setState(prev => ({ ...prev, currentIntent: intent }));
  }, []);

  const setSuggestionsVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, suggestionsVisible: visible }));
  }, []);

  const setLastPrompt = useCallback((prompt: string) => {
    setState(prev => ({ ...prev, lastPrompt: prompt }));
  }, []);

  const triggerSuggestion = useCallback(() => {
    setState(prev => ({ ...prev, suggestionsVisible: true }));
  }, []);

  const setSelectedAssetId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedAssetId: id }));
  }, []);

  // Asset management methods
  const addAsset = useCallback(async (
    type: Asset["type"], 
    content: string, 
    tags: string[] = [], 
    metadata: Record<string, any> = {}
  ): Promise<Asset> => {
    const newAsset = await assetService.addAsset(type, content, tags, metadata);
    
    // Update state with the new asset
    setState(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }));
    
    return newAsset;
  }, []);

  const updateAsset = useCallback(async (id: string, data: Partial<Omit<Asset, "id" | "createdAt">>) => {
    // Update locally first
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(asset => 
        asset.id === id 
          ? { 
              ...asset, 
              ...data, 
              updatedAt: new Date() 
            } 
          : asset
      )
    }));
    
    // Then update in Supabase
    await assetService.updateAsset(id, data);
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    // Delete locally first
    setState(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id),
      selectedAssetId: prev.selectedAssetId === id ? null : prev.selectedAssetId
    }));
    
    // Then delete from Supabase
    await assetService.deleteAsset(id);
  }, []);

  const getAssetById = useCallback((id: string) => {
    return state.assets.find(asset => asset.id === id);
  }, [state.assets]);

  const getAssetsByType = useCallback((type: Asset["type"]) => {
    return state.assets.filter(asset => asset.type === type);
  }, [state.assets]);

  const getAssetsByTag = useCallback((tag: string) => {
    return state.assets.filter(asset => asset.tags.includes(tag));
  }, [state.assets]);

  // Relationship management methods
  const createRelationship = useCallback(async (
    sourceId: string, 
    targetId: string, 
    type: Relationship["type"], 
    strength: number = 5,
    metadata: Record<string, any> = {}
  ): Promise<Relationship> => {
    const newRelationship = await assetService.createRelationship(
      sourceId, targetId, type, strength, metadata
    );

    // Update state with the new relationship
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(asset => 
        asset.id === sourceId 
          ? { 
              ...asset, 
              relationships: [...asset.relationships, newRelationship],
              updatedAt: new Date()
            } 
          : asset
      )
    }));
    
    return newRelationship;
  }, []);

  const updateRelationship = useCallback(async (id: string, data: Partial<Omit<Relationship, "id" | "createdAt">>) => {
    // Update locally first
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(asset => ({
        ...asset,
        updatedAt: asset.relationships.some(rel => rel.id === id) ? new Date() : asset.updatedAt,
        relationships: asset.relationships.map(rel => 
          rel.id === id 
            ? { ...rel, ...data } 
            : rel
        )
      }))
    }));
    
    // Then update in Supabase
    await assetService.updateRelationship(id, data);
  }, []);

  const deleteRelationship = useCallback(async (id: string) => {
    // Delete locally first
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(asset => ({
        ...asset,
        updatedAt: asset.relationships.some(rel => rel.id === id) ? new Date() : asset.updatedAt,
        relationships: asset.relationships.filter(rel => rel.id !== id)
      }))
    }));
    
    // Then delete from Supabase
    await assetService.deleteRelationship(id);
  }, []);

  const getRelatedAssets = useCallback((
    assetId: string, 
    relationshipType?: Relationship["type"]
  ): Asset[] => {
    // Find the source asset
    const sourceAsset = state.assets.find(asset => asset.id === assetId);
    if (!sourceAsset) return [];

    // Filter relationships by type if provided
    const relevantRelationships = relationshipType 
      ? sourceAsset.relationships.filter(rel => rel.type === relationshipType)
      : sourceAsset.relationships;

    // Get related asset IDs
    const relatedAssetIds = relevantRelationships.map(rel => rel.targetId);

    // Return the related assets
    return state.assets.filter(asset => relatedAssetIds.includes(asset.id));
  }, [state.assets]);

  // Compute all unique tags across assets
  const getAllUniqueTags = useCallback(() => {
    const tagSet = new Set<string>();
    state.assets.forEach(asset => {
      asset.tags.forEach(tag => {
        tagSet.add(tag);
      });
    });
    return Array.from(tagSet);
  }, [state.assets]);

  // Conversation methods
  const addConversationMessage = useCallback((message: ConversationMessage) => {
    const messageWithId = conversationService.addMessage(message);
    
    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, messageWithId]
    }));
    
    return messageWithId;
  }, []);
  
  const executeCreativeAction = useCallback((actionType: string, payload: any) => {
    conversationService.executeAction(actionType, payload);
    
    // Update last action in state
    setState(prev => ({
      ...prev,
      lastAction: {
        type: actionType,
        payload
      }
    }));
  }, []);
  
  const suggestRelevantAssets = useCallback(() => {
    // For now just return most recent assets
    return state.assets.slice(-5);
  }, [state.assets]);
  
  const analyzeCreativeIntent = useCallback((input: string) => {
    const intent = conversationService.analyzeIntent(input);
    setCurrentIntent(intent);
  }, [setCurrentIntent]);

  return (
    <CreativeContext.Provider
      value={{
        ...state,
        setActiveDrawing,
        setCurrentIntent,
        setSuggestionsVisible,
        setLastPrompt,
        triggerSuggestion,
        addAsset,
        updateAsset,
        deleteAsset,
        getAssetById,
        getAssetsByType,
        getAssetsByTag,
        createRelationship,
        updateRelationship,
        deleteRelationship,
        getRelatedAssets,
        setSelectedAssetId,
        tags: getAllUniqueTags(),
        addConversationMessage,
        executeCreativeAction,
        suggestRelevantAssets,
        analyzeCreativeIntent
      }}
    >
      {children}
    </CreativeContext.Provider>
  );
};

export const useCreative = () => {
  const context = useContext(CreativeContext);
  if (context === undefined) {
    throw new Error("useCreative must be used within a CreativeProvider");
  }
  return context;
};
