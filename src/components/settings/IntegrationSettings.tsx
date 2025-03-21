
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <p className="text-gray-400">
        Connect your account to these services to enhance your creative workflow.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#0f0f23] rounded-md border border-[#333370]/30">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" />
              <AvatarFallback>GH</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-gray-400">Connect your GitHub repositories</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-[#333370]/20 text-white border-[#333370]">
              Not Connected
            </Badge>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-[#0f0f23] rounded-md border border-[#333370]/30">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Supabase</p>
              <p className="text-sm text-gray-400">Connect to Supabase for data storage</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-[#333370]/20 text-white border-[#333370]">
              Not Connected
            </Badge>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-[#0f0f23] rounded-md border border-[#333370]/30">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/1024px-Google_Drive_logo.png" />
              <AvatarFallback>GD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Google Drive</p>
              <p className="text-sm text-gray-400">Connect to Google Drive for file storage</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-[#333370]/20 text-white border-[#333370]">
              Not Connected
            </Badge>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Link to="/integrations">
          <Button className="w-full bg-[#333370] hover:bg-[#4d4d91]">
            Manage All Integrations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IntegrationSettings;
