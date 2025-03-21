
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '../components/Layout';
import { User, Bell, Globe, Lock, Plug, CreditCard } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import IntegrationSettings from '../components/settings/IntegrationSettings';
import CreditSettings from '../components/settings/CreditSettings';

const Settings = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8 bg-[#1a1a40] border border-[#333370]/50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-[#333370]">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#333370]">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-[#333370]">
                <Globe className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#333370]">
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-[#333370]">
                <Plug className="mr-2 h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="credits" className="data-[state=active]:bg-[#333370]">
                <CreditCard className="mr-2 h-4 w-4" />
                Credits
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your personal information and profile settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Control how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize the look and feel of your interface.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AppearanceSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your password and account security options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect with third-party services and platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IntegrationSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="credits">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Credit Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your credits for AI-powered features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreditSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
