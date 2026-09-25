import type React from "react";
import { useId, useRef, useState } from "react";
import type { BadgeVariant } from "../Badge";
import { Tab } from "./Tab/Tab";
import styles from "./Tabs.module.scss";

export type TabsVariant = "pill" | "underline";

export type TabItem = {
  value: string;
  content: React.ReactNode;
  label: string;
  badge?: { label: string; variant?: BadgeVariant };
};

export interface TabsProps extends React.ComponentPropsWithRef<"div"> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items: TabItem[];
  variant?: TabsVariant;
}

const getTabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const getPanelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export function Tabs({
  defaultValue,
  onValueChange,
  items,
  variant = "pill",
  "aria-label": ariaLabel,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue ?? items[0].value);
  const onTabClick = (value: string) => {
    if (value === selectedValue) {
      return;
    }
    setSelectedValue(value);
    onValueChange?.(value);
  };

  // Handle keyboard navigation between tabs
  const onTabKeyDown = (value: string) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    let currentIndex = items.findIndex((item) => item.value === value);
    if (event.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % items.length;
      tabRefs.current[items[currentIndex].value]?.focus();
      onTabClick(items[currentIndex].value);
      // Prevent the default action to avoid scrolling the page when navigating tabs with arrow keys
      event.preventDefault();
    } else if (event.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      tabRefs.current[items[currentIndex].value]?.focus();
      onTabClick(items[currentIndex].value);
      // Prevent the default action to avoid scrolling the page when navigating tabs with arrow keys
      event.preventDefault();
    }
  };
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  return (
    <div {...rest}>
      <div className={styles.tabList} data-variant={variant} role="tablist" aria-label={ariaLabel}>
        {items.map((item) => (
          <Tab
            selected={item.value === selectedValue}
            id={getTabId(baseId, item.value)}
            aria-controls={getPanelId(baseId, item.value)}
            key={item.value}
            label={item.label}
            onClick={() => onTabClick(item.value)}
            onKeyDown={onTabKeyDown(item.value)}
            variant={variant}
            badge={item.badge}
            ref={(el) => {
              tabRefs.current[item.value] = el;
            }}
            tabIndex={item.value === selectedValue ? 0 : -1}
          />
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={getPanelId(baseId, item.value)}
          aria-labelledby={getTabId(baseId, item.value)}
          hidden={item.value !== selectedValue}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the ARIA tabs pattern puts the panel in the tab order
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
