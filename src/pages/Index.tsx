
// Importing necessary components
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import Layout from "../components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuickStartItem from "@/components/QuickStartItem";
import { FeaturedAppCard } from "@/components/FeaturedAppCard";
import { ModelCard } from "@/components/ModelCard";
import { CreationCard } from "@/components/CreationCard";

// Main component for the landing page
export default function Index() {
  // Render the main component
  return (
    <Layout>
      <div className="p-6 md:p-8 h-screen overflow-y-auto bg-[#0F0F23]">
        {/* Hero section */}
        <section className="my-12 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Creative Platform <span className="text-[#818cf8]">for Professionals</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            All-in-one platform to manage creative assets, workflows, and collaborative projects
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/drawing">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </section>

        {/* Quick start section */}
        <section className="my-12 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickStartItem
              title="Drawing Tools"
              description="Create and edit drawings with our robust drawing tools"
              icon="Paintbrush"
              link="/drawing"
            />
            <QuickStartItem
              title="Asset Library"
              description="Manage all your creative assets in one place"
              icon="Images"
              link="/asset-library"
            />
            <QuickStartItem
              title="Dependency Visualizer"
              description="Visualize file relationships and dependencies"
              icon="Network"
              link="/dependency-visualizer"
              isNew={true}
            />
            <QuickStartItem
              title="Style System"
              description="Define and manage styles for your designs"
              icon="Palette"
              link="/style-system"
            />
          </div>
        </section>

        {/* Featured apps */}
        <section className="my-12 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Tools</h2>
            <Button variant="ghost" asChild className="text-blue-400 hover:text-blue-300">
              <Link to="/integrations" className="flex items-center">
                View All <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturedAppCard
              title="Website Preview"
              subtitle="Preview websites with instant updates"
              imageSrc="https://source.unsplash.com/random/400x300?website"
            />
            <FeaturedAppCard
              title="Media Transform"
              subtitle="Convert media between different formats"
              imageSrc="https://source.unsplash.com/random/400x300?media"
            />
            <FeaturedAppCard
              title="Animation Studio"
              subtitle="Create and edit animations"
              imageSrc="https://source.unsplash.com/random/400x300?animation"
            />
          </div>
        </section>

        {/* Recent Creations Section */}
        <section className="my-12 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Recent Creations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CreationCard
              type="image"
              name="Abstract Art"
              image="https://source.unsplash.com/random/400x300?art"
            />
            <CreationCard
              type="image"
              name="Modern Logo"
              image="https://source.unsplash.com/random/400x300?logo"
            />
            <CreationCard
              type="image"
              name="UI Mockup"
              image="https://source.unsplash.com/random/400x300?ui"
            />
            <CreationCard
              type="image"
              name="3D Render"
              image="https://source.unsplash.com/random/400x300?3d"
            />
          </div>
        </section>

        {/* Available Models Section */}
        <section className="my-12 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Available Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModelCard
              title="Stable Diffusion"
              subtitle="Generate high-quality images from text prompts"
              imageSrc="https://source.unsplash.com/random/400x300?ai"
              tags={[{ label: "Image Generation", variant: "blue" }]}
            />
            <ModelCard
              title="GPT-3"
              subtitle="Powerful language model for text generation"
              imageSrc="https://source.unsplash.com/random/400x300?language"
              tags={[{ label: "Text Generation", variant: "green" }]}
            />
            <ModelCard
              title="DALL-E 2"
              subtitle="Create realistic images and art from a description in natural language"
              imageSrc="https://source.unsplash.com/random/400x300?robot"
              tags={[{ label: "Image Generation", variant: "blue" }]}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
