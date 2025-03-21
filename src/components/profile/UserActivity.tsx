
import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Image, FilePlus, MessageSquare, Heart, Share2, Users } from 'lucide-react';

const UserActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'creation',
      icon: <FilePlus className="h-4 w-4" />,
      content: 'Created a new project "Cosmic Interface Design"',
      date: '2 days ago'
    },
    {
      id: 2,
      type: 'upload',
      icon: <Image className="h-4 w-4" />,
      content: 'Uploaded 5 new assets to "UI Kit - Cosmic"',
      date: '3 days ago'
    },
    {
      id: 3,
      type: 'edit',
      icon: <PenLine className="h-4 w-4" />,
      content: 'Updated project "Minimalist Logo Collection"',
      date: '1 week ago'
    },
    {
      id: 4,
      type: 'comment',
      icon: <MessageSquare className="h-4 w-4" />,
      content: 'Commented on Alex\'s project "Digital Typography"',
      date: '1 week ago'
    },
    {
      id: 5,
      type: 'like',
      icon: <Heart className="h-4 w-4" />,
      content: 'Liked 3 projects from "Modern UI Trends" collection',
      date: '2 weeks ago'
    },
    {
      id: 6,
      type: 'share',
      icon: <Share2 className="h-4 w-4" />,
      content: 'Shared "Animation Pack" with the design team',
      date: '2 weeks ago'
    },
    {
      id: 7,
      type: 'collaboration',
      icon: <Users className="h-4 w-4" />,
      content: 'Joined collaboration on "Website Redesign Project"',
      date: '3 weeks ago'
    }
  ];

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'creation': return 'bg-green-500/20 text-green-400';
      case 'upload': return 'bg-blue-500/20 text-blue-400';
      case 'edit': return 'bg-yellow-500/20 text-yellow-400';
      case 'comment': return 'bg-purple-500/20 text-purple-400';
      case 'like': return 'bg-red-500/20 text-red-400';
      case 'share': return 'bg-indigo-500/20 text-indigo-400';
      case 'collaboration': return 'bg-teal-500/20 text-teal-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-[#333370]/10 rounded-md transition-colors">
          <div className={`p-2 rounded-full flex-shrink-0 ${getActivityColor(activity.type)}`}>
            {activity.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white">{activity.content}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30">
          View Full Activity Log
        </Button>
      </div>
    </div>
  );
};

export default UserActivity;
