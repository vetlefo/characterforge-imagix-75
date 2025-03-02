
import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreative } from '../CreativeContext';

type FilterProps = {
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
};

const AssetFilters: React.FC<FilterProps> = ({ onClose, onFiltersChange }) => {
  const { tags } = useCreative();
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    tags: [] as string[],
    dateRange: [0, 100] as [number, number],
  });

  // Get unique tags from all assets
  const uniqueTags = Array.from(new Set(tags));

  const handleTypeChange = (value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, type: value };
      onFiltersChange(newFilters);
      return newFilters;
    });
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

  const clearFilters = () => {
    const defaultFilters = {
      type: 'all',
      tags: [] as string[],
      dateRange: [0, 100] as [number, number],
    };
    setActiveFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="p-5 bg-card rounded-xl border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <Tabs defaultValue="type" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="date">Date</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeFilters.type === 'all' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('all')}
              className="w-full"
            >
              All
            </Button>
            <Button
              variant={activeFilters.type === 'image' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('image')}
              className="w-full"
            >
              Images
            </Button>
            <Button
              variant={activeFilters.type === 'text' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('text')}
              className="w-full"
            >
              Text
            </Button>
            <Button
              variant={activeFilters.type === 'component' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('component')}
              className="w-full"
            >
              Components
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          {uniqueTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map(tag => (
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

        <TabsContent value="date" className="space-y-4">
          <div>
            <Label className="mb-2 block">Date Created</Label>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={activeFilters.dateRange}
              onValueChange={handleDateRangeChange as (value: number[]) => void}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Oldest</span>
              <span>Newest</span>
            </div>
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
