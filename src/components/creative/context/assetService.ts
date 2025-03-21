
import { Asset, Relationship } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

/**
 * Handles all asset-related database operations
 */
export const assetService = {
  async fetchAssets() {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Not logged in, try to load from localStorage
        return this.loadFromLocalStorage();
      }
      
      // Fetch assets from Supabase
      const { data: assetsData, error: assetsError } = await supabase
        .from('creative_assets')
        .select('*');
      
      if (assetsError) {
        console.error("Error fetching assets:", assetsError);
        toast.error("Failed to load assets");
        return this.loadFromLocalStorage();
      }
      
      // Transform Supabase assets to the format expected by the app
      const transformedAssets = assetsData.map(asset => {
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
        // Continue with assets but no relationships
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
      
      return transformedAssets;
    } catch (error) {
      console.error("Error in fetchAssets:", error);
      return this.loadFromLocalStorage();
    }
  },
  
  loadFromLocalStorage() {
    try {
      const savedAssets = localStorage.getItem("creative-assets");
      if (savedAssets) {
        const parsedAssets = JSON.parse(savedAssets);
        return parsedAssets.map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          relationships: asset.relationships.map((rel: any) => ({
            ...rel,
            createdAt: new Date(rel.createdAt)
          }))
        }));
      }
    } catch (error) {
      console.error("Error loading assets from localStorage:", error);
    }
    return [];
  },
  
  saveToLocalStorage(assets: Asset[]) {
    try {
      localStorage.setItem("creative-assets", JSON.stringify(assets));
    } catch (error) {
      console.error("Error saving assets to localStorage:", error);
    }
  },
  
  async addAsset(
    type: Asset["type"], 
    content: string, 
    tags: string[] = [], 
    metadata: Record<string, any> = {}
  ): Promise<Asset> {
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
            metadata,
            user_id: session.session.user.id
          })
          .select();
        
        if (error) {
          console.error("Error saving asset to Supabase:", error);
          toast.error("Failed to save asset to cloud. Changes saved locally only.");
          return newAsset;
        }
        
        if (data && data[0]) {
          // Return the asset with the Supabase ID
          return {
            ...newAsset,
            id: data[0].id
          };
        }
      }
    } catch (error) {
      console.error("Error in addAsset:", error);
    }

    return newAsset;
  },
  
  async updateAsset(id: string, data: Partial<Omit<Asset, "id" | "createdAt">>): Promise<void> {
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
  },
  
  async deleteAsset(id: string): Promise<void> {
    try {
      // Delete from Supabase
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
  },
  
  async createRelationship(
    sourceId: string, 
    targetId: string, 
    type: Relationship["type"], 
    strength: number = 5,
    metadata: Record<string, any> = {}
  ): Promise<Relationship> {
    const newRelationship: Relationship = {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      strength,
      createdAt: new Date(),
      metadata
    };

    try {
      // Create in Supabase
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
          // Return the relationship with the Supabase ID
          return {
            ...newRelationship,
            id: data[0].id
          };
        }
      }
    } catch (error) {
      console.error("Error in createRelationship:", error);
    }

    return newRelationship;
  },
  
  async updateRelationship(id: string, data: Partial<Omit<Relationship, "id" | "createdAt">>): Promise<void> {
    try {
      // Update in Supabase
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
  },
  
  async deleteRelationship(id: string): Promise<void> {
    try {
      // Delete from Supabase
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
  }
};
