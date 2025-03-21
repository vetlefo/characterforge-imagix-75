
import React from 'react';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Welcome to the Creative Platform</h1>
          <p className="text-gray-300 mb-8">Select an option from the sidebar to start your creative journey.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature cards */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Drawing</h2>
              <p className="text-gray-400 mb-4">Create digital artwork with our drawing tools.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Styling</h2>
              <p className="text-gray-400 mb-4">Customize the appearance with the style system.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Animation</h2>
              <p className="text-gray-400 mb-4">Bring your creations to life with animations.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Media</h2>
              <p className="text-gray-400 mb-4">Transform and manipulate media assets.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Website</h2>
              <p className="text-gray-400 mb-4">Preview and optimize your website designs.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-2 text-white">Asset Library</h2>
              <p className="text-gray-400 mb-4">Manage your creative assets in one place.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
