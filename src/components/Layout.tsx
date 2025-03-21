
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarComponent from './navigation/Sidebar';
import UserNavigation from './navigation/UserNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <SidebarProvider defaultOpen={isExpanded}>
      <div className="flex h-screen w-full bg-background">
        <SidebarComponent 
          isExpanded={isExpanded} 
          toggleSidebar={toggleSidebar} 
        />
        
        <div className="flex flex-col flex-1 overflow-hidden bg-[#0F0F23]">
          {/* Top navigation bar for user and settings */}
          <header className="h-12 bg-[#0f0f23] border-b border-[#333370]/30 px-4 flex items-center justify-end">
            <UserNavigation />
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
