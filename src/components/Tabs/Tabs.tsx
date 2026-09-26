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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabClick = (value: string) => {
    if (value === selectedValue) {
      return;
    }
    setSelectedValue(value);
    onValueChange?.(value);
  };

  // Handle keyboard navigation between tabs
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    let nextIndex: number;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else {
      nextIndex = (index - 1 + items.length) % items.length;
    }

    tabRefs.current[nextIndex]?.focus();
    onTabClick(items[nextIndex].value);
    // Prevent the default action to avoid scrolling the page when navigating tabs with arrow keys
    event.preventDefault();
  };
  return (
    <div {...rest}>
      <div className={styles.tabList} data-variant={variant} role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <Tab
            selected={item.value === selectedValue}
            id={getTabId(baseId, item.value)}
            aria-controls={getPanelId(baseId, item.value)}
            key={item.value}
            label={item.label}
            onClick={() => onTabClick(item.value)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            variant={variant}
            badge={item.badge}
            ref={(el) => {
              tabRefs.current[index] = el;
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
