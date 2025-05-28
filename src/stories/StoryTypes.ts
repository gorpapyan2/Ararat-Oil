// This file provides type definitions for Storybook
// It avoids the need to install the actual @storybook packages during development

export interface Meta<T> {
  title: string;
  component: T;
  parameters?: Record<string, unknown>;
  tags?: string[];
  argTypes?: Record<string, unknown>;
}

export interface StoryObj<T> {
  args?: Record<string, unknown>;
  render?: (args: Record<string, unknown>) => JSX.Element;
}

// Re-export these types for use in story files
export type { Meta as StorybookMeta, StoryObj as StorybookStory };
