import { Loader2 } from "lucide-react";
import { memo } from "react";
import styles from "./LoadingLayout.module.scss";

const LoadingLayoutComponent = () => {
  return (
    <div className={styles.loaderLayout}>
      <Loader2 className={styles.loader} width={50} />
    </div>
  );
};

export const LoadingLayout = memo(LoadingLayoutComponent);
