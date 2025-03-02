
import { useState } from "react";
import { Asset } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Edit, Copy, Trash, Tag, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCreative } from "../CreativeContext";

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

const AssetCard = ({ asset, onSelect }: AssetCardProps) => {
  const { deleteAsset, updateAsset, addAsset, getRelatedAssets } = useCreative();
  const [showDetails, setShowDetails] = useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAsset(asset.id);
    toast.success("Asset deleted");
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newAsset = addAsset(
      asset.type,
      asset.content,
      [...asset.tags],
      { ...asset.metadata, duplicatedFrom: asset.id }
    );
    toast.success("Asset duplicated");
  };
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    toast.info(`Filtering by tag: ${tag}`);
    // Tag filtering will be handled by the parent component
  };
  
  const relatedAssets = getRelatedAssets(asset.id);

  const renderAssetContent = () => {
    switch (asset.type) {
      case "image":
        return (
          <div className="w-full h-40 overflow-hidden rounded-md bg-black flex items-center justify-center">
            <img 
              src={asset.content} 
              alt={asset.metadata.title || "Image asset"} 
              className="w-full h-full object-contain" 
            />
          </div>
        );
      case "text":
        return (
          <div className="w-full h-40 overflow-auto p-3 bg-black/20 rounded-md">
            <p className="text-sm text-white/90">{asset.content}</p>
          </div>
        );
      case "website":
        return (
          <div className="w-full h-40 overflow-hidden rounded-md bg-black/40 flex items-center justify-center">
            <iframe 
              src={asset.content} 
              title={asset.metadata.title || "Website preview"} 
              className="w-full h-full border-0" 
              sandbox="allow-scripts"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-40 flex items-center justify-center bg-black/20 rounded-md">
            <p className="text-sm text-white/70">Unknown asset type</p>
          </div>
        );
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden border-[#2A2A4A]/30 bg-[#1A1A2E]/50 backdrop-blur-sm hover:bg-[#1A1A2E]/70 transition-colors group cursor-pointer"
        onClick={() => onSelect(asset)}
      >
        <CardContent className="p-3">
          {renderAssetContent()}
          
          <div className="mt-3 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-white/90 truncate">
                {asset.metadata.title || `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} Asset`}
              </h3>
              <p className="text-xs text-white/60">
                {format(new Date(asset.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-[#2A2A4A]/30">
                <DropdownMenuLabel className="text-white/80">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}>
                  <Edit className="mr-2" size={14} />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2" size={14} />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash className="mr-2" size={14} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {asset.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {asset.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                >
                  +{asset.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-[#0A0A1B] border-[#2A2A4A]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="max-h-60 overflow-hidden rounded-md bg-black/20 max-w-full">
                {asset.type === "image" && (
                  <img 
                    src={asset.content} 
                    alt={asset.metadata.title || "Image asset"} 
                    className="max-h-60 object-contain" 
                  />
                )}
                {asset.type === "text" && (
                  <div className="p-4 max-h-60 overflow-auto">
                    <p className="text-white/90">{asset.content}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Information</h3>
              <div className="bg-[#1A1A2E] rounded-md p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/60">Type</div>
                  <div className="text-white/90">{asset.type}</div>
                  
                  <div className="text-white/60">Created</div>
                  <div className="text-white/90">{format(new Date(asset.createdAt), "PPP")}</div>
                  
                  <div className="text-white/60">Last Modified</div>
                  <div className="text-white/90">{format(new Date(asset.updatedAt), "PPP")}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium">Tags</h3>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Tag size={12} className="mr-1" />
                  Edit Tags
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {asset.tags.length > 0 ? (
                  asset.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-white/60 text-sm">No tags added</p>
                )}
              </div>
            </div>
            
            {relatedAssets.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">Related Assets</h3>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Link size={12} className="mr-1" />
                    Manage Links
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {relatedAssets.slice(0, 3).map((relatedAsset) => (
                    <div 
                      key={relatedAsset.id} 
                      className="bg-[#1A1A2E] p-2 rounded-md text-xs border border-[#2A2A4A]/30"
                    >
                      <div className="h-16 mb-1 bg-black/20 rounded-sm overflow-hidden">
                        {relatedAsset.type === "image" && (
                          <img 
                            src={relatedAsset.content} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <div className="truncate">{relatedAsset.metadata.title || "Asset"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetCard;
