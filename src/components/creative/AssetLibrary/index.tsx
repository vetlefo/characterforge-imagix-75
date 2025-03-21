
import { useState, useEffect, useMemo } from "react";
import { Asset } from "../types";
import { useCreative } from "../CreativeContext";
import AssetCard from "./AssetCard";
import AssetSearch from "./AssetSearch";
import AssetFilters, { AssetFilterOptions } from "./AssetFilters";
import EmptyState from "./EmptyState";
import DrawingModule from "@/components/draw/DrawingModule";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Image, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface AssetLibraryProps {
  className?: string;
}

const AssetLibrary = ({
  className
}: AssetLibraryProps) => {
  const {
    assets,
    addAsset,
    deleteAsset,
    updateAsset,
    selectedAssetId,
    setSelectedAssetId,
    tags
  } = useCreative();

  // State for asset creation
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [newAssetType, setNewAssetType] = useState<Asset["type"]>("image");
  const [newAssetTitle, setNewAssetTitle] = useState("");
  const [newAssetContent, setNewAssetContent] = useState("");
  const [newAssetTags, setNewAssetTags] = useState("");
  const [drawingDialogOpen, setDrawingDialogOpen] = useState(false);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AssetFilterOptions>({
    types: [],
    tags: [],
    sortBy: "newest"
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Use the tags from the context
  const availableTags = useMemo(() => {
    return tags;
  }, [tags]);

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Please log in to access your asset library");
      }
    };
    checkSession();
  }, []);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Apply type filter
    if (filters.types.length > 0) {
      result = result.filter(asset => filters.types.includes(asset.type));
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      result = result.filter(asset => filters.tags.some(tag => asset.tags.includes(tag)));
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(asset => {
        // Search in title (from metadata)
        const titleMatch = asset.metadata.title ? asset.metadata.title.toString().toLowerCase().includes(searchLower) : false;

        // Search in content (for text assets)
        const contentMatch = asset.type === "text" ? asset.content.toLowerCase().includes(searchLower) : false;

        // Search in tags
        const tagMatch = asset.tags.some(tag => tag.toLowerCase().includes(searchLower));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "a-z":
          return (a.metadata.title || "").toString().localeCompare((b.metadata.title || "").toString());
        case "z-a":
          return (b.metadata.title || "").toString().localeCompare((a.metadata.title || "").toString());
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [assets, filters, searchTerm]);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    toast.info(`Selected: ${asset.metadata.title || asset.type}`);
  };

  const handleCreateAsset = async () => {
    if (newAssetType === "image" && !newAssetContent) {
      toast.error("Please create or upload an image");
      return;
    }
    if (newAssetType === "text" && !newAssetContent.trim()) {
      toast.error("Please enter some text content");
      return;
    }
    if (newAssetType === "website" && !newAssetContent.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Parse tags
    const tagArray = newAssetTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

    try {
      // Create the asset in the context (which will handle Supabase interaction)
      addAsset(newAssetType, newAssetContent, tagArray, {
        title: newAssetTitle || `New ${newAssetType}`
      });

      // Reset form
      setNewAssetType("image");
      setNewAssetTitle("");
      setNewAssetContent("");
      setNewAssetTags("");

      // Close dialog
      setCreationDialogOpen(false);
      toast.success("Asset created successfully");
    } catch (error) {
      console.error("Error creating asset:", error);
      toast.error("Failed to create asset");
    }
  };

  const handleDrawingComplete = (dataUrl: string) => {
    setNewAssetContent(dataUrl);
    setDrawingDialogOpen(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-medium text-white">Your personal media assets</h2>
          
          <Dialog open={creationDialogOpen} onOpenChange={setCreationDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                id="create-asset-btn"
                variant="outline" 
                size="sm" 
                className="gap-2 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
              >
                <PlusCircle size={16} />
                Create Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A1B] border-[#2A2A4A]/30 text-white">
              <DialogHeader>
                <DialogTitle>Create New Asset</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <Tabs defaultValue="image" value={newAssetType} onValueChange={value => setNewAssetType(value as Asset["type"])} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#1A1A2E]">
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="website">Website</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="image" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image-title">Title</Label>
                        <Input id="image-title" placeholder="Enter asset title" value={newAssetTitle} onChange={e => setNewAssetTitle(e.target.value)} className="bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image</Label>
                        {newAssetContent ? (
                          <div className="relative aspect-square max-h-60 bg-black/20 rounded-md overflow-hidden">
                            <img src={newAssetContent} alt="New asset preview" className="w-full h-full object-contain" />
                            <Button variant="outline" size="sm" className="absolute bottom-2 right-2 h-7 bg-black/50 backdrop-blur-sm" onClick={() => setDrawingDialogOpen(true)}>
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="aspect-square max-h-60 bg-black/20 rounded-md flex flex-col items-center justify-center p-4">
                            <Image size={48} className="text-white/20 mb-4" />
                            <Button onClick={() => setDrawingDialogOpen(true)} className="bg-[#1A1A2E] border border-[#2A2A4A]/50">
                              Create Drawing
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text-title">Title</Label>
                        <Input id="text-title" placeholder="Enter asset title" value={newAssetTitle} onChange={e => setNewAssetTitle(e.target.value)} className="bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="text-content">Content</Label>
                        <Textarea id="text-content" placeholder="Enter text content" value={newAssetContent} onChange={e => setNewAssetContent(e.target.value)} className="min-h-32 bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="website" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website-title">Title</Label>
                        <Input id="website-title" placeholder="Enter website title" value={newAssetTitle} onChange={e => setNewAssetTitle(e.target.value)} className="bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website-url">URL</Label>
                        <Input id="website-url" placeholder="https://example.com" value={newAssetContent} onChange={e => setNewAssetContent(e.target.value)} className="bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                        {newAssetContent && !newAssetContent.startsWith('http') && (
                          <p className="text-yellow-400 text-xs flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            URL should start with http:// or https://
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="creative, draft, idea" value={newAssetTags} onChange={e => setNewAssetTags(e.target.value)} className="bg-[#1A1A2E]/50 border-[#2A2A4A]/30" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreationDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleCreateAsset}>
                  Create Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Drawing Dialog */}
          <DrawingModule 
            onDrawingComplete={handleDrawingComplete} 
            triggerLabel="Open Drawing Canvas" 
            modalTitle="Create Your Drawing" 
            width={512} 
            height={512} 
            open={drawingDialogOpen} 
            onOpenChange={setDrawingDialogOpen} 
          />
        </div>
        
        <div className="space-y-4">
          <AssetSearch onSearch={setSearchTerm} />
          
          <AssetFilters availableTags={availableTags} filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1A1A2E]/20 rounded-lg p-4 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState onCreateNew={() => setCreationDialogOpen(true)} filtered={searchTerm !== "" || filters.types.length > 0 || filters.tags.length > 0} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <AssetCard key={asset.id} asset={asset} onSelect={handleAssetSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;
