import { PropsWithChildren } from "react";
import {
  type LinkProps as RouterLinkProps,
  Link as RouterLink,
} from "react-router-dom";
import styles from "./Link.module.scss";

type LinkProps = RouterLinkProps & React.RefAttributes<HTMLAnchorElement>;

export const Link = ({
  className,
  children,
  ...props
}: PropsWithChildren<LinkProps>) => {
  const computedClassName = `${styles.link} ${className ?? ""}`;
  return (
    <RouterLink {...props} className={computedClassName}>
      {children}
    </RouterLink>
  );
};
