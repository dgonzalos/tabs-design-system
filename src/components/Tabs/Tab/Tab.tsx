import type React from "react";
import type { TabsVariant } from "../Tabs";
import styles from "./Tab.module.scss";

export interface TabProps extends React.ComponentPropsWithRef<"button"> {
  selected: boolean;
  label: string;
  variant: TabsVariant;
}

export function Tab({ selected, label, className, variant, ...rest }: TabProps) {
  const classes = [styles.tab, className].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
      {...rest}
      data-variant={variant}
      type="button"
      role="tab"
      aria-selected={selected}
    >
      {label}
    </button>
  );
}
