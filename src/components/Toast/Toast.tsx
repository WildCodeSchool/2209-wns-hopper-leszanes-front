import { Root, Title, Description, Close } from "@radix-ui/react-toast";
import { Check, XCircle, XIcon } from "lucide-react";
import { ReactNode } from "react";
import styles from "./Toast.module.scss";

export type ToastProps = {
  title: ReactNode;
  description: ReactNode;
  variant?: "success" | "error";
};

export const Toast = ({ title, description, variant }: ToastProps) => {
  let computedClassName = `${styles.toast}`;
  if (variant === "success")
    computedClassName = `${styles.toast} ${styles.toast__success}`;
  if (variant === "error")
    computedClassName = `${styles.toast} ${styles.toast__error}`;
  return (
    <Root duration={2000} className={computedClassName}>
      <Title className={styles.toast__title}>{title}</Title>
      <Description className={styles.toast__description}>
        {description}
      </Description>
      <Close asChild className={styles.toast__close}>
        <XCircle width={20} />
      </Close>
      <div className={styles.toast__icon}>
        {variant === "success" && <Check width={20} />}
        {variant === "error" && <XIcon width={20} />}
      </div>
    </Root>
  );
};
