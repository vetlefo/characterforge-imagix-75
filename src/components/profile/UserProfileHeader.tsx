
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Mail, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfileHeader = () => {
  return (
    <div className="bg-[#1a1a40] border border-[#333370]/50 rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="" />
          <AvatarFallback className="bg-[#333370] text-2xl">JD</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">Jane Doe</h2>
          <p className="text-gray-400">@janedoe</p>
          
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-[#333370]/30 text-white px-2 py-1 rounded-full">Designer</span>
            <span className="text-xs bg-[#333370]/30 text-white px-2 py-1 rounded-full">Illustrator</span>
            <span className="text-xs bg-[#333370]/30 text-white px-2 py-1 rounded-full">Creative</span>
          </div>
          
          <p className="mt-3 text-white">
            Creative designer and digital artist focused on interactive experiences and innovative interfaces.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 self-start mt-2 md:mt-0">
          <Link to="/settings">
            <Button variant="outline" size="sm" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
          
          <Button variant="outline" size="sm" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
            <Mail className="mr-2 h-4 w-4" />
            Message
          </Button>
          
          <Button variant="outline" size="sm" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 border-t border-[#333370]/30 pt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-white">12</p>
          <p className="text-sm text-gray-400">Projects</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-white">48</p>
          <p className="text-sm text-gray-400">Assets</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-white">156</p>
          <p className="text-sm text-gray-400">Contributions</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-white">5</p>
          <p className="text-sm text-gray-400">Teams</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
