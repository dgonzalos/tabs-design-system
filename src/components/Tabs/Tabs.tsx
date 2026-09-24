import type React from "react";
import { useId, useState } from "react";
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
            variant={variant}
            badge={item.badge}
          />
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={getPanelId(baseId, item.value)}
          aria-labelledby={getTabId(baseId, item.value)}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the ARIA tabs pattern puts the panel in the tab order
          tabIndex={0}
          hidden={item.value !== selectedValue}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
