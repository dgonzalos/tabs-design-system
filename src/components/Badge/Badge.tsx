import type React from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export interface BadgeProps extends React.ComponentPropsWithRef<"span"> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

export function Badge({ variant = "neutral", children, className, ...rest }: BadgeProps) {
  const classes = [styles.badge, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...rest} data-variant={variant}>
      {children}
    </span>
  );
}
