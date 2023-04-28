import { PropsWithChildren } from "react";
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
  const uuid = Math.random().toString(36).substring(2, 15);
  return (
    <dialog id={uuid} open={open} className={styles.confirmDialog}>
      <form method="dialog" className={styles.confirmDialog__form}>
        <h2>{title}</h2>
        {children}
        <menu className={styles.confirmDialog__form__menu}>
          <Button
            variant="muted"
            type="button"
            value="cancel"
            onClick={() => onClose("cancel")}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            type="submit"
            id={`confirm-btn-${uuid}`}
            value="default"
            onClick={() => onClose("confirm")}
          >
            Confirmer
          </Button>
        </menu>
      </form>
    </dialog>
  );
};
