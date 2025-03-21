
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AssetLibrary from "../components/creative/AssetLibrary";
import { CreativeProvider } from "../components/creative/CreativeContext";
import Layout from "../components/Layout";
import SimpleCollaborationVisualizer from "../components/creative/SimpleCollaborationVisualizer";

const AssetLibraryPage = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Asset Library</h1>
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
