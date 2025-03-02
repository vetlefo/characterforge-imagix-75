import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
        </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Drawing Editor Card */}
          <Link to="/drawing" className="group">
            <div className="feature-card modern-card bg-gradient-to-br from-[#1A1F2C] to-[#202042] p-6 h-full">
              <div className="mb-4 bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-line"><path d="M9.17 11.83 5.5 15.5V18h2.5l3.67-3.67L15.91 6.6a2.828 2.828 0 1 0-3.997-3.997L9.17 11.83Z"/><path d="M22 21H6"/><path d="m15 15 4 4"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">Drawing Editor</h3>
              <p className="text-gray-400">
                Create stunning digital drawings with a wide array of tools and brushes.
              </p>
            </div>
          </Link>
          
          {/* Website Preview Demo Card */}
          <Link to="/website-preview" className="group">
            <div className="feature-card modern-card bg-gradient-to-br from-[#1A1F2C] to-[#2A1F43] p-6 h-full">
              <div className="mb-4 bg-yellow-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor-check"><rect width="22" height="16" x="1" y="3" rx="2"/><path d="M1 21H23"/><path d="m17 9 2 3 1.5 1.5 3-3"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-yellow-300 transition-colors">Website Preview Demo</h3>
              <p className="text-gray-400">
                Generate live previews of website designs and ensure cross-device compatibility.
              </p>
            </div>
          </Link>
          
          {/* Asset Library Card */}
          <Link to="/asset-library" className="group">
            <div className="feature-card modern-card bg-gradient-to-br from-[#1A1F2C] to-[#1F2240] p-6 h-full">
              <div className="mb-4 bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library"><path d="m4 3 16 0"/><path d="m20 21-16 0"/><path d="m4 7 16 0"/><path d="m6 11 12 0"/><path d="m6 15 12 0"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-green-300 transition-colors">Asset Library</h3>
              <p className="text-gray-400">
                Explore a vast collection of design assets, templates, and UI components.
              </p>
            </div>
          </Link>
          
          {/* Style System Card */}
          <Link to="/style-system" className="group">
            <div className="feature-card modern-card bg-gradient-to-br from-[#1A1F2C] to-[#2A1F43] p-6 h-full">
              <div className="mb-4 bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">Style System</h3>
              <p className="text-gray-400">
                Manage color palettes, typography settings and spacing systems for consistent design.
              </p>
            </div>
          </Link>
          
        </div>
      </div>
      
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0F0F23] to-transparent"></div>
      </section>
    </div>
  );
};

export default Index;
