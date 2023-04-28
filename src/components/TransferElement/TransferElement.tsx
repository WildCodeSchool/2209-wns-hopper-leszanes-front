import {
  ChevronDown,
  Clock,
  Download,
  Edit2,
  Files,
  Lock,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Transfer } from "../../types/Transfer";
import { formatDateToLocalFrenchHour } from "../../utils/date";
import { ToolTip } from "../ToolTip/ToolTip";
import { useAuth } from "../../contexts/authContext";
import styles from "./TransferElement.module.scss";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { deleteCurrentUserTransferId } from "../../graphql/deleteCurrentUserTransferId";
import { useToast } from "../../contexts/hooks/ToastContext";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";

export type TransferElementProps = {
  transfer: Transfer;
  onDelete: () => void;
};

export const TransferElement = ({
  transfer,
  onDelete,
}: TransferElementProps) => {
  const [isPrivate, setIsPrivate] = useState(transfer.isPrivate);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [doDeleteMutation, { loading }] = useMutation<boolean>(
    deleteCurrentUserTransferId
  );
  const [isSelected, setIsSelected] = useState(false);
  const { createToast } = useToast();
  const createdAt = formatDateToLocalFrenchHour(transfer.createdAt);
  const updatedAt = formatDateToLocalFrenchHour(transfer.updatedAt);
  const isoStringCreatedAt = new Date(transfer.createdAt).toISOString();
  const isoStringUpdatedAt = new Date(transfer.updatedAt).toISOString();

  const { user } = useAuth();

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    setIsConfirmDeleteDialogOpen(true);
  };

  const deleteTransfer = async () => {
    try {
      const { data } = await doDeleteMutation({
        variables: {
          deleteCurrentUserTransferId: transfer.id,
        },
      });
      if (!loading && data) {
        createToast({
          id: "deletedTransferSuccess",
          title: "Suppression du transfert",
          description: "Le transfert a bien été supprimé",
          variant: "success",
        });
        onDelete();
        return;
      }
      if (!loading && !data) {
        createToast({
          id: "deletedTransferError",
          title: "Suppression du transfert",
          description: "Le transfert n'a pas pu être supprimé",
          variant: "error",
        });
        return;
      }
    } catch (err) {
      createToast({
        id: "deletedTransferCatchError",
        title: "Suppression du transfert",
        description: "Le transfert n'a pas pu être supprimé",
        variant: "error",
      });
    }
  };

  const handleOnConfirmDeleteDialogOpen = (type: "cancel" | "confirm") => {
    if (type === "confirm") {
      deleteTransfer();
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  if (loading) {
    return <LoadingLayout />;
  }
  return (
    <>
      <li className={styles.transferElement}>
        <details className={styles.transferElement__details}>
          <summary>
            <div className={styles.transferElement__details__header}>
              <div className={styles.transferElement__checkbox__container}>
                <input
                  className={styles.transferElement__checkbox}
                  onChange={(e) => {
                    setIsSelected(e.target.checked);
                  }}
                  checked={isSelected}
                  type="checkbox"
                  name={`transfer-${transfer.id}`}
                  id={`transfer-${transfer.id}`}
                />
              </div>
              <ChevronDown
                className={styles.transferElement__details__header__icon}
              />
              <h2>{transfer.name}</h2>
            </div>
            <div>
              <div className={styles.transferElement__details__actions}>
                <span>
                  créé par :{" "}
                  {transfer.createdBy.id === user?.id ? (
                    "moi"
                  ) : (
                    <ToolTip content={transfer.createdBy.email}>
                      <Link to={`/contacts/${transfer.createdBy.id}`}>
                        {transfer.createdBy.name}
                      </Link>
                    </ToolTip>
                  )}
                </span>
                {transfer.createdBy.id === user?.id ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPrivate((prev) => !prev);
                      }}
                    >
                      {isPrivate ? (
                        <ToolTip content="Partage privé">
                          <Lock />
                        </ToolTip>
                      ) : (
                        <ToolTip content="Partage public">
                          <Unlock />
                        </ToolTip>
                      )}
                    </button>
                    <button type="button">
                      <ToolTip content="Partagé avec">
                        <Users width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button type="button">
                      <ToolTip content="Gérer les fichiers">
                        <Files width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button type="button">
                      <ToolTip content="Modifier">
                        <Edit2 width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className={
                        styles.transferElement__details__actions__delete
                      }
                    >
                      <ToolTip content="Supprimer">
                        <Trash2 width={20} height={20} />
                      </ToolTip>
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button">
                      <ToolTip content="Voir les fichiers">
                        <Files width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button type="button">
                      <ToolTip content="Tout télécharger">
                        <Download width={20} height={20} />
                      </ToolTip>
                    </button>
                  </>
                )}
              </div>
            </div>
          </summary>
          <hr />
          <p className={styles.transferElement__details__description}>
            {transfer.description}
          </p>
          <p className={styles.transferElement__details__footer}>
            <Clock width={15} /> Créé le{" "}
            <time dateTime={isoStringCreatedAt}>{createdAt}</time> - Dernière
            modification le{" "}
            <time dateTime={isoStringUpdatedAt}>{updatedAt}</time>
          </p>
        </details>
      </li>
      {isConfirmDeleteDialogOpen && (
        <ConfirmDialog
          title="Supprimer le transfert"
          onClose={handleOnConfirmDeleteDialogOpen}
          open={isConfirmDeleteDialogOpen}
        >
          <p>Êtes-vous sûr de vouloir supprimer ce transfert ?</p>
        </ConfirmDialog>
      )}
    </>
  );
};
