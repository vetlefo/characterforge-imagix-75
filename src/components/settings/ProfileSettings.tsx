
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="" />
          <AvatarFallback className="bg-[#333370] text-xl">JD</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" className="mb-2 border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
            Upload new image
          </Button>
          <p className="text-xs text-gray-400">
            Recommended: Square JPG, PNG, or GIF, at least 500x500 pixels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input 
            id="firstName" 
            placeholder="Jane" 
            className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input 
            id="lastName" 
            placeholder="Doe" 
            className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="jane.doe@example.com" 
          className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-white">Username</Label>
        <Input 
          id="username" 
          placeholder="janedoe" 
          className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white">Bio</Label>
        <Textarea 
          id="bio" 
          placeholder="Tell us about yourself..." 
          className="min-h-[100px] bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
        />
      </div>

      <Button className="bg-[#333370] hover:bg-[#4d4d91]">
        Save Changes
      </Button>
    </div>
  );
};

export default ProfileSettings;
