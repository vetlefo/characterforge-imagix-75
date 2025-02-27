
import { useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { QuickStartItem } from "../components/QuickStartItem";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { Video, Paintbrush, Grid, FileText, ArrowUpRight } from "lucide-react";

const Index = () => {
  // Add a handler to add the logo.svg file if it's missing
  useEffect(() => {
    // Check if the logo exists, if not create a simple one
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.svg');
        if (response.status === 404) {
          console.log('Logo not found, would create one in a real app');
        }
      } catch (error) {
        console.log('Error checking logo:', error);
      }
    };
    
    checkLogo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <h1 className="text-3xl font-bold text-white mb-8">
                What would you like to create?
              </h1>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <CreationCard type="image" />
                <CreationCard type="storytelling" />
              </div>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Quick starts
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <QuickStartItem 
                    icon={<Video size={24} className="text-white" />}
                    title="Image to Video"
                    description="Bring your image to life"
                    isNew
                    iconBg="bg-yellow-600"
                  />
                  <QuickStartItem 
                    icon={<Paintbrush size={24} className="text-white" />}
                    title="Choose a Style"
                    description="Start with a style you like"
                    iconBg="bg-green-700"
                  />
                  <QuickStartItem 
                    icon={<Grid size={24} className="text-white" />}
                    title="Train Model"
                    description="Customize your creativity"
                    iconBg="bg-pink-600"
                  />
                  <QuickStartItem 
                    icon={<ArrowUpRight size={24} className="text-white" />}
                    title="Ultimate Upscale"
                    description="Upscale your images"
                    iconBg="bg-yellow-500"
                  />
                  <QuickStartItem 
                    icon={<FileText size={24} className="text-white" />}
                    title="Image to Prompt"
                    description="Convert image to text prompt"
                    iconBg="bg-green-600"
                  />
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Featured Apps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FeaturedAppCard 
                    title="Image to Video"
                    subtitle="By OpenArt"
                    imageSrc="/placeholder.svg"
                    isNew
                  />
                  <FeaturedAppCard 
                    title="Ultimate Upscale"
                    subtitle="By OpenArt"
                    imageSrc="/placeholder.svg"
                  />
                  <FeaturedAppCard 
                    title="AI Filters"
                    subtitle="By OpenArt"
                    imageSrc="/placeholder.svg"
                  />
                  <FeaturedAppCard 
                    title="Sketch to image"
                    subtitle="By OpenArt"
                    imageSrc="/placeholder.svg"
                  />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
