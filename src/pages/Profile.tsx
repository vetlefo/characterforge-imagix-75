
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileIcon, ImageIcon, HistoryIcon } from 'lucide-react';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import UserProjects from '../components/profile/UserProjects';
import UserAssets from '../components/profile/UserAssets';
import UserActivity from '../components/profile/UserActivity';

const Profile = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <UserProfileHeader />
          
          <Tabs defaultValue="projects" className="w-full mt-8">
            <TabsList className="mb-8 bg-[#1a1a40] border border-[#333370]/50">
              <TabsTrigger value="projects" className="data-[state=active]:bg-[#333370]">
                <FileIcon className="mr-2 h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-[#333370]">
                <ImageIcon className="mr-2 h-4 w-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#333370]">
                <HistoryIcon className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserProjects />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assets">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Your Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserAssets />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserActivity />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
