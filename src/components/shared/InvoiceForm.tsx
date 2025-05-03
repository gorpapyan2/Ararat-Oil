import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PaymentMethodForm,
  PaymentFormData,
} from "@/components/shared/PaymentMethodForm";
import { useTransactionCreation } from "@/hooks/useTransactionCreation";
import { useToast } from "@/hooks";
import { Loader2 } from "lucide-react";

interface InvoiceFormProps {
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

export function InvoiceForm({
  open,
  onOpenChange,
  onComplete,
  amount,
  employeeId,
  entityDetails,
  title = "Payment Invoice",
}: InvoiceFormProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
