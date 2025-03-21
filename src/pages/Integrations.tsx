
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Database, Cloud, Mail } from 'lucide-react';

const Integrations = () => {
  return (
    <Layout>
      <div className="p-8 bg-[#0F0F23] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Integrations</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Github className="h-6 w-6" />
                  <CardTitle>GitHub</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Connect your GitHub account to sync repositories and collaborate on code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Sync your creative projects with GitHub repositories and manage version control directly from the platform.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
                  Connect GitHub
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  <CardTitle>Supabase</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Connect to Supabase for database and authentication services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Store your creative assets, manage user data, and implement authentication through Supabase integration.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
                  Connect Supabase
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  <CardTitle>Google Drive</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Connect to Google Drive to store and access your files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Seamlessly save and import assets from your Google Drive, making collaboration and file management easier.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
                  Connect Google Drive
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cloud className="h-6 w-6" />
                  <CardTitle>Cloud Storage</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Connect to custom cloud storage solutions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Configure connections to various cloud storage providers to expand your asset management capabilities.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
                  Configure Storage
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Integrations;
