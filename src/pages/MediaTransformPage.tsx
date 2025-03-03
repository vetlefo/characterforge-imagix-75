
import React from 'react';
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CreativeProvider } from "../components/creative/CreativeContext";
import { AnimationProvider } from "../components/creative/AnimationSystem";
import MediaTransform from "../components/creative/MediaTransform/MediaTransform";

const MediaTransformPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F23]">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {/* Header with navigation */}
              <div className="mb-8 flex items-center">
                <Link to="/">
                  <Button variant="outline" size="icon" className="mr-4 rounded-full">
                    <ArrowLeft size={18} />
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">Media Transformation</h1>
              </div>
              
              <p className="text-gray-400 mb-8 max-w-3xl">
                Transform your media using advanced AI techniques for style extraction, code generation, and animation. 
                Select an image from your assets library or upload a new one to start the transformation process.
              </p>
              
              {/* Media Transform Component */}
              <CreativeProvider>
                <AnimationProvider>
                  <MediaTransform />
                </AnimationProvider>
              </CreativeProvider>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MediaTransformPage;
