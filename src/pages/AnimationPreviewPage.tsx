
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AnimationSystem from '@/components/creative/AnimationSystem';

const AnimationPreviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F23] text-white">
      <header className="bg-[#0A0A1B] border-b border-[#1A1A2E] p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <h1 className="text-xl font-medium text-white">Animation Designer</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        <AnimationSystem />
      </main>
    </div>
  );
};

export default AnimationPreviewPage;
