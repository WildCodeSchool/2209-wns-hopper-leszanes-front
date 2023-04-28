import { ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonPropsFull = {
  icon?: ReactNode;
  variant?: "destructive" | "muted";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = Omit<ButtonPropsFull, "className">;

export const Button = ({ variant, children, icon, ...props }: ButtonProps) => {
  let computedClassName = `${styles.button}`;
  if (variant === "destructive")
    computedClassName = `${styles.button} ${styles.button__destructive}`;
  if (variant === "muted")
    computedClassName = `${styles.button} ${styles.button__muted}`;
  return (
    // eslint-disable-next-line react/button-has-type
    <button {...props} className={computedClassName}>
      {icon}
      {children}
    </button>
  );
};
