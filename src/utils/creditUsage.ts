
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Records usage of credits for an AI action
 * 
 * @param userId The user's ID
 * @param actionType The type of action (e.g., 'generate', 'edit', 'transform')
 * @param creditsUsed The number of credits used for this action
 * @param projectId Optional project ID if the action is associated with a project
 * @returns Promise with operation success status
 */
export const recordCreditUsage = async (
  userId: string,
  actionType: string,
  creditsUsed: number,
  projectId?: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, check if user has enough credits
    const { data: creditData, error: creditError } = await supabase
      .from('credits')
      .select('amount')
      .eq('user_id', userId)
      .single();
    
    if (creditError) {
      throw creditError;
    }
    
    if (!creditData || creditData.amount < creditsUsed) {
      toast.error('Not enough credits for this action');
      return { success: false, error: 'Insufficient credits' };
    }
    
    // Record the usage - the trigger will automatically update credits
    const { error } = await supabase
      .from('usage_history')
      .insert({
        user_id: userId,
        project_id: projectId || null,
        action_type: actionType,
        credits_used: creditsUsed
      });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error recording credit usage:', error);
    return { success: false, error };
  }
};

/**
 * Calculates credit cost based on action type and parameters
 * 
 * @param actionType The type of action
 * @param options Additional parameters that might affect cost
 * @returns The number of credits required
 */
export const calculateCreditCost = (
  actionType: string,
  options: { complexity?: 'low' | 'medium' | 'high', length?: number } = {}
): number => {
  const { complexity = 'medium', length = 1 } = options;
  
  // Base costs for different action types
  const baseCosts: Record<string, number> = {
    'generate': 5,
    'edit': 3,
    'transform': 8,
    'analyze': 4
  };
  
  // Multipliers for complexity
  const complexityMultipliers: Record<string, number> = {
    'low': 0.7,
    'medium': 1.0,
    'high': 1.5
  };
  
  // Get base cost or default to 5 if action type not found
  const baseCost = baseCosts[actionType.toLowerCase()] || 5;
  
  // Calculate final cost with complexity and length
  const finalCost = Math.ceil(
    baseCost * 
    complexityMultipliers[complexity] * 
    Math.max(1, Math.log2(length))
  );
  
  return finalCost;
};
