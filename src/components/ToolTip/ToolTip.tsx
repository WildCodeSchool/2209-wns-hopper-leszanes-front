import { CSSProperties, PropsWithChildren } from "react";
import styles from "./ToolTip.module.scss";

export type ToolTipProps = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

export const ToolTip = ({
  content,
  children,
  className = "",
  style = undefined,
}: PropsWithChildren<ToolTipProps>) => {
  return (
    <div className={styles.toolTip + className} style={style}>
      <p className={styles.toolTip__content}>{content}</p>
      {children}
    </div>
  );
};
