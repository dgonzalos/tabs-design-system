import type React from "react";
import styles from "./Tab.module.scss";

export interface TabProps extends React.ComponentPropsWithRef<"button"> {
  selected: boolean;
  label: string;
}

export function Tab({ selected, label, className, ...rest }: TabProps) {
  const classes = [styles.tab, className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...rest} type="button" role="tab" aria-selected={selected}>
      {label}
    </button>
  );
}
