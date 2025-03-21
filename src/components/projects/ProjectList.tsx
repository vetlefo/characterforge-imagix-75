
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreateProjectModal from './CreateProjectModal';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  created_at: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prompt': return 'bg-blue-500/20 text-blue-400';
      case 'workflow': return 'bg-purple-500/20 text-purple-400';
      case 'template': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Projects</h2>
        <Button 
          size="sm" 
          className="bg-[#333370] hover:bg-[#4a4a8c]"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
          <CardContent className="pt-6 pb-4 text-center">
            <p className="text-gray-400 mb-4">You don't have any projects yet.</p>
            <Button 
              variant="outline" 
              className="border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-[#1a1a40] border-[#333370]/50 text-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <span className={`px-2 py-1 rounded text-xs ${getProjectTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  {project.description || 'No description provided'}
                </p>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Created {formatDistanceToNow(new Date(project.created_at))} ago</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-2 border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-2 border-red-800/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onProjectCreated={fetchProjects}
      />
    </div>
  );
};

export default ProjectList;
