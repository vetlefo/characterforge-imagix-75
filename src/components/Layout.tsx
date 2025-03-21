
import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup } from '@/components/ui/sidebar';
import { Home, PenLine, Layers, Play, LightbulbIcon, Orbit, PanelLeft, PanelRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import CollaborationVisualizer from './creative/CollaborationVisualizer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };
  
  return <SidebarProvider defaultOpen={isExpanded}>
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
                  <SidebarMenuButton asChild tooltip="Home" isActive={window.location.pathname === '/'}>
                    <Link to="/">
                      <Home size={20} />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Create" isActive={window.location.pathname === '/drawing'}>
                    <Link to="/drawing">
                      <PenLine size={20} />
                      <span>Create</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Style" isActive={window.location.pathname === '/styling'}>
                    <Link to="/styling">
                      <Layers size={20} />
                      <span>Style</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Insights" isActive={false}>
                    <Link to="#">
                      <LightbulbIcon size={20} />
                      <span>Insights</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Animation" isActive={window.location.pathname === '/animation'}>
                    <Link to="/animation">
                      <Play size={20} />
                      <span>Animation</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Media" isActive={window.location.pathname === '/media'}>
                    <Link to="/media">
                      <Orbit size={20} />
                      <span>Media</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="bg-[#0f0f23]">
            <div className="p-4">
              {/* Toggle button in footer when collapsed */}
              {!isExpanded && <Button variant="ghost" size="icon" onClick={toggleSidebar} className="w-full flex justify-center text-white hover:bg-[#1a1a40]">
                  <PanelRight size={18} />
                </Button>}
              <div className="text-xs text-center text-sidebar-foreground/60">
                v1.0
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
        
        {/* Add the Collaboration Visualizer */}
        <CollaborationVisualizer />
      </div>
    </SidebarProvider>;
};

export default Layout;
