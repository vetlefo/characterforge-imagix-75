
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  open, 
  onOpenChange,
  onProjectCreated 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('prompt');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a project');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          type,
          status: 'active'
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Project created successfully');
      onProjectCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('prompt');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a40] text-white border-[#333370]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new AI project to start generating content
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="bg-[#0f0f23] border-[#333370]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-[#0f0f23] border-[#333370]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a40] border-[#333370]">
                  <SelectItem value="prompt">Prompt Template</SelectItem>
                  <SelectItem value="workflow">AI Workflow</SelectItem>
                  <SelectItem value="template">Project Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                className="bg-[#0f0f23] border-[#333370]"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#333370] bg-transparent text-white hover:bg-[#333370]/30"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !title.trim()}
              className="bg-[#333370] hover:bg-[#4a4a8c]"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
