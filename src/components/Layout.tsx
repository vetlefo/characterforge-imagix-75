
import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup } from '@/components/ui/sidebar';
import { Home, PenLine, Layers, Play, Orbit, PanelLeft, PanelRight, BookImage, Palette, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <SidebarProvider defaultOpen={isExpanded}>
      <div className="flex h-screen w-full bg-background">
        <Sidebar variant="sidebar" collapsible={isExpanded ? "none" : "icon"} className="bg-[#333370] z-50 border-none" style={{
        "--sidebar-width": "200px",
        "--sidebar-width-icon": "50px"
      } as React.CSSProperties}>
          <SidebarHeader className="bg-[#0f0f23]">
            <div className="flex h-14 items-center justify-center px-4 bg-[#0f0f23]">
              <strong className="text-lg font-semibold text-center">OI</strong>
              
              {/* Toggle button that appears only when sidebar is expanded */}
              {isExpanded && <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto text-white hover:bg-[#1a1a40]">
                  <PanelLeft size={18} />
                </Button>}
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
        </Sidebar>
        
        <div className="flex flex-col flex-1 overflow-hidden bg-[#0F0F23]">
          {/* Top navigation bar for user and settings */}
          <header className="h-12 bg-[#0f0f23] border-b border-[#333370]/30 px-4 flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-[#333370]/20 text-white hover:bg-[#333370]/40">
                  <User size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1a1a40] border-[#333370] text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/integrations" className="cursor-pointer">Integrations</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
