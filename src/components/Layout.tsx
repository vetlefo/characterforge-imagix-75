import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup } from '@/components/ui/sidebar';
import { Home, PenLine, Layers, Play, LightbulbIcon, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar variant="sidebar" collapsible="icon" className="bg-yellow-500">
          <SidebarHeader>
            <div className="flex h-14 items-center px-4 bg-[#0f0f23]">
              <strong className="text-lg font-semibold">Lovable Creative</strong>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="#0F0F23 bg-[#0f0f23]">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
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
          
          <SidebarFooter>
            <div className="p-4">
              <div className="text-xs text-sidebar-foreground/60">
                Lovable Creative v1.0
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>;
};
export default Layout;