
import React from "react";
import { Link } from "react-router-dom";
import { Home, PenLine, Layers, Play, LightbulbIcon, Orbit, Combine } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreativePossibilities from "@/components/creative/CreativePossibilities";
import InspirationalEchoes from "@/components/creative/InspirationalEchoes";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0F0F23] text-white">
      {/* Left Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-[60px] bg-[#0A0A1B] flex flex-col items-center py-6 z-10">
        <div className="mb-10">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black text-lg">∞</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 mt-4">
          <Link to="/" className="flex flex-col items-center text-blue-400">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/drawing" className="flex flex-col items-center text-gray-500 hover:text-gray-300 transition-colors">
            <PenLine size={20} />
            <span className="text-xs mt-1">Create</span>
          </Link>
          <Link to="/style-system" className="flex flex-col items-center text-gray-500 hover:text-gray-300 transition-colors">
            <Layers size={20} />
            <span className="text-xs mt-1">Journey</span>
          </Link>
          <div className="flex flex-col items-center text-gray-500 hover:text-gray-300 transition-colors">
            <LightbulbIcon size={20} />
            <span className="text-xs mt-1">Insight</span>
          </div>
          <Link to="/animation" className="flex flex-col items-center text-gray-500 hover:text-gray-300 transition-colors">
            <Play size={20} />
            <span className="text-xs mt-1">Explore</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[60px] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-16 text-center">What would you like to create today?</h1>

          {/* Creative Partner Section */}
          <div className="mb-12 bg-[#0D0D1F] rounded-xl p-6 border border-[#1A1F2C]/30 float-right w-[350px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-500/20 p-1 rounded">
                <LightbulbIcon size={16} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-medium">Creative Partner</h2>
              <div className="ml-auto text-lg">—</div>
            </div>
            <p className="text-gray-400 text-sm mb-4">Share your creative intention...</p>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center text-center mb-24 py-16 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-[#1A1F2C] rounded-full flex items-center justify-center mb-6">
              <LightbulbIcon size={32} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Begin your creative journey</h2>
            <p className="text-gray-400 mb-8">The canvas awaits your intention</p>
            
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <LightbulbIcon size={16} className="mr-2" />
                Start Creating
              </Button>
              <Button variant="outline" className="border-gray-700">
                <Play size={16} className="mr-2" />
                Import Inspiration
              </Button>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-24 max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you imagining?"
                className="w-full bg-[#0D0D1F] border border-[#1A1F2C] rounded-full py-3 px-6 text-white"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full">
                <LightbulbIcon size={16} />
              </button>
            </div>
          </div>

          {/* Creative Possibilities Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Creative Possibilities</h2>
            <CreativePossibilities />
          </div>

          {/* Inspirational Echoes Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Inspirational Echoes</h2>
            <InspirationalEchoes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
