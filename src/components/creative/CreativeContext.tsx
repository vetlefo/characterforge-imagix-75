import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Asset, Relationship, CreativeContextState, AssetUpdateData } from "./types";
import { v4 as uuidv4 } from "uuid";

interface CreativeContextType extends CreativeContextState {
  // Existing methods
  setActiveDrawing: (active: boolean) => void;
  setCurrentIntent: (intent: string) => void;
  setSuggestionsVisible: (visible: boolean) => void;
  setLastPrompt: (prompt: string) => void;
  triggerSuggestion: () => void;
  
  // New asset management methods
  addAsset: (type: Asset["type"], content: string, tags?: string[], metadata?: Record<string, any>) => Asset;
  updateAsset: (id: string, data: AssetUpdateData) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByType: (type: Asset["type"]) => Asset[];
  getAssetsByTag: (tag: string) => Asset[];
  
  // Relationship management
  createRelationship: (sourceId: string, targetId: string, type: Relationship["type"], strength?: number, metadata?: Record<string, any>) => Relationship;
  updateRelationship: (id: string, data: Partial<Omit<Relationship, "id" | "createdAt">>) => void;
  deleteRelationship: (id: string) => void;
  getRelatedAssets: (assetId: string, relationshipType?: Relationship["type"]) => Asset[];
  
  // Selection management
  setSelectedAssetId: (id: string | null) => void;
  
  // Helper to get all unique tags
  tags: string[];
}

const CreativeContext = createContext<CreativeContextType | undefined>(undefined);

export const CreativeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CreativeContextState>({
    activeDrawing: false,
    currentIntent: "",
    suggestionsVisible: false,
    lastPrompt: "",
    assets: [],
    selectedAssetId: null
  });

  // Load assets from localStorage on mount
  useEffect(() => {
    try {
      const savedAssets = localStorage.getItem("creative-assets");
      if (savedAssets) {
        const parsedAssets = JSON.parse(savedAssets);
        // Convert string dates back to Date objects
        const processedAssets = parsedAssets.map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          relationships: asset.relationships.map((rel: any) => ({
            ...rel,
            createdAt: new Date(rel.createdAt)
          }))
        }));
        setState(prev => ({
          ...prev,
          assets: processedAssets
        }));
      }
    } catch (error) {
      console.error("Error loading assets from localStorage:", error);
    }
  }, []);

  // Save assets to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("creative-assets", JSON.stringify(state.assets));
    } catch (error) {
      console.error("Error saving assets to localStorage:", error);
    }
  }, [state.assets]);

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
  const addAsset = useCallback((
    type: Asset["type"], 
    content: string, 
    tags: string[] = [], 
    metadata: Record<string, any> = {}
  ): Asset => {
    const newAsset: Asset = {
      id: uuidv4(),
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
      relationships: [],
      metadata
    };

    setState(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }));

    return newAsset;
  }, []);

  const updateAsset = useCallback((id: string, data: AssetUpdateData) => {
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
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id),
      selectedAssetId: prev.selectedAssetId === id ? null : prev.selectedAssetId
    }));
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
  const createRelationship = useCallback((
    sourceId: string, 
    targetId: string, 
    type: Relationship["type"], 
    strength: number = 5,
    metadata: Record<string, any> = {}
  ): Relationship => {
    const newRelationship: Relationship = {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      strength,
      createdAt: new Date(),
      metadata
    };

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

  const updateRelationship = useCallback((id: string, data: Partial<Omit<Relationship, "id" | "createdAt">>) => {
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
  }, []);

  const deleteRelationship = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(asset => ({
        ...asset,
        updatedAt: asset.relationships.some(rel => rel.id === id) ? new Date() : asset.updatedAt,
        relationships: asset.relationships.filter(rel => rel.id !== id)
      }))
    }));
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
        tags: getAllUniqueTags()
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
