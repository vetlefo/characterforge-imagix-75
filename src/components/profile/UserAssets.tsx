
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';

const UserAssets = () => {
  const assets = [
    {
      id: 1,
      title: 'UI Kit - Cosmic',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
      type: 'UI Kit',
      downloads: 124,
      date: '1 week ago'
    },
    {
      id: 2,
      title: 'Icon Set - Minimal',
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
      type: 'Icons',
      downloads: 89,
      date: '2 weeks ago'
    },
    {
      id: 3,
      title: 'Pattern Library',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      type: 'Patterns',
      downloads: 67,
      date: '3 weeks ago'
    },
    {
      id: 4,
      title: 'Animation Pack',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      type: 'Animation',
      downloads: 53,
      date: '1 month ago'
    },
    {
      id: 5,
      title: 'Color Palette Collection',
      thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2074&auto=format&fit=crop',
      type: 'Colors',
      downloads: 118,
      date: '1 month ago'
    },
    {
      id: 6,
      title: 'Texture Pack - Futuristic',
      thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop',
      type: 'Textures',
      downloads: 75,
      date: '2 months ago'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="bg-[#0f0f23] border-[#333370]/30 overflow-hidden flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-[#0f0f23]">
              <img 
                src={asset.thumbnail} 
                alt={asset.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-black/50 border-white/20">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-black/50 border-white/20">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-[#0f0f23] text-xs px-2 py-1 rounded-full opacity-80">
                {asset.type}
              </div>
            </div>
            
            <div className="p-3 text-center">
              <h3 className="text-sm font-medium text-white mb-1 truncate">{asset.title}</h3>
              <p className="text-xs text-gray-400">{asset.downloads} downloads</p>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
          Browse Asset Library
        </Button>
      </div>
    </div>
  );
};

export default UserAssets;
