
import { useState } from "react";
import { Asset } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon, Image, FileText, Globe, TagIcon, Calendar, SortAsc, SortDesc } from "lucide-react";

export type AssetFilterOptions = {
  types: Asset["type"][];
  tags: string[];
  sortBy: "newest" | "oldest" | "a-z" | "z-a";
};

interface AssetFiltersProps {
  availableTags: string[];
  filters: AssetFilterOptions;
  onFilterChange: (filters: AssetFilterOptions) => void;
}

const AssetFilters = ({ availableTags, filters, onFilterChange }: AssetFiltersProps) => {
  // Helper to toggle items in an array
  const toggleArrayItem = <T extends unknown>(array: T[], item: T): T[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleTypeToggle = (type: Asset["type"]) => {
    onFilterChange({
      ...filters,
      types: toggleArrayItem(filters.types, type)
    });
  };

  const handleTagToggle = (tag: string) => {
    onFilterChange({
      ...filters,
      tags: toggleArrayItem(filters.tags, tag)
    });
  };

  const handleSortChange = (sortBy: AssetFilterOptions["sortBy"]) => {
    onFilterChange({
      ...filters,
      sortBy
    });
  };

  const clearFilters = () => {
    onFilterChange({
      types: [],
      tags: [],
      sortBy: "newest"
    });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.tags.length > 0 || filters.sortBy !== "newest";

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`gap-2 h-8 bg-[#1A1A2E]/50 border-[#2A2A4A]/30 ${
                  filters.types.length > 0 ? "text-blue-400 border-blue-500/30" : ""
                }`}
              >
                <FilterIcon size={14} />
                Type
                {filters.types.length > 0 && (
                  <Badge className="ml-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    {filters.types.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A2E] border-[#2A2A4A]/30">
              <DropdownMenuCheckboxItem 
                checked={filters.types.includes("image")}
                onCheckedChange={() => handleTypeToggle("image")}
              >
                <Image size={14} className="mr-2" />
                Images
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filters.types.includes("text")}
                onCheckedChange={() => handleTypeToggle("text")}
              >
                <FileText size={14} className="mr-2" />
                Text
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filters.types.includes("website")}
                onCheckedChange={() => handleTypeToggle("website")}
              >
                <Globe size={14} className="mr-2" />
                Websites
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filters.types.includes("other")}
                onCheckedChange={() => handleTypeToggle("other")}
              >
                Other
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`gap-2 h-8 bg-[#1A1A2E]/50 border-[#2A2A4A]/30 ${
                  filters.tags.length > 0 ? "text-purple-400 border-purple-500/30" : ""
                }`}
              >
                <TagIcon size={14} />
                Tags
                {filters.tags.length > 0 && (
                  <Badge className="ml-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A2E] border-[#2A2A4A]/30 max-h-60 overflow-y-auto">
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag}
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No tags available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-8 bg-[#1A1A2E]/50 border-[#2A2A4A]/30"
              >
                {filters.sortBy === "newest" || filters.sortBy === "oldest" ? (
                  <Calendar size={14} />
                ) : (
                  filters.sortBy === "a-z" ? <SortAsc size={14} /> : <SortDesc size={14} />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A2E] border-[#2A2A4A]/30">
              <DropdownMenuItem onClick={() => handleSortChange("newest")}>
                <Calendar size={14} className="mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("oldest")}>
                <Calendar size={14} className="mr-2" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => handleSortChange("a-z")}>
                <SortAsc size={14} className="mr-2" />
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("z-a")}>
                <SortDesc size={14} className="mr-2" />
                Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 text-xs text-white/70 hover:text-white"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {(filters.types.length > 0 || filters.tags.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {filters.types.map(type => (
            <Badge 
              key={type}
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
            >
              {type}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 text-blue-400 hover:text-blue-300 p-0"
                onClick={() => handleTypeToggle(type)}
              >
                <X size={10} />
              </Button>
            </Badge>
          ))}
          
          {filters.tags.map(tag => (
            <Badge 
              key={tag}
              variant="outline"
              className="bg-purple-500/10 text-purple-400 border-purple-500/20"
            >
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 text-purple-400 hover:text-purple-300 p-0"
                onClick={() => handleTagToggle(tag)}
              >
                <X size={10} />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetFilters;
