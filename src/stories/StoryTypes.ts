// This file provides type definitions for Storybook
// It avoids the need to install the actual @storybook packages during development

export interface Meta<T> {
  title: string;
  component: T;
  parameters?: Record<string, any>;
  tags?: string[];
  argTypes?: Record<string, any>;
}

export interface StoryObj<T> {
  args?: Record<string, any>;
  render?: (args: any) => JSX.Element;
}

// Re-export these types for use in story files
export type { Meta as StorybookMeta, StoryObj as StorybookStory }; 