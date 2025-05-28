import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { Page } from "../Page";

/**
 * Page component for main content layout
 * Styled with the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */
const meta = {
  title: "Features/Layout/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await canvas.getByRole("button", { name: /Log in/i });
    await userEvent.click(loginButton);
  },
};
