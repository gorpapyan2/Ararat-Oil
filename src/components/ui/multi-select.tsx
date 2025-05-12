"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: Option[];
  placeholder?: string;
  value: Option[];
  onChange: (options: Option[]) => void;
  className?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  placeholder = "Select options...",
  value = [],
  onChange,
  className,
  disabled = false,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (option: Option) => {
      onChange(value.filter((item) => item.value !== option.value));
    },
    [onChange, value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && value.length > 0) {
            handleUnselect(value[value.length - 1]);
          }
        }
        // Allow input navigation with arrow keys
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown"
        ) {
          e.stopPropagation();
          return;
        }
      }
    },
    [handleUnselect, value]
  );

  const selectables = options.filter(
    (option) => !value.some((item) => item.value === option.value)
  );

  return (
    <div className={cn("relative", className)}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div
          className={cn(
            "group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.focus();
              setOpen(true);
            }
          }}
        >
          <div className="flex flex-wrap gap-1">
            {value.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {option.label}
                {!disabled && (
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] disabled:cursor-not-allowed"
            />
          </div>
        </div>
        <div className="relative">
          {open && selectables.length > 0 && (
            <div className="absolute w-full z-10 top-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto max-h-[200px]">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...value, option]);
                    }}
                    className={cn(
                      "cursor-pointer",
                      option.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
} 