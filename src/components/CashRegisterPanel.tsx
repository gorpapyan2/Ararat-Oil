
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShift } from '@/hooks/useShift';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CashRegisterPanel() {
  const [openingCash, setOpeningCash] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const { activeShift, beginShift, endShift } = useShift();

  const handleStartShift = async () => {
    const amount = parseFloat(openingCash);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid opening cash amount');
      return;
    }
    await beginShift(amount);
  };

  const handleCloseShift = async () => {
    const amount = parseFloat(closingCash);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid closing cash amount');
      return;
    }
    await endShift(amount);
  };

  if (activeShift) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Shift started at: {new Date(activeShift.start_time).toLocaleString()}</p>
          <p>Opening Cash: {activeShift.opening_cash} ֏</p>
          <div className="mt-4">
            <Input 
              type="number" 
              placeholder="Closing Cash Amount"
              value={closingCash}
              onChange={(e) => setClosingCash(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleCloseShift} className="w-full">
              Close Shift
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          type="number" 
          placeholder="Opening Cash Amount"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleStartShift} className="w-full">
          Start Shift
        </Button>
      </CardContent>
    </Card>
  );
}
