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

const getTabId = (baseId: string, index: number) => `${baseId}-tab-${index}`;
const getPanelId = (baseId: string, index: number) => `${baseId}-panel-${index}`;

export function Tabs({
  defaultValue,
  onValueChange,
  items,
  variant = "pill",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}: TabsProps) {
  const baseId = useId();
  // Fall back to the first tab if defaultValue matches no item
  const [selectedValue, setSelectedValue] = useState(() =>
    items.some((item) => item.value === defaultValue) ? defaultValue : items[0]?.value,
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (items.length === 0) {
    return null;
  }

  const selectTab = (value: string) => {
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
    selectTab(items[nextIndex].value);
    // Prevent the default action to avoid scrolling the page when navigating tabs with arrow keys
    event.preventDefault();
  };
  return (
    <div {...rest}>
      <div
        className={styles.tabList}
        data-variant={variant}
        role="tablist"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((item, index) => (
          <Tab
            selected={item.value === selectedValue}
            id={getTabId(baseId, index)}
            aria-controls={getPanelId(baseId, index)}
            key={item.value}
            label={item.label}
            onClick={() => selectTab(item.value)}
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
      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={getPanelId(baseId, index)}
          aria-labelledby={getTabId(baseId, index)}
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
