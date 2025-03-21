
import React from 'react';
import Layout from '../components/Layout';
import CreditsSummary from '@/components/dashboard/CreditsSummary';
import ProjectList from '@/components/projects/ProjectList';
import UsageHistory from '@/components/usage/UsageHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, User, Bell, Globe, Lock, Plug, CreditCard } from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1">
              <CreditsSummary />
            </div>
            <div className="col-span-1 md:col-span-2">
              <UsageHistory />
            </div>
          </div>
          
          <div className="mb-8">
            <ProjectList />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">Quick Settings</h2>
            <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  <Link to="/settings?tab=profile" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <User className="h-8 w-8 mb-2" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link to="/settings?tab=notifications" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <Bell className="h-8 w-8 mb-2" />
                    <span className="text-sm">Notifications</span>
                  </Link>
                  <Link to="/settings?tab=appearance" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <Globe className="h-8 w-8 mb-2" />
                    <span className="text-sm">Appearance</span>
                  </Link>
                  <Link to="/settings?tab=security" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <Lock className="h-8 w-8 mb-2" />
                    <span className="text-sm">Security</span>
                  </Link>
                  <Link to="/settings?tab=integrations" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <Plug className="h-8 w-8 mb-2" />
                    <span className="text-sm">Integrations</span>
                  </Link>
                  <Link to="/settings?tab=credits" className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-[#333370]/50 transition-colors">
                    <CreditCard className="h-8 w-8 mb-2" />
                    <span className="text-sm">Credits</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
