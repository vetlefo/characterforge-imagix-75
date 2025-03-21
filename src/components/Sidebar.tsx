
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/hooks/use-sidebar';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, children }) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className={cn("relative", className)}>
      {/* Hamburger menu toggle button for mobile */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggle}
      >
        <span className="sr-only">Toggle sidebar</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </Button>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}
      
      {/* Sidebar panel */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-background z-50 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:z-10", // Always visible on desktop with lower z-index
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <strong className="text-lg font-semibold">Lovable Creative</strong>
          </div>
          
          <ScrollArea className="flex-1">
            <nav className="grid items-start px-2 text-sm">
              {children}
            </nav>
          </ScrollArea>
          
          <Separator />
          
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={toggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Toggle Sidebar
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
