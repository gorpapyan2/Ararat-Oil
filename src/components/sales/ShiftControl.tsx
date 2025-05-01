import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShift } from "@/hooks/useShift";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/currency-input";

export function ShiftControl() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeShift, beginShift, isLoading } = useShift();
  const [isStartShiftOpen, setIsStartShiftOpen] = useState(false);
  const [openingCash, setOpeningCash] = useState(100000);

  const handleStartShift = async () => {
    try {
      await beginShift(openingCash);
      setIsStartShiftOpen(false);
    } catch (error) {
      console.error("Error starting shift:", error);
    }
  };

  const handleGoToCloseShift = () => {
    // Use query parameter approach instead of a separate route
    window.location.href = `${window.location.origin}/shifts?tab=close`;
  };

  return (
    <div className="flex items-center gap-2">
      {activeShift ? (
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium text-green-500">● </span>
            <span>{t("shifts.activeShift")}</span>
            <span className="ml-2 text-muted-foreground">
              ({formatCurrency(activeShift.sales_total || 0)})
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToCloseShift}
          >
            {t("shifts.endShift")}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsStartShiftOpen(true)}
          disabled={isLoading}
        >
          {t("shifts.startShift")}
        </Button>
      )}

      {/* Start Shift Dialog */}
      <Dialog open={isStartShiftOpen} onOpenChange={setIsStartShiftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shifts.startShift")}</DialogTitle>
            <DialogDescription>
              {t("shifts.startShiftDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="openingCash">{t("shifts.openingCash")}</Label>
              <CurrencyInput
                id="openingCash"
                value={openingCash}
                onChange={setOpeningCash}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStartShiftOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleStartShift} disabled={isLoading}>
              {isLoading ? t("common.loading") : t("shifts.startShift")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
