
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, CreditCard, LogOut, Zap, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, TooltipContent, 
  TooltipProvider, TooltipTrigger 
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import RefillCreditsModal from '@/components/credits/RefillCreditsModal';

const UserNavigation: React.FC = () => {
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, credits, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-4 text-white text-xs bg-[#333370]/20 hover:bg-[#333370]/40"
        onClick={() => navigate('/auth')}
      >
        Sign In
      </Button>
    );
  }
  
  return (
    <>
      {/* User credits info */}
      <div className="flex items-center mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#333370]/20">
                <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${profile?.tier === 'premium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                  {profile?.tier === 'premium' ? 'PREMIUM' : 'FREE'}
                </Badge>
                <div className="flex items-center gap-1 text-white text-xs">
                  <Zap size={14} className="text-blue-400" />
                  <span>{credits?.amount || 0}/{credits?.max_amount || 0}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Available credits: {credits?.amount || 0} of {credits?.max_amount || 0}</p>
              <p className="text-xs mt-1">Click to refill</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 mr-2 px-2 text-white text-xs bg-[#333370]/20 hover:bg-[#333370]/40"
        onClick={() => setRefillModalOpen(true)}
      >
        <CreditCard size={14} className="mr-1" />
        Refill
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 mr-2 px-2 text-white text-xs bg-[#333370]/20 hover:bg-[#333370]/40"
        onClick={() => navigate('/dashboard')}
      >
        <LayoutDashboard size={14} className="mr-1" />
        Dashboard
      </Button>
      
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
            <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
          </DropdownMenuItem>
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
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <RefillCreditsModal 
        open={refillModalOpen} 
        onOpenChange={setRefillModalOpen} 
      />
    </>
  );
};

export default UserNavigation;
