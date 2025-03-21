
import React from 'react';
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CreativeProvider } from "../components/creative/CreativeContext";
import { AnimationProvider } from "../components/creative/AnimationSystem";
import MediaTransform from "../components/creative/MediaTransform/MediaTransform";
import Layout from "../components/Layout";

const MediaTransformPage: React.FC = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default MediaTransformPage;
