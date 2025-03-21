
import React from 'react';
import Layout from '../components/Layout';
import CreditsSummary from '@/components/dashboard/CreditsSummary';
import ProjectList from '@/components/projects/ProjectList';
import UsageHistory from '@/components/usage/UsageHistory';

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
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
