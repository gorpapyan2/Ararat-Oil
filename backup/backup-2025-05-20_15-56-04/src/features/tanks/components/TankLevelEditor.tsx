import { useState } from "react";
import { FuelTank, TankLevelAdjustment } from "../types/tanks.types";
import { adjustTankLevel } from "../services";
import { useTranslation } from "react-i18next";
import { Button } from "@/core/components/ui/primitives/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from '@/core/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/primitives/radio-group";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface TankLevelEditorProps {
  tank: FuelTank;
  onComplete: () => void;
}

export function TankLevelEditor({ tank, onComplete }: TankLevelEditorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"add" | "subtract">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: t("common.error"),
        description: t("tanks.invalidAmount"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const adjustment: TankLevelAdjustment = {
        change_amount: Number(amount),
        change_type: type,
        reason: "Tank level editor",
      };

      await adjustTankLevel(tank.id, adjustment);
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      
      toast({
        title: t("common.success"),
        description: t("tanks.levelUpdated"),
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("tanks.levelUpdateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">{t("tanks.amount")}</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t("tanks.enterAmount")}
          disabled={isSubmitting}
        />
      </div>

      <RadioGroup
        value={type}
        onValueChange={(value) => setType(value as "add" | "subtract")}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="add" id="add" />
          <Label htmlFor="add">{t("tanks.add")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="subtract" id="subtract" />
          <Label htmlFor="subtract">{t("tanks.subtract")}</Label>
        </div>
      </RadioGroup>

      <div className="flex space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? t("common.saving") : t("common.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          disabled={isSubmitting}
          className="flex-1"
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
} 