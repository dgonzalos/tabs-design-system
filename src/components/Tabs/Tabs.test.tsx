import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { type TabItem, Tabs, type TabsProps } from "./Tabs";

describe("Tabs", () => {
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

  const defaultValue = "tab2";

  it("renders a panel for each tab and shows only the selected one", () => {
    renderTabs({ defaultValue });
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

  it("renders the label of each tab", () => {
    renderTabs({ defaultValue });
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent("Tab 1");
    expect(tabs[1]).toHaveTextContent("Tab 2");
    expect(tabs[2]).toHaveTextContent("Tab 3");
  });

  it("renders the content of each panel", () => {
    renderTabs({ defaultValue });
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels).toHaveLength(3);
    expect(panels[0]).toHaveTextContent("Content 1");
    expect(panels[1]).toHaveTextContent("Content 2");
    expect(panels[2]).toHaveTextContent("Content 3");
  });

  it("doesn't call onValueChange when clicking on the selected tab", async () => {
    const onValueChangeMock = vi.fn();
    renderTabs({ defaultValue, onValueChange: onValueChangeMock });
    const selectedTab = screen.getByRole("tab", { name: "Tab 2" });
    await userEvent.click(selectedTab);
    expect(onValueChangeMock).not.toHaveBeenCalled();
  });

  it("calls onValueChange when clicking on a different tab", async () => {
    const onValueChangeMock = vi.fn();
    renderTabs({ defaultValue, onValueChange: onValueChangeMock });
    const unselectedTab = screen.getByRole("tab", { name: "Tab 1" });
    await userEvent.click(unselectedTab);
    expect(onValueChangeMock).toHaveBeenCalledWith("tab1");
  });

  it("does not submit the form when clicking on a tab", async () => {
    const onSubmitMock = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={onSubmitMock}>
        <Tabs defaultValue={defaultValue} items={tabList} />
        <button type="submit">Submit</button>
      </form>,
    );
    const unselectedTab = screen.getByRole("tab", { name: "Tab 1" });
    await userEvent.click(unselectedTab);
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("selects the first tab when there is no defaultValue", () => {
    renderTabs();
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

  it("selects the tab given by defaultValue", () => {
    renderTabs({ defaultValue });
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
    renderTabs({ defaultValue });
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
    renderTabs({ defaultValue });
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
    renderTabs({ defaultValue });
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
    renderTabs({ defaultValue, items: tabListWithInput });
    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    const secondTab = screen.getByRole("tab", { name: "Tab 2" });

    await userEvent.type(screen.getByDisplayValue("Input 2"), " changed");

    await userEvent.click(firstTab);
    await userEvent.click(secondTab);

    expect(screen.getByDisplayValue("Input 2 changed")).toBeVisible();
  });

  it("renders className and native props to the root element", () => {
    const { container } = renderTabs({ defaultValue, className: "custom", title: "root" });

    const root = container.firstElementChild;
    expect(root).toHaveClass("custom");
    expect(root).toHaveAttribute("title", "root");
  });

  it("renders the Tabs with no axe accessibility violations", async () => {
    const { container } = renderTabs({ defaultValue });
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
    renderTabs({ defaultValue, items: tabListWithBadges });
    expect(screen.getByRole("tab", { name: "Emails New" })).toBeInTheDocument();
  });

  it("renders only the label when the tab has no badge", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
  });

  it("gives tabindex 0 only to the selected tab", () => {
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
});
