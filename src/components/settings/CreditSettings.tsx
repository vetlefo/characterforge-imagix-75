
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CreditsSummary from '@/components/dashboard/CreditsSummary';
import RefillCreditsModal from '@/components/credits/RefillCreditsModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CreditSettings = () => {
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const { credits, profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Credit Management</h3>
            <p className="text-gray-400">
              Our AI credit system powers all intelligent features across the platform, 
              including content generation, analysis, and automation.
            </p>
            
            <h4 className="font-medium text-md">Credits for Development</h4>
            <p className="text-gray-400">
              As a non-profit initiative aimed at bringing AI capabilities to underdeveloped countries, 
              we rely on donations and sponsorships to provide service credits to those who need them most.
            </p>
            
            <div className="flex flex-col space-y-3 pt-2">
              <Button 
                variant="outline"
                onClick={() => setRefillModalOpen(true)}
                className="w-full md:w-auto"
              >
                Refill Credits
              </Button>
              
              {profile?.tier === 'free' && (
                <Button 
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => toast.info('Donation program coming soon!')}
                >
                  Apply for Credit Donation Program
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <CreditsSummary />
        </div>
      </div>
      
      <Separator className="bg-[#333370]/50" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Usage Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-[#333370]/50 rounded-md">
            <h4 className="font-medium mb-2">Fair Usage Policy</h4>
            <p className="text-gray-400 text-sm">
              To ensure equitable access, we monitor utilization patterns and may
              adjust credit consumption rates for intensive operations.
            </p>
          </div>
          
          <div className="p-4 border border-[#333370]/50 rounded-md">
            <h4 className="font-medium mb-2">Credit Allocations</h4>
            <p className="text-gray-400 text-sm">
              For donated credits, priority is given to educational institutions,
              non-profits, and developers in eligible countries.
            </p>
          </div>
        </div>
      </div>
      
      <RefillCreditsModal 
        open={refillModalOpen} 
        onOpenChange={setRefillModalOpen} 
      />
    </div>
  );
};

export default CreditSettings;
