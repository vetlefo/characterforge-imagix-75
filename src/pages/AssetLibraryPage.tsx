
import { Button } from "../components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AssetLibrary from "../components/creative/AssetLibrary";
import { CreativeProvider } from "../components/creative/CreativeContext";
import Layout from "../components/Layout";
import SimpleCollaborationVisualizer from "../components/creative/SimpleCollaborationVisualizer";

const AssetLibraryPage = () => {
  return (
    <Layout>
      <div className="p-6 md:p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Asset Library</h1>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
              onClick={() => document.getElementById('create-asset-btn')?.click()}
            >
              <Plus size={16} />
              Create Asset
            </Button>
          </div>
          
          <CreativeProvider>
            <AssetLibrary />
          </CreativeProvider>
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default AssetLibraryPage;
