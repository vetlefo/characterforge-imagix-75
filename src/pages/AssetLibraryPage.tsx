
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AssetLibrary from "../components/creative/AssetLibrary";
import { CreativeProvider } from "../components/creative/CreativeContext";

const AssetLibraryPage = () => {
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
                <h1 className="text-3xl font-bold text-white">Asset Library</h1>
              </div>
              
              {/* Asset Library Component */}
              <CreativeProvider>
                <AssetLibrary />
              </CreativeProvider>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AssetLibraryPage;
