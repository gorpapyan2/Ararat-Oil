
import * as React from "react";
import { cn } from "@/shared/utils";

// Create a simple OTP input context
const OTPInputContext = React.createContext<{
  slots: number;
  value: string;
  onChange: (value: string) => void;
} | null>(null);

export interface InputOTPProps extends React.HTMLAttributes<HTMLDivElement> {
  maxLength: number;
  value?: string;
  onChange?: (value: string) => void;
}

export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, maxLength, value = "", onChange, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({
      slots: maxLength,
      value,
      onChange: onChange || (() => {}),
    }), [maxLength, value, onChange]);

    return (
      <OTPInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </OTPInputContext.Provider>
    );
  }
);
InputOTP.displayName = "InputOTP";

export const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const char = inputOTPContext?.value?.[index];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          className
        )}
        {...props}
      >
        {char}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

export const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <span>-</span>
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";
