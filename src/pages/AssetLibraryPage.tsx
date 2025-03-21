
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AssetLibrary from "../components/creative/AssetLibrary";
import { CreativeProvider } from "../components/creative/CreativeContext";
import Layout from "../components/Layout";

const AssetLibraryPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full px-6 py-8">
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
    </Layout>
  );
};

export default AssetLibraryPage;
