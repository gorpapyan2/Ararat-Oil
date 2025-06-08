
/**
 * This file re-exports input components from the primitives directory.
 * This helps maintain backward compatibility with existing imports.
 */

export {
  Input,
  InputWithIcon,
} from "@/core/components/ui/primitives/input";

// Create a basic InputProps type since it's missing from primitives
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
}

export type {
  InputWithIconProps,
} from "@/core/components/ui/primitives/input";
