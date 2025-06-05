import { useState } from "react";
import { Tank } from "@/core/api/types";
import { useTankMutations } from "../hooks/useTanks";
import { useTranslation } from "react-i18next";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from "@/core/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/core/components/ui/primitives/radio-group";
import { useToast } from "@/hooks";

interface TankLevelEditorProps {
  tank: Tank;
  onComplete: () => void;
}

export function TankLevelEditor({ tank, onComplete }: TankLevelEditorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { adjustTankLevel } = useTankMutations();
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"add" | "subtract">("add");

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

    try {
      await adjustTankLevel.mutateAsync({
        tankId: tank.id,
        changeAmount: Number(amount),
        changeType: type,
        reason: "Tank level editor",
      });

      onComplete();
    } catch (error) {
      // Error handling is already done in the mutation
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
          disabled={adjustTankLevel.isPending}
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
        <Button type="submit" disabled={adjustTankLevel.isPending} className="flex-1">
          {adjustTankLevel.isPending ? t("common.saving") : t("common.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          disabled={adjustTankLevel.isPending}
          className="flex-1"
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
