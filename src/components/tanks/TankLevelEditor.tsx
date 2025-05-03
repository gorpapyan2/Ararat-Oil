import { useState } from "react";
import { FuelTank } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { updateTankLevel } from "@/services/supabase";
import { useToast } from "@/hooks";

interface TankLevelEditorProps {
  tank: FuelTank;
  onComplete: () => void;
}

export function TankLevelEditor({ tank, onComplete }: TankLevelEditorProps) {
  const [amount, setAmount] = useState<number>(0);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateTankLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({
        queryKey: ["tank-level-changes", tank.id],
      });
      toast({
        title: "Tank level updated",
        description: `Successfully ${operation === "add" ? "added" : "subtracted"} ${amount} liters.`,
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Error updating tank level",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number.",
        variant: "destructive",
      });
      return;
    }

    const finalAmount = operation === "add" ? amount : -amount;
    const newLevel = tank.current_level + finalAmount;

    // Validate new level doesn't exceed capacity or go below 0
    if (newLevel > tank.capacity) {
      toast({
        title: "Exceeds capacity",
        description: `This would exceed the tank capacity of ${tank.capacity} liters.`,
        variant: "destructive",
      });
      return;
    }

    if (newLevel < 0) {
      toast({
        title: "Invalid operation",
        description: `Cannot subtract more than the current level (${tank.current_level} liters).`,
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      tankId: tank.id,
      changeAmount: finalAmount,
      previousLevel: tank.current_level,
      newLevel: newLevel,
      changeType: operation,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={operation === "add" ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => setOperation("add")}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
        <Button
          type="button"
          variant={operation === "subtract" ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => setOperation("subtract")}
        >
          <Minus className="h-4 w-4 mr-1" /> Subtract
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount in liters"
          className="h-9"
          min="0"
          step="0.01"
        />
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || amount <= 0}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
