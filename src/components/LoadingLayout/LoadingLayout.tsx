import { memo } from "react";
import styles from "./LoadingLayout.module.scss";
import { Loader } from "../Loader/Loader";

const LoadingLayoutComponent = () => {
  return (
    <div className={styles.loaderLayout}>
      <Loader width={50} />
    </div>
  );
};

export const LoadingLayout = memo(LoadingLayoutComponent);
