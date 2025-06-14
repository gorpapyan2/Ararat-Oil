import { useState, useEffect } from "react";
import { StandardDialog } from "@/core/components/ui/composed/base-dialog";
import {
  PaymentMethodFormStandardized as PaymentMethodForm,
  PaymentFormData,
} from "@/shared/components/shared/PaymentMethodFormStandardized";
import { useTransactionCreation } from "@/hooks/useTransactionCreation";
import { useToast } from "@/hooks";
import { Loader2 } from "lucide-react";

interface InvoiceFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  amount: number;
  employeeId: string;
  entityDetails: {
    id: string;
    type: string;
    date: string;
    description?: string;
    employee?: string;
  };
  title?: string;
}

export function InvoiceFormStandardized({
  open,
  onOpenChange,
  onComplete,
  amount,
  employeeId,
  entityDetails,
  title = "Payment Invoice",
}: InvoiceFormStandardizedProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: createTransaction } = useTransactionCreation();

  // Close dialog if payment is completed
  useEffect(() => {
    if (!isProcessing && !open) {
      setIsProcessing(false);
    }
  }, [open, isProcessing]);

  const handlePayment = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      await createTransaction({
        amount,
        payment_method: data.payment_method,
        payment_reference: data.payment_reference,
        employee_id: employeeId,
        description:
          entityDetails.description || `Payment for ${entityDetails.type}`,
        entity_type: entityDetails.type as "sale" | "expense" | "fuel_supply",
        entity_id: entityDetails.id,
        type: "income",
        created_by: employeeId,
      });

      toast({
        title: "Payment Completed",
        description: "The invoice has been successfully processed.",
      });

      if (onComplete) {
        onComplete();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StandardDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={title}
      className="sm:max-w-md"
    >
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Processing payment...
          </p>
        </div>
      ) : (
        <PaymentMethodForm
          onSubmit={handlePayment}
          isSubmitting={isProcessing}
          amount={amount}
          title="Complete Payment"
          description="Please enter payment details below"
          entityDetails={entityDetails}
        />
      )}
    </StandardDialog>
  );
}
