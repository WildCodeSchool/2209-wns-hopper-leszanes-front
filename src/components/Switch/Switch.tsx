import * as SwitchPrimitve from "@radix-ui/react-switch";
import { type ComponentProps, type ReactNode } from "react";
import styles from "./Switch.module.scss";

export type SwitchProps = {
  thumbProps?: ComponentProps<typeof SwitchPrimitve.Thumb>;
  children?: ReactNode;
} & ComponentProps<typeof SwitchPrimitve.Root>;

export const Switch = ({ thumbProps, children, ...props }: SwitchProps) => {
  return (
    <div className={styles.container}>
      <SwitchPrimitve.Root
        {...props}
        className={`${styles.root} ${props.className ?? ""}`}
      >
        <SwitchPrimitve.Thumb
          {...thumbProps}
          className={`${styles.thumb} ${thumbProps?.className ?? ""}`}
        />
      </SwitchPrimitve.Root>
      {children}
    </div>
  );
};
