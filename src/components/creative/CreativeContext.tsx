
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Asset, Relationship, CreativeContextState, AssetUpdateData, ConversationMessage } from "./types";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreativeContextType extends CreativeContextState {
  // Existing methods
  setActiveDrawing: (active: boolean) => void;
  setCurrentIntent: (intent: string) => void;
  setSuggestionsVisible: (visible: boolean) => void;
  setLastPrompt: (prompt: string) => void;
  triggerSuggestion: () => void;
  
  // Asset management methods
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
  
  // Conversation methods
  addConversationMessage: (message: ConversationMessage) => void;
  executeCreativeAction: (actionType: string, payload: any) => void;
  suggestRelevantAssets: () => Asset[];
  analyzeCreativeIntent: (input: string) => void;
}

const CreativeContext = createContext<CreativeContextType | undefined>(undefined);

export const CreativeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CreativeContextState>({
    activeDrawing: false,
    currentIntent: "",
    suggestionsVisible: false,
    lastPrompt: "",
    assets: [],
    selectedAssetId: null,
    conversationHistory: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch assets from Supabase on mount
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          // Fetch assets from Supabase
          const { data: assetsData, error: assetsError } = await supabase
            .from('creative_assets')
            .select('*');
          
          if (assetsError) {
            console.error("Error fetching assets:", assetsError);
            toast.error("Failed to load assets");
            
            // Fall back to localStorage if there's an error
            try {
              const savedAssets = localStorage.getItem("creative-assets");
              if (savedAssets) {
                const parsedAssets = JSON.parse(savedAssets);
                setState(prev => ({
                  ...prev,
                  assets: parsedAssets.map((asset: any) => ({
                    ...asset,
                    createdAt: new Date(asset.createdAt),
                    updatedAt: new Date(asset.updatedAt),
                    relationships: asset.relationships.map((rel: any) => ({
                      ...rel,
                      createdAt: new Date(rel.createdAt)
                    }))
                  }))
                }));
              }
            } catch (localError) {
              console.error("Error loading assets from localStorage:", localError);
            }
          } else {
            // Transform Supabase assets to the format expected by the app
            const transformedAssets = assetsData.map(asset => {
              // Fetch relationships for this asset
              return {
                id: asset.id,
                type: asset.type as Asset["type"],
                content: asset.content,
                createdAt: new Date(asset.created_at),
                updatedAt: new Date(asset.updated_at),
                tags: asset.tags || [],
                relationships: [], // Will be populated in the next step
                metadata: asset.metadata || { title: asset.title }
              };
            });
            
            // Fetch asset relationships
            const { data: relationshipsData, error: relationshipsError } = await supabase
              .from('asset_relationships')
              .select('*');
            
            if (relationshipsError) {
              console.error("Error fetching relationships:", relationshipsError);
            } else {
              // Add relationships to the assets
              for (const relationship of relationshipsData || []) {
                const asset = transformedAssets.find(a => a.id === relationship.source_id);
                if (asset) {
                  asset.relationships.push({
                    id: relationship.id,
                    sourceId: relationship.source_id,
                    targetId: relationship.target_id,
                    type: relationship.type as Relationship["type"],
                    strength: relationship.strength,
                    createdAt: new Date(relationship.created_at),
                    metadata: relationship.metadata || {}
                  });
                }
              }
            }
            
            setState(prev => ({ ...prev, assets: transformedAssets }));
          }
        } else {
          // Not logged in, try to load from localStorage
          try {
            const savedAssets = localStorage.getItem("creative-assets");
            if (savedAssets) {
              const parsedAssets = JSON.parse(savedAssets);
              setState(prev => ({
                ...prev,
                assets: parsedAssets.map((asset: any) => ({
                  ...asset,
                  createdAt: new Date(asset.createdAt),
                  updatedAt: new Date(asset.updatedAt),
                  relationships: asset.relationships.map((rel: any) => ({
                    ...rel,
                    createdAt: new Date(rel.createdAt)
                  }))
                }))
              }));
            }
          } catch (error) {
            console.error("Error loading assets from localStorage:", error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  // Save to localStorage as a fallback
  useEffect(() => {
    if (state.assets.length > 0 && !isLoading) {
      try {
        localStorage.setItem("creative-assets", JSON.stringify(state.assets));
      } catch (error) {
        console.error("Error saving assets to localStorage:", error);
      }
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
    const localId = uuidv4();
    const title = metadata.title || `New ${type}`;
    
    const newAsset: Asset = {
      id: localId,
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
      relationships: [],
      metadata
    };

    // First, add to the local state for immediate UI update
    setState(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }));

    try {
      // Try to save to Supabase if user is logged in
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { data, error } = await supabase
          .from('creative_assets')
          .insert({
            type,
            content,
            title,
            tags,
            metadata
          })
          .select();
        
        if (error) {
          console.error("Error saving asset to Supabase:", error);
          toast.error("Failed to save asset to cloud. Changes saved locally only.");
          return newAsset;
        }
        
        if (data && data[0]) {
          // Update the state with the Supabase ID
          const serverAsset = {
            ...newAsset,
            id: data[0].id
          };
          
          setState(prev => ({
            ...prev,
            assets: prev.assets.map(a => a.id === localId ? serverAsset : a)
          }));
          
          return serverAsset;
        }
      }
    } catch (error) {
      console.error("Error in addAsset:", error);
    }

    return newAsset;
  }, []);

  const updateAsset = useCallback(async (id: string, data: AssetUpdateData) => {
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
    
    try {
      // Then update in Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const updateData: any = {
          ...data,
          updated_at: new Date().toISOString()
        };
        
        // Handle special fields
        if (data.metadata && data.metadata.title) {
          updateData.title = data.metadata.title;
        }
        
        const { error } = await supabase
          .from('creative_assets')
          .update(updateData)
          .eq('id', id);
        
        if (error) {
          console.error("Error updating asset in Supabase:", error);
          toast.error("Failed to update asset in cloud. Changes saved locally only.");
        }
      }
    } catch (error) {
      console.error("Error in updateAsset:", error);
    }
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    // Delete locally first
    setState(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id),
      selectedAssetId: prev.selectedAssetId === id ? null : prev.selectedAssetId
    }));
    
    try {
      // Then delete from Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { error } = await supabase
          .from('creative_assets')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error("Error deleting asset from Supabase:", error);
          toast.error("Failed to delete asset from cloud. Removed locally only.");
        }
      }
    } catch (error) {
      console.error("Error in deleteAsset:", error);
    }
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
    const newRelationship: Relationship = {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      strength,
      createdAt: new Date(),
      metadata
    };

    // Update locally first
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
    
    try {
      // Then create in Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { data, error } = await supabase
          .from('asset_relationships')
          .insert({
            source_id: sourceId,
            target_id: targetId,
            type,
            strength,
            metadata
          })
          .select();
        
        if (error) {
          console.error("Error creating relationship in Supabase:", error);
          toast.error("Failed to save relationship to cloud. Changes saved locally only.");
        } else if (data && data[0]) {
          // Update the state with the Supabase ID
          const serverRelationship = {
            ...newRelationship,
            id: data[0].id
          };
          
          setState(prev => ({
            ...prev,
            assets: prev.assets.map(asset => 
              asset.id === sourceId 
                ? { 
                    ...asset, 
                    relationships: asset.relationships.map(rel => 
                      rel.id === newRelationship.id ? serverRelationship : rel
                    ) 
                  } 
                : asset
            )
          }));
          
          return serverRelationship;
        }
      }
    } catch (error) {
      console.error("Error in createRelationship:", error);
    }

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
    
    try {
      // Then update in Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { error } = await supabase
          .from('asset_relationships')
          .update(data)
          .eq('id', id);
        
        if (error) {
          console.error("Error updating relationship in Supabase:", error);
          toast.error("Failed to update relationship in cloud. Changes saved locally only.");
        }
      }
    } catch (error) {
      console.error("Error in updateRelationship:", error);
    }
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
    
    try {
      // Then delete from Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { error } = await supabase
          .from('asset_relationships')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error("Error deleting relationship from Supabase:", error);
          toast.error("Failed to delete relationship from cloud. Removed locally only.");
        }
      }
    } catch (error) {
      console.error("Error in deleteRelationship:", error);
    }
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
    const messageWithId = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    };
    
    setState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, messageWithId]
    }));
    
    return messageWithId;
  }, []);
  
  const executeCreativeAction = useCallback((actionType: string, payload: any) => {
    console.log(`Executing action: ${actionType}`, payload);
    
    // Here we would implement actual action handling logic
    // For now just log it
    
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
    // Implement logic to suggest assets based on current context
    // For now just return most recent assets
    return state.assets.slice(-5);
  }, [state.assets]);
  
  const analyzeCreativeIntent = useCallback((input: string) => {
    // Here we would implement actual intent analysis
    // For now just set the current intent directly
    setCurrentIntent(input);
  }, []);

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
