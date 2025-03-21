
import React from 'react';
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StyleSystem } from "../components/creative/StyleSystem/StyleSystem";
import { StyleSystemProvider } from "../components/creative/StyleSystem/StyleSystemContext";
import { CreativeProvider } from "../components/creative/CreativeContext";
import { SidebarProvider } from "@/components/ui/sidebar";

const StyleSystemPage = () => {
  return (
    <SidebarProvider>
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
                  <h1 className="text-3xl font-bold text-white">Style System</h1>
                </div>
                
                {/* Style System Component */}
                <CreativeProvider>
                  <StyleSystemProvider>
                    <StyleSystem />
                  </StyleSystemProvider>
                </CreativeProvider>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StyleSystemPage;
