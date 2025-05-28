import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Header } from "../Header";

/**
 * Header component for application navigation
 * Styled with the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */
const meta = {
  title: "Features/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onLogin: action("onLogin"),
    onLogout: action("onLogout"),
    onCreateAccount: action("onCreateAccount"),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: "Jane Doe",
    },
  },
};

export const LoggedOut: Story = {};
