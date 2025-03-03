
// Update the export to include a default export
import {
  LayoutDashboard,
  Settings,
  ImageIcon,
  Brush,
  Code,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

// Create a simple useSidebar hook to replace the missing one
const useSidebar = () => {
  const [openSections, setOpenSections] = useState<string[]>(["creative"]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return { openSections, toggleSection };
};

export function Sidebar() {
  const { openSections, toggleSection } = useSidebar();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-secondary hover:text-accent-foreground data-[active]:bg-secondary data-[active]:text-accent-foreground",
      isActive ? "bg-secondary text-accent-foreground" : ""
    );

  return (
    <nav className="grid items-start px-2 text-sm">
      <NavLink to="/" className={navLinkClasses}>
        Home
      </NavLink>
      
      <Collapsible open={openSections.includes("creative")} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between w-full font-normal"
            onClick={() => toggleSection("creative")}
          >
            Creative Tools
            <ChevronRight
              className={cn("h-4 w-4", {
                "transform rotate-90": openSections.includes("creative"),
              })}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
          
          <NavLink to="/intent-translator-demo" className={navLinkClasses}>
            Intent Translator
          </NavLink>
          
        </CollapsibleContent>
      </Collapsible>
      
    </nav>
  );
}

// Add a default export to satisfy imports in Layout.tsx
export default Sidebar;
