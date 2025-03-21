
import { StyleSystem } from "../components/creative/StyleSystem/StyleSystem";
import { StyleSystemProvider } from "../components/creative/StyleSystem/StyleSystemContext";
import { CreativeProvider } from "../components/creative/CreativeContext";
import Layout from "../components/Layout";
import SimpleCollaborationVisualizer from "../components/creative/SimpleCollaborationVisualizer";

const StyleSystemPage = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Style System</h1>
          <CreativeProvider>
            <StyleSystemProvider>
              <StyleSystem />
            </StyleSystemProvider>
          </CreativeProvider>
        </div>
      </div>
      <SimpleCollaborationVisualizer />
    </Layout>
  );
};

export default StyleSystemPage;
