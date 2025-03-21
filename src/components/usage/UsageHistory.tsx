
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UsageRecord {
  id: string;
  action_type: string;
  credits_used: number;
  created_at: string;
  projects: {
    title: string;
  } | null;
}

const UsageHistory = () => {
  const [history, setHistory] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsageHistory();
    }
  }, [user]);

  const fetchUsageHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usage_history')
        .select(`
          id,
          action_type,
          credits_used,
          created_at,
          projects:project_id (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'generate': return 'bg-green-500/20 text-green-400';
      case 'edit': return 'bg-blue-500/20 text-blue-400';
      case 'transform': return 'bg-purple-500/20 text-purple-400';
      case 'analyze': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
      <CardHeader>
        <CardTitle className="text-xl">Recent Usage</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center text-gray-400">Loading usage history...</div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-10 w-10 text-blue-400 mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-medium text-gray-200 mb-1">No Usage Yet</h3>
            <p className="text-gray-400 text-sm">
              Start using the platform's AI features to see your usage history here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="flex items-start space-x-3 p-3 hover:bg-[#333370]/10 rounded-md transition-colors"
              >
                <div className={`p-2 rounded-full flex-shrink-0 ${getActionColor(item.action_type)}`}>
                  <Zap className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">
                        {item.action_type.charAt(0).toUpperCase() + item.action_type.slice(1)}
                      </p>
                      {item.projects && (
                        <p className="text-sm text-gray-400">
                          Project: {item.projects.title}
                        </p>
                      )}
                    </div>
                    <span className="text-yellow-400 font-medium">
                      -{item.credits_used} credits
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(item.created_at))} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageHistory;
