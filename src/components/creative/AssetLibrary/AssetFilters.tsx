
import React, { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreative } from '../CreativeContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Define the AssetFilterOptions type and export it
export interface AssetFilterOptions {
  types: string[];
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'a-z' | 'z-a';
}
type FilterProps = {
  onClose?: () => void;
  onFiltersChange: (filters: AssetFilterOptions) => void;
  availableTags: string[];
  filters: AssetFilterOptions;
};
const AssetFilters: React.FC<FilterProps> = ({
  onClose,
  onFiltersChange,
  availableTags,
  filters: initialFilters
}) => {
  const [activeFilters, setActiveFilters] = useState<AssetFilterOptions>(initialFilters || {
    types: [],
    tags: [],
    sortBy: 'newest'
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const handleTypeChange = (value: string) => {
    const newTypes = activeFilters.types.includes(value) ? activeFilters.types.filter(t => t !== value) : [...activeFilters.types, value];
    if (value === 'all') {
      // If "all" is selected, clear other selections
      setActiveFilters(prev => {
        const newFilters = {
          ...prev,
          types: []
        };
        onFiltersChange(newFilters);
        return newFilters;
      });
    } else {
      setActiveFilters(prev => {
        const newFilters = {
          ...prev,
          types: newTypes
        };
        onFiltersChange(newFilters);
        return newFilters;
      });
    }
  };
  
  const toggleTag = (tag: string) => {
    setActiveFilters(prev => {
      const newTags = prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag];
      const newFilters = {
        ...prev,
        tags: newTags
      };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };
  
  const handleDateRangeChange = (value: [number, number]) => {
    // Implementation would go here
    console.log('Date range changed:', value);
  };
  
  const handleSortChange = (value: AssetFilterOptions['sortBy']) => {
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        sortBy: value
      };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };
  
  const clearFilters = () => {
    const defaultFilters: AssetFilterOptions = {
      types: [],
      tags: [],
      sortBy: 'newest'
    };
    setActiveFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };
  
  const isTypeSelected = (type: string) => {
    if (type === 'all') {
      return activeFilters.types.length === 0;
    }
    return activeFilters.types.includes(type);
  };
  
  // Count active filters
  const activeFilterCount = activeFilters.types.length + activeFilters.tags.length + 
                          (activeFilters.sortBy !== 'newest' ? 1 : 0);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isOpen ? "text-primary" : "text-muted-foreground",
              activeFilterCount > 0 ? "text-primary font-medium" : ""
            )}
          >
            <Filter size={16} />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
        
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="mt-2">
        <div className="p-4 rounded-lg border border-border/40 bg-[#13132b]/60 backdrop-blur-sm">
          <Tabs defaultValue="type" className="w-full">
            <TabsList className="mb-4 bg-background/10 border border-border/30">
              <TabsTrigger value="type" className="text-xs">Type</TabsTrigger>
              <TabsTrigger value="tags" className="text-xs">Tags</TabsTrigger>
              <TabsTrigger value="sort" className="text-xs">Sort</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={isTypeSelected('all') ? "default" : "outline"} 
                  onClick={() => handleTypeChange('all')} 
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={isTypeSelected('image') ? "default" : "outline"} 
                  onClick={() => handleTypeChange('image')} 
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Images
                </Button>
                <Button 
                  variant={isTypeSelected('text') ? "default" : "outline"} 
                  onClick={() => handleTypeChange('text')} 
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Text
                </Button>
                <Button 
                  variant={isTypeSelected('website') ? "default" : "outline"} 
                  onClick={() => handleTypeChange('website')} 
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Websites
                </Button>
                <Button 
                  variant={isTypeSelected('other') ? "default" : "outline"} 
                  onClick={() => handleTypeChange('other')} 
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Other
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="space-y-3">
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map(tag => (
                    <Button 
                      key={tag} 
                      variant={activeFilters.tags.includes(tag) ? "default" : "outline"} 
                      onClick={() => toggleTag(tag)} 
                      size="sm"
                      className="text-xs h-7 px-2"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No tags available</p>
              )}
            </TabsContent>

            <TabsContent value="sort" className="space-y-2">
              <div className="space-y-1.5">
                <Button 
                  variant={activeFilters.sortBy === 'newest' ? "default" : "outline"} 
                  onClick={() => handleSortChange('newest')} 
                  className="w-full justify-start text-xs h-8"
                  size="sm"
                >
                  Newest First
                </Button>
                <Button 
                  variant={activeFilters.sortBy === 'oldest' ? "default" : "outline"} 
                  onClick={() => handleSortChange('oldest')} 
                  className="w-full justify-start text-xs h-8"
                  size="sm"
                >
                  Oldest First
                </Button>
                <Button 
                  variant={activeFilters.sortBy === 'a-z' ? "default" : "outline"} 
                  onClick={() => handleSortChange('a-z')} 
                  className="w-full justify-start text-xs h-8"
                  size="sm"
                >
                  A to Z
                </Button>
                <Button 
                  variant={activeFilters.sortBy === 'z-a' ? "default" : "outline"} 
                  onClick={() => handleSortChange('z-a')} 
                  className="w-full justify-start text-xs h-8"
                  size="sm"
                >
                  Z to A
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AssetFilters;
