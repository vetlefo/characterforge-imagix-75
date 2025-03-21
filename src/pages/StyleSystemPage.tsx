
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StyleSystem } from "../components/creative/StyleSystem/StyleSystem";
import { StyleSystemProvider } from "../components/creative/StyleSystem/StyleSystemContext";
import { CreativeProvider } from "../components/creative/CreativeContext";
import Layout from "../components/Layout";

const StyleSystemPage = () => {
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
          <h1 className="text-3xl font-bold text-white">Style System</h1>
        </div>
        
        {/* Style System Component */}
        <CreativeProvider>
          <StyleSystemProvider>
            <StyleSystem />
          </StyleSystemProvider>
        </CreativeProvider>
      </div>
    </Layout>
  );
};

export default StyleSystemPage;
