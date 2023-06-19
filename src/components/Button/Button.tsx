import { ReactNode, forwardRef } from "react";
import styles from "./Button.module.scss";
import { Loader } from "../Loader/Loader";

type ButtonProps = {
  icon?: ReactNode;
  variant?: "destructive" | "muted";
  isLoading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, children, icon, isLoading = false, ...props }, ref) => {
    let computedClassName = `${styles.button}`;
    if (variant === "destructive")
      computedClassName += ` ${styles.button__destructive}`;
    if (variant === "muted") computedClassName += ` ${styles.button__muted}`;
    if (isLoading) computedClassName += ` ${styles.button__loading}`;
    computedClassName += ` ${props.className ?? ""}`;

    return (
      // eslint-disable-next-line react/button-has-type
      <button
        disabled={props.disabled ?? isLoading}
        {...props}
        className={computedClassName}
        ref={ref}
      >
        <span
          className={styles.button__icon}
          style={{ display: "inline-flex" }}
        >
          {icon}
        </span>
        <span className={styles.button__text}>{children}</span>
        {isLoading && <Loader className={styles.button__loader} />}
      </button>
    );
  }
);
