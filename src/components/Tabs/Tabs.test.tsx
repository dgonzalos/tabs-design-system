import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type TabItem, Tabs, type TabsProps } from "./Tabs";

describe("Tabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const tabList = [
    { value: "tab1", content: "Content 1", label: "Tab 1" },
    { value: "tab2", content: "Content 2", label: "Tab 2" },
    { value: "tab3", content: "Content 3", label: "Tab 3" },
  ];

  function getPanelFor(tab: HTMLElement) {
    return document.getElementById(tab.getAttribute("aria-controls") ?? "");
  }

  function renderTabs(props: Partial<TabsProps> = {}) {
    return render(<Tabs aria-label="Inbox" items={tabList} {...props} />);
  }

  const onValueChangeMock = vi.fn();
  const defaultValue = "tab2";

  it("renders the Tabs component with default props", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });
    const tab3 = screen.getByRole("tab", { name: "Tab 3" });

    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
    expect(tab3).toBeInTheDocument();

    const panel1 = getPanelFor(tab1);
    const panel2 = getPanelFor(tab2);
    const panel3 = getPanelFor(tab3);

    expect(panel1).toBeInTheDocument();
    expect(panel2).toBeInTheDocument();
    expect(panel3).toBeInTheDocument();

    expect(panel2).toBeVisible();
    expect(panel1).not.toBeVisible();
    expect(panel3).not.toBeVisible();
  });

  it("renders the Tabs with getByRole and finds it", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
  });

  it("renders the Tabs with their corresponding labels and finds them", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const labels = screen.getAllByRole("tab");
    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveTextContent("Tab 1");
    expect(labels[1]).toHaveTextContent("Tab 2");
    expect(labels[2]).toHaveTextContent("Tab 3");
  });

  it("renders the Tabs with their corresponding panels and finds them", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels).toHaveLength(3);
    expect(panels[0]).toHaveTextContent("Content 1");
    expect(panels[1]).toHaveTextContent("Content 2");
    expect(panels[2]).toHaveTextContent("Content 3");
  });

  it("doesn't call onValueChange when clicking on the selected tab", async () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const selectedTab = screen.getByRole("tab", { name: "Tab 2" });
    await userEvent.click(selectedTab);
    expect(onValueChangeMock).not.toHaveBeenCalled();
  });

  it("calls onValueChange when clicking on a different tab", async () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const unselectedTab = screen.getByRole("tab", { name: "Tab 1" });
    await userEvent.click(unselectedTab);
    expect(onValueChangeMock).toHaveBeenCalledWith("tab1");
  });

  it("does not submit the form when clicking on a tab", async () => {
    const onSubmitMock = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={onSubmitMock}>
        <Tabs defaultValue={defaultValue} onValueChange={onValueChangeMock} items={tabList} />
        <button type="submit">Submit</button>
      </form>,
    );
    const unselectedTab = screen.getByRole("tab", { name: "Tab 1" });
    await userEvent.click(unselectedTab);
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("renders the Tabs without a defaultValue and selects the first tab has aria-selected true", () => {
    renderTabs({ onValueChange: onValueChangeMock, items: tabList });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    const thirdTab = screen.getByRole("tab", { name: "Tab 3" });

    const panel1 = getPanelFor(firstTab);
    const panel2 = getPanelFor(secondTab);
    const panel3 = getPanelFor(thirdTab);

    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(panel1).toBeVisible();
    expect(secondTab).toHaveAttribute("aria-selected", "false");
    expect(panel2).not.toBeVisible();
    expect(thirdTab).toHaveAttribute("aria-selected", "false");
    expect(panel3).not.toBeVisible();
  });

  it("renders the Tabs with the selected tab as defaultValue and it is visible and has aria-selected true", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    const thirdTab = screen.getByRole("tab", { name: "Tab 3" });

    const firstPanel = getPanelFor(firstTab);
    const secondPanel = getPanelFor(secondTab);
    const thirdPanel = getPanelFor(thirdTab);

    expect(firstTab).toHaveAttribute("aria-selected", "false");
    expect(firstPanel).not.toBeVisible();
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(secondPanel).toBeVisible();
    expect(thirdTab).toHaveAttribute("aria-selected", "false");
    expect(thirdPanel).not.toBeVisible();
  });

  it("renders the tabs linked by aria-labelledby and aria-controls", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    const thirdTab = screen.getByRole("tab", { name: "Tab 3" });
    const firstPanel = getPanelFor(firstTab);
    const secondPanel = getPanelFor(secondTab);
    const thirdPanel = getPanelFor(thirdTab);

    expect(firstPanel).toHaveAttribute("aria-labelledby", firstTab?.id);
    expect(secondPanel).toHaveAttribute("aria-labelledby", secondTab?.id);
    expect(thirdPanel).toHaveAttribute("aria-labelledby", thirdTab?.id);
  });

  it("renders the Tabs with each panel having a tabIndex of 0", () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    const thirdTab = screen.getByRole("tab", { name: "Tab 3" });
    const firstPanel = getPanelFor(firstTab);
    const secondPanel = getPanelFor(secondTab);
    const thirdPanel = getPanelFor(thirdTab);
    expect(firstPanel).toHaveAttribute("tabindex", "0");
    expect(secondPanel).toHaveAttribute("tabindex", "0");
    expect(thirdPanel).toHaveAttribute("tabindex", "0");
  });

  it("changes the tab selection when clicking on a different tab and updates the aria-selected attribute", async () => {
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabList });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    const thirdTab = screen.getByRole("tab", { name: "Tab 3" });

    expect(firstTab).toHaveAttribute("aria-selected", "false");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(thirdTab).toHaveAttribute("aria-selected", "false");

    await userEvent.click(firstTab);

    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(secondTab).toHaveAttribute("aria-selected", "false");
    expect(thirdTab).toHaveAttribute("aria-selected", "false");
  });

  it("keeps the state of an Input field in the previous selected tab when clicking on a different tab", async () => {
    const tabListWithInput = [
      { value: "tab1", content: <input type="text" defaultValue="Input 1" />, label: "Tab 1" },
      { value: "tab2", content: <input type="text" defaultValue="Input 2" />, label: "Tab 2" },
      { value: "tab3", content: <input type="text" defaultValue="Input 3" />, label: "Tab 3" },
    ];
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabListWithInput });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });

    await userEvent.type(screen.getByDisplayValue("Input 2"), " changed");

    await userEvent.click(firstTab);
    await userEvent.click(secondTab);

    expect(screen.getByDisplayValue("Input 2 changed")).toBeVisible();
  });

  it("renders className and native props to the root element", () => {
    const { container } = renderTabs({ className: "custom", title: "root" });

    const root = container.firstElementChild;
    expect(root).toHaveClass("custom");
    expect(root).toHaveAttribute("title", "root");
  });

  it("renders the Tabs with no axe accessibility violations", async () => {
    const { container } = renderTabs({
      onValueChange: onValueChangeMock,
      defaultValue,
      items: tabList,
    });
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });

  it("uses the pill variant by default", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "pill");
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute("data-variant", "pill");
    });
  });

  it("uses the underline variant when specified", () => {
    renderTabs({ variant: "underline" });
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "underline");
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute("data-variant", "underline");
    });
  });

  it("renders tabs with badges correctly", () => {
    const tabListWithBadges: TabItem[] = [
      {
        value: "Emails",
        content: <p>Content 1</p>,
        label: "Emails",
        badge: { label: "New", variant: "positive" },
      },
    ];
    renderTabs({ onValueChange: onValueChangeMock, defaultValue, items: tabListWithBadges });
    expect(screen.getByRole("tab", { name: "Emails New" })).toBeInTheDocument();
  });

  it("renders only the label when the tab has no badge", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
  });

  it("renders the correct tab as selected by default", () => {
    renderTabs({ defaultValue: "tab2" });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    expect(firstTab).toHaveAttribute("tabindex", "-1");
    expect(secondTab).toHaveAttribute("tabindex", "0");
  });

  it("changes the selected tab when pressing arrow keys", async () => {
    renderTabs({ defaultValue: "tab1" });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });

    firstTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(firstTab).toHaveAttribute("tabindex", "-1");
    expect(secondTab).toHaveAttribute("tabindex", "0");

    await userEvent.keyboard("{ArrowLeft}");
    expect(firstTab).toHaveAttribute("tabindex", "0");
    expect(secondTab).toHaveAttribute("tabindex", "-1");
  });

  it("renders one tab with tab index 0 and the rest with -1", () => {
    renderTabs({ defaultValue: "tab1" });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });
    expect(firstTab).toHaveAttribute("tabindex", "0");
    expect(secondTab).toHaveAttribute("tabindex", "-1");
  });
});
