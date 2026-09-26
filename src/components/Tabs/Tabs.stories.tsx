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

export const PillVariant: Story = {};

export const UnderlineVariant: Story = {
  args: { variant: "underline" },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const WithBadge: Story = {
  args: {
    items: [
      {
        value: "Emails",
        content: <p>Content 1</p>,
        label: "Emails",
        badge: { label: "New", variant: "positive" },
      },
      {
        value: "Files",
        content: <p>Content 2</p>,
        label: "Files",
        badge: { label: "Updated", variant: "neutral" },
      },
      {
        value: "Edits",
        content: <p>Content 3</p>,
        label: "Edits",
        badge: { label: "3", variant: "negative" },
      },
      {
        value: "Dashboard",
        content: <p>Content 4</p>,
        label: "Dashboard",
        badge: { label: "1", variant: "positive" },
      },
      {
        value: "Messages",
        content: <p>Content 5</p>,
        label: "Messages",
        badge: { label: "5", variant: "neutral" },
      },
    ],
  },
};
