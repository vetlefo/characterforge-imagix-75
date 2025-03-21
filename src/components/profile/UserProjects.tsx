
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, Heart } from 'lucide-react';

const UserProjects = () => {
  const projects = [
    {
      id: 1,
      title: 'Cosmic Interface Design',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
      type: 'UI Design',
      views: 346,
      likes: 42,
      comments: 13,
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Minimalist Logo Collection',
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
      type: 'Branding',
      views: 213,
      likes: 29,
      comments: 7,
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Animated Background Patterns',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      type: 'Animation',
      views: 189,
      likes: 34,
      comments: 5,
      date: '2 weeks ago'
    },
    {
      id: 4,
      title: 'Responsive Website Prototype',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      type: 'Web Design',
      views: 278,
      likes: 31,
      comments: 9,
      date: '3 weeks ago'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <Card key={project.id} className="bg-[#0f0f23] border-[#333370]/30 overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-[#0f0f23]">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-[#0f0f23] text-xs px-2 py-1 rounded-full opacity-80">
                {project.type}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-white mb-1">{project.title}</h3>
              <p className="text-xs text-gray-400">{project.date}</p>
            </CardContent>
            
            <CardFooter className="px-4 py-3 border-t border-[#333370]/30 flex justify-between">
              <div className="flex space-x-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  {project.views}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Heart className="h-4 w-4 mr-1" />
                  {project.likes}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {project.comments}
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#333370]/30">
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
          Load More Projects
        </Button>
      </div>
    </div>
  );
};

export default UserProjects;
