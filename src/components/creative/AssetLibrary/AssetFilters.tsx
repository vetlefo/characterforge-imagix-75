
import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreative } from '../CreativeContext';

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
  
  const handleTypeChange = (value: string) => {
    const newTypes = activeFilters.types.includes(value)
      ? activeFilters.types.filter(t => t !== value)
      : [...activeFilters.types, value];
      
    if (value === 'all') {
      // If "all" is selected, clear other selections
      setActiveFilters(prev => {
        const newFilters = { ...prev, types: [] };
        onFiltersChange(newFilters);
        return newFilters;
      });
    } else {
      setActiveFilters(prev => {
        const newFilters = { ...prev, types: newTypes };
        onFiltersChange(newFilters);
        return newFilters;
      });
    }
  };

  const toggleTag = (tag: string) => {
    setActiveFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      const newFilters = { ...prev, tags: newTags };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const handleDateRangeChange = (value: [number, number]) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, dateRange: value };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const handleSortChange = (value: AssetFilterOptions['sortBy']) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, sortBy: value };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const defaultFilters = {
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

  return (
    <div className="p-5 bg-card rounded-xl border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        )}
      </div>

      <Tabs defaultValue="type" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="sort">Sort</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isTypeSelected('all') ? 'default' : 'outline'}
              onClick={() => handleTypeChange('all')}
              className="w-full"
            >
              All
            </Button>
            <Button
              variant={isTypeSelected('image') ? 'default' : 'outline'}
              onClick={() => handleTypeChange('image')}
              className="w-full"
            >
              Images
            </Button>
            <Button
              variant={isTypeSelected('text') ? 'default' : 'outline'}
              onClick={() => handleTypeChange('text')}
              className="w-full"
            >
              Text
            </Button>
            <Button
              variant={isTypeSelected('website') ? 'default' : 'outline'}
              onClick={() => handleTypeChange('website')}
              className="w-full"
            >
              Websites
            </Button>
            <Button
              variant={isTypeSelected('other') ? 'default' : 'outline'}
              onClick={() => handleTypeChange('other')}
              className="w-full"
            >
              Other
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  variant={activeFilters.tags.includes(tag) ? 'default' : 'outline'}
                  onClick={() => toggleTag(tag)}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags available</p>
          )}
        </TabsContent>

        <TabsContent value="sort" className="space-y-4">
          <div className="space-y-2">
            <Button
              variant={activeFilters.sortBy === 'newest' ? 'default' : 'outline'}
              onClick={() => handleSortChange('newest')}
              className="w-full justify-start"
            >
              Newest First
            </Button>
            <Button
              variant={activeFilters.sortBy === 'oldest' ? 'default' : 'outline'}
              onClick={() => handleSortChange('oldest')}
              className="w-full justify-start"
            >
              Oldest First
            </Button>
            <Button
              variant={activeFilters.sortBy === 'a-z' ? 'default' : 'outline'}
              onClick={() => handleSortChange('a-z')}
              className="w-full justify-start"
            >
              A to Z
            </Button>
            <Button
              variant={activeFilters.sortBy === 'z-a' ? 'default' : 'outline'}
              onClick={() => handleSortChange('z-a')}
              className="w-full justify-start"
            >
              Z to A
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default AssetFilters;
