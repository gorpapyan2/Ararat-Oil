import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error state, applies error styling
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Custom resize behavior
   */
  resize?: "none" | "vertical" | "horizontal" | "both";

  /**
   * Auto grow height based on content
   */
  autoGrow?: boolean;

  /**
   * Maximum height when autoGrow is enabled (in pixels)
   */
  maxHeight?: number;
}

/**
 * Textarea component for multiline text input
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Enter your message" />
 * <Textarea error={true} errorMessage="This field is required" />
 * <Textarea resize="vertical" rows={4} />
 * <Textarea autoGrow maxHeight={300} />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      errorMessage,
      resize = "vertical",
      autoGrow,
      maxHeight = 500,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = useCombinedRefs(ref, textareaRef);

    // Auto resize textarea based on content height
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoGrow) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";

      // Calculate new height (capped at maxHeight)
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [autoGrow, maxHeight]);

    // Handle changes to resize the textarea
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e);
      if (autoGrow) adjustHeight();
    };

    // Adjust height on initial render and when props change
    React.useEffect(() => {
      if (autoGrow) adjustHeight();
    }, [autoGrow, adjustHeight, props.value, props.defaultValue]);

    return (
      <div className="w-full">
        <textarea
          ref={combinedRef}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-destructive focus-visible:ring-destructive": error,
              "resize-none": resize === "none",
              "resize-y": resize === "vertical",
              "resize-x": resize === "horizontal",
              resize: resize === "both",
            },
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * Combines multiple refs into one
 */
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return React.useCallback(
    (element: T) => {
      refs.forEach((ref) => {
        if (!ref) return;

        if (typeof ref === "function") {
          ref(element);
        } else {
          (ref as React.MutableRefObject<T>).current = element;
        }
      });
    },
    [refs]
  );
}

export { Textarea };
