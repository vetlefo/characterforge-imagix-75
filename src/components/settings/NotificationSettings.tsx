
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="email-updates" className="text-white">Project Updates</Label>
            <p className="text-sm text-gray-400">Receive emails about updates to your projects</p>
          </div>
          <Switch id="email-updates" />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="email-comments" className="text-white">Comments</Label>
            <p className="text-sm text-gray-400">Receive emails when someone comments on your projects</p>
          </div>
          <Switch id="email-comments" />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="email-mentions" className="text-white">Mentions</Label>
            <p className="text-sm text-gray-400">Receive emails when you are mentioned</p>
          </div>
          <Switch id="email-mentions" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Platform Notifications</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="platform-updates" className="text-white">Platform Updates</Label>
            <p className="text-sm text-gray-400">Receive notifications about new features and updates</p>
          </div>
          <Switch id="platform-updates" />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="platform-tips" className="text-white">Tips and Tricks</Label>
            <p className="text-sm text-gray-400">Receive helpful tips to improve your creative process</p>
          </div>
          <Switch id="platform-tips" />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-[#333370]/20">
          <div>
            <Label htmlFor="platform-collaborative" className="text-white">Collaborative Invites</Label>
            <p className="text-sm text-gray-400">Receive notifications when invited to collaborate</p>
          </div>
          <Switch id="platform-collaborative" defaultChecked />
        </div>
      </div>
      
      <Button className="bg-[#333370] hover:bg-[#4d4d91]">
        Save Preferences
      </Button>
    </div>
  );
};

export default NotificationSettings;
