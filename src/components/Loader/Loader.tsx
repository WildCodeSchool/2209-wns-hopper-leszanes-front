import { Loader2, LucideProps } from "lucide-react";
import styles from "./Loader.module.scss";

export const Loader = ({ className, ...props }: LucideProps) => {
  return (
    <Loader2 className={`${styles.loader} ${className ?? ""}`} {...props} />
  );
};
