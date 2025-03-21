
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Password</h3>
        
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-white">Current Password</Label>
          <Input 
            id="current-password" 
            type="password" 
            placeholder="••••••••" 
            className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white">New Password</Label>
          <Input 
            id="new-password" 
            type="password" 
            placeholder="••••••••" 
            className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            placeholder="••••••••" 
            className="bg-[#0f0f23] border-[#333370] focus:border-indigo-500"
          />
        </div>
        
        <Button variant="outline" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
          Change Password
        </Button>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-[#333370]/20">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable-2fa" className="text-white">Enable Two-Factor Authentication</Label>
            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <Switch id="enable-2fa" />
        </div>
        
        <Button variant="outline" className="mt-2 border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30" disabled>
          Set Up Two-Factor Authentication
        </Button>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-[#333370]/20">
        <h3 className="text-lg font-medium">Session Management</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-md border border-[#333370]/30">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-gray-400">Chrome on Windows • IP: 192.168.1.1</p>
            </div>
            <div className="text-xs text-gray-400">Active now</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-md border border-[#333370]/30">
            <div>
              <p className="font-medium">Firefox on MacOS</p>
              <p className="text-sm text-gray-400">IP: 192.168.1.2</p>
            </div>
            <div className="text-xs text-gray-400">3 days ago</div>
          </div>
        </div>
        
        <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400">
          Log Out Of All Sessions
        </Button>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-[#333370]/20">
        <h3 className="text-lg font-medium">Account Deletion</h3>
        
        <p className="text-sm text-gray-400">
          Permanently delete your account and all of your content. This action cannot be undone.
        </p>
        
        <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
