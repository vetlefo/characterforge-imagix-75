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
import { useSidebar } from "@/hooks/use-sidebar";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

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
            <ChevronRightIcon
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
