import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    variant: "neutral",
    children: "Default Badge",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "positive", "negative"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Positive: Story = {
  args: {
    variant: "positive",
    children: "Positive Badge",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
    children: "Negative Badge",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
      <Badge variant="neutral">Neutral Badge</Badge>
      <Badge variant="positive">Positive Badge</Badge>
      <Badge variant="negative">Negative Badge</Badge>
    </div>
  ),
};
