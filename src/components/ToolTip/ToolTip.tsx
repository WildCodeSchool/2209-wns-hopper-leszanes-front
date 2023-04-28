import { PropsWithChildren } from "react";
import styles from "./ToolTip.module.scss";

export type ToolTipProps = {
  content: string;
};

export const ToolTip = ({
  content,
  children,
}: PropsWithChildren<ToolTipProps>) => {
  return (
    <div className={styles.toolTip}>
      <p className={styles.toolTip__content}>{content}</p>
      {children}
    </div>
  );
};
