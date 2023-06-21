import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CSSProperties, PropsWithChildren } from "react";
import { X } from "lucide-react";
import styles from "./Dialog.module.scss";
import { Button } from "../Button/Button";

export type DialogProps = {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export const Dialog = ({
  open,
  children,
  title,
  className = "",
  onOpenChange,
  style,
}: PropsWithChildren<DialogProps>) => {
  return (
    <DialogPrimitive.Root modal onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.dialog}>
          <DialogPrimitive.Content
            className={styles.dialog__content + className}
            style={style}
          >
            <DialogPrimitive.Close asChild>
              <Button
                icon={<X width={20} height={20} />}
                variant="muted"
                className={styles.dialog__close}
              />
            </DialogPrimitive.Close>
            <DialogPrimitive.Title asChild>
              <h2>{title}</h2>
            </DialogPrimitive.Title>
            <DialogPrimitive.Description asChild>
              {children}
            </DialogPrimitive.Description>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
