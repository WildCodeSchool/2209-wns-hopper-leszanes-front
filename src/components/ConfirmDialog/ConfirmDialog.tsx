import { PropsWithChildren } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "../Button/Button";
import styles from "./ConfirmDialog.module.scss";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: (type: "cancel" | "confirm", data?: unknown) => void;
  title: string;
};

export const ConfirmDialog = ({
  open,
  children,
  onClose,
  title,
}: PropsWithChildren<ConfirmDialogProps>) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={() => onClose("cancel")}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.confirmDialog}>
          <AlertDialog.Content className={styles.confirmDialog__content}>
            <AlertDialog.Title asChild>
              <h2>{title}</h2>
            </AlertDialog.Title>
            <AlertDialog.Description asChild>
              {children}
            </AlertDialog.Description>
            <div className={styles.confirmDialog__buttons}>
              <AlertDialog.Cancel asChild>
                <Button
                  variant="muted"
                  type="button"
                  onClick={() => onClose("cancel")}
                >
                  Annuler
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  variant="destructive"
                  onClick={() => onClose("confirm")}
                >
                  Confirmer
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
