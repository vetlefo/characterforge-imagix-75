
import React from 'react';
import { 
  SidebarProvider, 
  Sidebar as UISidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup
} from '@/components/ui/sidebar';
import { Home, PenLine, Layers, Play, LightbulbIcon, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  return (
    <UISidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <strong className="text-lg font-semibold">Lovable Creative</strong>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
    </UISidebar>
  );
};
