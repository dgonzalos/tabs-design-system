import type React from "react";
import { Badge } from "../../Badge";
import type { TabItem, TabsVariant } from "../Tabs";
import styles from "./Tab.module.scss";

export interface TabProps extends React.ComponentPropsWithRef<"button"> {
  selected: boolean;
  label: string;
  variant: TabsVariant;
  badge?: TabItem["badge"];
}

export function Tab({ selected, label, variant, badge, ...rest }: TabProps) {
  return (
    <button
      className={styles.tab}
      {...rest}
      data-variant={variant}
      type="button"
      role="tab"
      aria-selected={selected}
    >
      {label} {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
    </button>
  );
}
