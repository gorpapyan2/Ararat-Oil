
import { useState, useEffect } from 'react';
import { Shift } from '@/types';
import { 
  startShift, 
  closeShift, 
  getActiveShift 
} from '@/services/shifts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for active shift on mount
  useEffect(() => {
    if (user) {
      checkActiveShift();
    }
  }, [user]);

  const checkActiveShift = async () => {
    if (!user) return;
    try {
      const shift = await getActiveShift(user.id);
      setActiveShift(shift);
    } catch (error) {
      console.error('Error checking active shift', error);
    }
  };

  const beginShift = async (openingCash: number) => {
    try {
      const newShift = await startShift(openingCash);
      setActiveShift(newShift);
      toast({
        title: 'Shift Started',
        description: 'Your shift has begun successfully.'
      });
      return newShift;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start shift',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const endShift = async (closingCash: number) => {
    if (!activeShift) {
      throw new Error('No active shift to close');
    }

    try {
      const closedShift = await closeShift(activeShift.id, closingCash);
      setActiveShift(null);
      toast({
        title: 'Shift Closed',
        description: 'Your shift has been closed successfully.'
      });
      return closedShift;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close shift',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    activeShift,
    beginShift,
    endShift,
    checkActiveShift
  };
}
