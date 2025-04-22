
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShift } from '@/hooks/useShift';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, AlertCircle } from 'lucide-react';

export function CashRegisterPanel() {
  const [openingCash, setOpeningCash] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeShift, beginShift, endShift } = useShift();
  const { toast } = useToast();
  const [error, setError] = useState('');

  // Calculate shift duration if active
  const [duration, setDuration] = useState('');
  
  useEffect(() => {
    if (!activeShift) return;
    
    const updateDuration = () => {
      const start = new Date(activeShift.start_time);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setDuration(`${hours}h ${minutes}m`);
    };
    
    // Update immediately
    updateDuration();
    
    // Then update every minute
    const intervalId = setInterval(updateDuration, 60000);
    
    return () => clearInterval(intervalId);
  }, [activeShift]);

  const validateAmount = (amount: string): boolean => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid cash amount (must be a positive number)');
      return false;
    }
    setError('');
    return true;
  };

  const handleStartShift = async () => {
    if (!validateAmount(openingCash)) return;
    
    try {
      setIsSubmitting(true);
      const amount = parseFloat(openingCash);
      await beginShift(amount);
      setOpeningCash('');
    } catch (error) {
      console.error('Error starting shift:', error);
      toast({
        title: 'Error',
        description: 'Failed to start shift. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShift = async () => {
    if (!validateAmount(closingCash)) return;
    
    try {
      setIsSubmitting(true);
      const amount = parseFloat(closingCash);
      await endShift(amount);
      setClosingCash('');
    } catch (error) {
      console.error('Error closing shift:', error);
      toast({
        title: 'Error',
        description: 'Failed to close shift. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeShift) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <Clock size={16} />
          <span>Shift started {new Date(activeShift.start_time).toLocaleString()}</span>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm font-medium">Opening Cash</div>
          <div className="text-xl font-bold">{activeShift.opening_cash.toLocaleString()} ֏</div>
        </div>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="text-sm font-medium">Duration</div>
          <div className="text-xl font-bold">{duration}</div>
        </div>

        <div className="space-y-2">
          <label htmlFor="closingCash" className="text-sm font-medium">
            Closing Cash Amount
          </label>
          <Input 
            id="closingCash"
            type="number" 
            placeholder="Enter closing cash amount"
            value={closingCash}
            onChange={(e) => setClosingCash(e.target.value)}
            className="mb-1"
          />
          
          {error && (
            <div className="flex items-center text-destructive text-sm mt-1 mb-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleCloseShift} 
            className="w-full" 
            disabled={isSubmitting}
            variant="default"
          >
            <DollarSign className="mr-1 h-4 w-4" />
            {isSubmitting ? "Processing..." : "Close Shift"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-4 rounded-lg">
        <div className="text-sm font-medium">Status</div>
        <div className="text-xl font-bold">No Active Shift</div>
        <div className="text-sm text-muted-foreground mt-1">Start a shift to begin processing sales</div>
      </div>

      <div className="space-y-2">
        <label htmlFor="openingCash" className="text-sm font-medium">
          Opening Cash Amount
        </label>
        <Input 
          id="openingCash"
          type="number" 
          placeholder="Enter opening cash amount"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          className="mb-1"
        />
        
        {error && (
          <div className="flex items-center text-destructive text-sm mt-1 mb-2">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        
        <Button 
          onClick={handleStartShift} 
          className="w-full" 
          disabled={isSubmitting}
          variant="default"
        >
          <DollarSign className="mr-1 h-4 w-4" />
          {isSubmitting ? "Processing..." : "Start Shift"}
        </Button>
      </div>
    </div>
  );
}
