
import React from 'react';
import { 
  SidebarProvider, Sidebar as UISidebar, SidebarContent, 
  SidebarHeader, SidebarFooter, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton, SidebarGroup 
} from '@/components/ui/sidebar';
import { 
  Home, PenLine, Layers, Play, Orbit, 
  PanelLeft, PanelRight, BookImage, Palette, Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const location = useLocation();
  
  return (
    <UISidebar 
      variant="sidebar" 
      collapsible={isExpanded ? "none" : "icon"} 
      className="bg-[#333370] z-50 border-none" 
      style={{
        "--sidebar-width": "200px",
        "--sidebar-width-icon": "50px"
      } as React.CSSProperties}
    >
      <SidebarHeader className="bg-[#0f0f23]">
        <div className="flex h-14 items-center justify-center px-4 bg-[#0f0f23]">
          <strong className="text-lg font-semibold text-center">OI</strong>
          
          {/* Toggle button that appears only when sidebar is expanded */}
          {isExpanded && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="ml-auto text-white hover:bg-[#1a1a40]"
            >
              <PanelLeft size={18} />
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#0f0f23]">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="bg-[#0f0f23]">
              <SidebarMenuButton asChild tooltip="Home" isActive={location.pathname === '/' || location.pathname === '/home'}>
                <Link to="/">
                  <Home size={20} />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Create" isActive={location.pathname === '/drawing'}>
                <Link to="/drawing">
                  <PenLine size={20} />
                  <span>Create</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Style" isActive={location.pathname === '/styling' || location.pathname === '/style-system'}>
                <Link to="/styling">
                  <Layers size={20} />
                  <span>Style</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Animation" isActive={location.pathname === '/animation'}>
                <Link to="/animation">
                  <Play size={20} />
                  <span>Animation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Media" isActive={location.pathname === '/media'}>
                <Link to="/media">
                  <Orbit size={20} />
                  <span>Media</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Website" isActive={location.pathname === '/website' || location.pathname === '/website-preview-demo'}>
                <Link to="/website">
                  <Palette size={20} />
                  <span>Website</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Assets" isActive={location.pathname === '/asset-library'}>
                <Link to="/asset-library">
                  <BookImage size={20} />
                  <span>Assets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-[#0f0f23]">
        <div className="flex flex-col items-center w-full p-2">
          {/* Center everything within a precisely 50px width container */}
          <div className="flex flex-col items-center w-[50px]">
            <SidebarMenu className="w-full">
              <SidebarMenuItem className="flex justify-center">
                <SidebarMenuButton asChild tooltip="Settings" isActive={location.pathname === '/settings'}>
                  <Link to="/settings" className="flex items-center justify-center">
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            {/* Toggle button in footer when collapsed */}
            {!isExpanded && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="flex justify-center text-white hover:bg-[#1a1a40] mt-3 mb-2 w-8 h-8 p-0"
              >
                <PanelRight size={16} />
              </Button>
            )}
            
            <div className="text-xs text-center text-sidebar-foreground/60 mt-1">
              v1.0
            </div>
          </div>
        </div>
      </SidebarFooter>
    </UISidebar>
  );
};

export default SidebarComponent;
