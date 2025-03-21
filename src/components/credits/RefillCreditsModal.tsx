
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RefillCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RefillCreditsModal = ({ open, onOpenChange }: RefillCreditsModalProps) => {
  const [amount, setAmount] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const { user, credits, refreshUserData } = useAuth();

  const handleRefill = async () => {
    if (!user || !credits) return;
    
    setLoading(true);
    
    try {
      // In a real app, you would integrate with a payment processor here
      // For now, we'll just update the credits directly
      
      const newAmount = Math.min(credits.amount + amount, credits.max_amount);
      
      const { error } = await supabase
        .from('credits')
        .update({ amount: newAmount, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      await refreshUserData();
      toast.success(`Successfully added ${amount} credits!`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error refilling credits:', error);
      toast.error('Failed to refill credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a40] text-white border-[#333370]">
        <DialogHeader>
          <DialogTitle>Refill Credits</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add more credits to your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">Amount to add</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min={10}
              max={1000}
              className="bg-[#0f0f23] border-[#333370]"
            />
          </div>
          
          <div className="text-sm text-gray-400">
            Current credits: {credits?.amount || 0}/{credits?.max_amount || 0}
          </div>
          
          {credits && (amount + credits.amount > credits.max_amount) && (
            <div className="text-amber-400 text-sm">
              Note: You can't exceed your maximum credit limit ({credits.max_amount}). 
              Only {credits.max_amount - credits.amount} credits will be added.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#333370] bg-transparent text-white hover:bg-[#333370]/30"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRefill} 
            disabled={loading || amount <= 0}
            className="bg-[#333370] hover:bg-[#4a4a8c]"
          >
            {loading ? "Processing..." : "Refill Credits"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefillCreditsModal;
