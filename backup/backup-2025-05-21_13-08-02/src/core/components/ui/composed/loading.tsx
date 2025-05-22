import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface LoadingProps {
  variant?: "fullscreen" | "inline" | "overlay";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loading({
  variant = "inline",
  size = "md",
  text = "Loading...",
  className,
}: LoadingProps) {
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-80 ">
        <Loader2 className={cn("animate-spin", sizeMap[size])} />
        {text && <p className="mt-4 text-muted-foreground">{text}</p>}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-60">
        <Loader2 className={cn("animate-spin", sizeMap[size])} />
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeMap[size])} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
