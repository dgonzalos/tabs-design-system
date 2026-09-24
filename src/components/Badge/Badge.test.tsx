import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";
import styles from "./Badge.module.scss";

describe("Badge", () => {
  it("renders the Badge component with default props", () => {
    render(<Badge>Default Badge</Badge>);
    const badgeElement = screen.getByText("Default Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveAttribute("data-variant", "neutral");
  });

  it("renders the Badge component with a positive variant", () => {
    render(<Badge variant="positive">Positive Badge</Badge>);
    const badgeElement = screen.getByText("Positive Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveAttribute("data-variant", "positive");
  });

  it("renders the Badge component with a negative variant", () => {
    render(<Badge variant="negative">Negative Badge</Badge>);
    const badgeElement = screen.getByText("Negative Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveAttribute("data-variant", "negative");
  });

  it("applies additional class names passed via className prop", () => {
    render(<Badge className="custom-class">Custom Class Badge</Badge>);
    const badgeElement = screen.getByText("Custom Class Badge");
    expect(badgeElement).toHaveClass("custom-class");
    expect(badgeElement).toHaveClass(styles.badge);
  });

  it("forwards additional props to the underlying span element", () => {
    render(
      <Badge data-testid="test-badge" title="Test Badge">
        Test Badge
      </Badge>,
    );
    const badgeElement = screen.getByText("Test Badge");
    expect(badgeElement).toHaveAttribute("data-testid", "test-badge");
    expect(badgeElement).toHaveAttribute("title", "Test Badge");
  });
});
