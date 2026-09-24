import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "Files",
    items: [
      { value: "Emails", content: <p>Content 1</p>, label: "Emails" },
      { value: "Files", content: <p>Content 2</p>, label: "Files" },
      { value: "Edits", content: <p>Content 3</p>, label: "Edits" },
      { value: "Dashboard", content: <p>Content 4</p>, label: "Dashboard" },
      { value: "Messages", content: <p>Content 5</p>, label: "Messages" },
    ],
    onValueChange: fn(),
    "aria-label": "Inbox",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "Files" },
};
