
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RefillCreditsModal from '@/components/credits/RefillCreditsModal';

const CreditsSummary = () => {
  const { credits, refreshUserData } = useAuth();
  const [refillModalOpen, setRefillModalOpen] = React.useState(false);
  
  const percentage = credits ? Math.round((credits.amount / credits.max_amount) * 100) : 0;
  
  return (
    <Card className="bg-[#1a1a40] border-[#333370]/50 text-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Your Credits</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refreshUserData()} 
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#333370]/30"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-3xl font-bold text-white">
              {credits?.amount || 0}
            </span>
            <span className="text-sm text-gray-400">
              of {credits?.max_amount || 0} total
            </span>
          </div>
          
          <Progress value={percentage} className="h-2 bg-[#0f0f23]" />
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full border-[#333370] bg-[#0f0f23] hover:bg-[#333370]/30"
              onClick={() => setRefillModalOpen(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Refill Credits
            </Button>
          </div>
          
          <p className="text-xs text-gray-400">
            Credits are used when you use AI-powered features like generating content,
            creating workflows, or analyzing data.
          </p>
        </div>
      </CardContent>
      
      <RefillCreditsModal 
        open={refillModalOpen} 
        onOpenChange={setRefillModalOpen} 
      />
    </Card>
  );
};

export default CreditsSummary;
