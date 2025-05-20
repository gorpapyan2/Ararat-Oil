import { StandardDialog } from "@/components/ui/composed/dialog";
import { useTranslation } from "react-i18next";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ShiftPaymentMethod {
  payment_method: string;
  amount: number;
  reference?: string;
}

interface PaymentDetailsDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethods: ShiftPaymentMethod[];
  salesTotal: number;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('hy-AM', {
    style: 'currency',
    currency: 'AMD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function PaymentDetailsDialogStandardized({
  open,
  onOpenChange,
  paymentMethods,
  salesTotal,
}: PaymentDetailsDialogStandardizedProps) {
  const { t } = useTranslation();

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("shifts.paymentMethodsDetails")}
      description={t("shifts.paymentMethodsDetailsDescription")}
    >
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-3 font-medium text-sm py-2 border-b">
          <div>{t("common.paymentMethod")}</div>
          <div>{t("common.amount")}</div>
          <div>{t("common.reference")}</div>
        </div>
        
        {paymentMethods.map((method, index) => (
          <div key={index} className="grid grid-cols-3 text-sm py-2 border-b border-muted">
            <div className="capitalize">
              {t(`paymentMethods.${method.payment_method}`)}
            </div>
            <div>{formatCurrency(method.amount)}</div>
            <div className="truncate">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left">
                    {method.reference || "-"}
                  </TooltipTrigger>
                  {method.reference && (
                    <TooltipContent>
                      <p>{method.reference}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between pt-4 font-medium">
          <span>{t("common.total")}</span>
          <span>{formatCurrency(salesTotal)}</span>
        </div>
      </div>
    </StandardDialog>
  );
} 