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
import { FormEvent, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Transfer } from "../../types/Transfer";
import { formatDateToLocalFrenchHour } from "../../utils/date";
import { ToolTip } from "../ToolTip/ToolTip";
import { useAuth } from "../../contexts/authContext";
import styles from "./TransferElement.module.scss";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { deleteCurrentUserTransfer } from "../../graphql/transfer/deleteCurrentUserTransfer";
import { useToast } from "../../contexts/hooks/ToastContext";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";
import { Dialog } from "../Dialog/Dialog";
import { EditTransferForm } from "../../views/Transfers/components/EditTransferForm/EditTransferForm";
import { getFormData } from "../../utils/forms";
import { updateCurrentUserTransfer } from "../../graphql/transfer/updateCurrentUserTransfer";
import { EditUsersForm } from "../../views/Transfers/components/EditUsersForm/EditUsersForm";
import { User } from "../../types/User";
import { EditFilesForm } from "../../views/Transfers/components/EditFilesForm/EditFilesForm";
import { File } from "../../types/File";
import { ShowTransferFiles } from "../../views/Transfers/components/ShowTransferFiles/ShowTransferFiles";
import { useDownloadAllTransferFiles } from "../../hooks/useDownloadAllTransferFiles";
import { getCurrentUserTransferFiles } from "../../graphql/transfer/getCurrentUserTransferFiles";

export type TransferElementProps = {
  transferData: Transfer;
  refresh: () => void;
  onSelectChange: (id: number) => void;
  isSelected?: boolean;
};

export const TransferElement = ({
  transferData,
  refresh,
  onSelectChange,
  isSelected,
}: TransferElementProps) => {
  const [transfer, setTransfer] = useState<Transfer>(transferData);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [doDeleteMutation, { loading: isDeleteLoading }] = useMutation<boolean>(
    deleteCurrentUserTransfer
  );
  const { createToast } = useToast();
  const createdAt = formatDateToLocalFrenchHour(transfer.createdAt);
  const updatedAt = formatDateToLocalFrenchHour(transfer.updatedAt);
  const isoStringCreatedAt = new Date(transfer.createdAt).toISOString();
  const isoStringUpdatedAt = new Date(transfer.updatedAt).toISOString();
  const [doUpdateMutation, { loading: isUpdateLoading }] = useMutation<{
    updateCurrentUserTransfer: Transfer;
  }>(updateCurrentUserTransfer);
  const { user } = useAuth();
  const [isUsersEditDialogOpen, setIsUsersEditDialogOpen] = useState(false);
  const [isFilesEditDialogOpen, setIsFilesEditDialogOpen] = useState(false);
  const [isShowFilesDialogOpen, setIsShowFilesDialogOpen] = useState(false);
  const { downloadAllFiles } = useDownloadAllTransferFiles();

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleEdit = (e: MouseEvent) => {
    e.preventDefault();
    setIsEditDialogOpen(true);
  };

  const deleteTransfer = async () => {
    try {
      const { data } = await doDeleteMutation({
        variables: {
          deleteCurrentUserTransferId: transfer.id,
        },
      });
      if (!isDeleteLoading && data) {
        createToast({
          id: "deletedTransferSuccess",
          title: "Suppression du transfert",
          description: "Le transfert a bien été supprimé",
          variant: "success",
        });
        refresh();
        return;
      }
      if (!isDeleteLoading && !data) {
        createToast({
          id: "deletedTransferError",
          title: "Suppression du transfert",
          description: "Le transfert n'a pas pu être supprimé",
          variant: "error",
        });
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
  const updateTransfer = async (dataToUpdate: object) => {
    const data = {
      ...transfer,
      ...dataToUpdate,
      id: transfer.id,
      isPrivate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      __typename: undefined,
      createdBy: undefined,
    };

    try {
      const { data: response } = await doUpdateMutation({
        variables: {
          data,
        },
      });
      if (!isUpdateLoading && response) {
        createToast({
          id: "updatedTransferSuccess",
          title: "Modification du transfert",
          description: "Le transfert a bien été modifié",
          variant: "success",
        });
        setTransfer((prev) => {
          return {
            ...prev,
            name: response.updateCurrentUserTransfer.name,
            description: response.updateCurrentUserTransfer.description,
            updatedAt: response.updateCurrentUserTransfer.updatedAt,
            users: response.updateCurrentUserTransfer.users,
            files: response.updateCurrentUserTransfer.files,
          };
        });
        setIsEditDialogOpen(false);
        return;
      }
      if (!isUpdateLoading && !response) {
        createToast({
          id: "updatedTransferError",
          title: "Modification du transfert",
          description: "Le transfert n'a pas pu être modifié",
          variant: "error",
        });
      }
    } catch (err) {
      createToast({
        id: "updatedTransferCatchError",
        title: "Modification du transfert",
        description: "Le transfert n'a pas pu être modifié",
        variant: "error",
      });
    }
  };

  const handleSubmitEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = getFormData(e);
    updateTransfer(formData);
  };

  const handleUpdateTransferUsers = async (users: User[]) => {
    const data = {
      userIds: users.map((u) => u.id),
    };
    await updateTransfer(data);
  };

  const handleUpdateTransferFiles = async (files: File[]) => {
    const data = {
      fileIds: files.map((u) => u.id),
    };
    await updateTransfer(data);
  };

  const [getFiles, { error }] = useLazyQuery<{
    getCurrentUserTransferFiles: File[];
  }>(getCurrentUserTransferFiles, {
    variables: {
      getCurrentUserTransferFilesId: Number(transfer.id),
    },
  });

  const handleDownloadAllFiles = async () => {
    const response = await getFiles();
    if (error) {
      createToast({
        id: "downloadAllFilesError",
        title: "Téléchargement des fichiers",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "error",
      });
    }
    downloadAllFiles(response.data?.getCurrentUserTransferFiles ?? []);
  };

  if (isDeleteLoading) {
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
                  onChange={() => {
                    onSelectChange(transfer.id);
                  }}
                  checked={isSelected ?? false}
                  type="checkbox"
                  name={`transfer-${transfer.id}`}
                  id={`transfer-${transfer.id}`}
                />
              </div>
              <ChevronDown
                width={20}
                height={20}
                className={styles.transferElement__details__header__icon}
              />
              <h2>{transfer.name}</h2>
            </div>
            <div className={styles.transferElement__details__header__actions}>
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
                    {transfer.isPrivate ? (
                      <ToolTip
                        content="Partage privé"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Lock width={20} height={20} />
                      </ToolTip>
                    ) : (
                      <ToolTip content="Partage public">
                        <Unlock width={20} height={20} />
                      </ToolTip>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsUsersEditDialogOpen(true)}
                    >
                      <ToolTip content="Partagé avec">
                        <Users width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button
                      onClick={() => setIsFilesEditDialogOpen(true)}
                      type="button"
                    >
                      <ToolTip content="Gérer les fichiers">
                        <Files width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button type="button" onClick={handleEdit}>
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
                    <button
                      onClick={() => setIsShowFilesDialogOpen(true)}
                      type="button"
                    >
                      <ToolTip content="Voir les fichiers">
                        <Files width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button onClick={handleDownloadAllFiles} type="button">
                      <ToolTip content="Tout télécharger">
                        <Download width={20} height={20} />
                      </ToolTip>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsShowFilesDialogOpen(true)}
                      type="button"
                    >
                      <ToolTip content="Voir les fichiers">
                        <Files width={20} height={20} />
                      </ToolTip>
                    </button>
                    <button onClick={handleDownloadAllFiles} type="button">
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
          <h2 className={styles.transferElement__details__title}>
            {transfer.name}
          </h2>
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
      <ConfirmDialog
        title="Supprimer le transfert"
        onClose={handleOnConfirmDeleteDialogOpen}
        open={isConfirmDeleteDialogOpen}
      >
        <p>Êtes-vous sûr de vouloir supprimer ce transfert ?</p>
      </ConfirmDialog>
      <Dialog
        title="Modifier le transfert"
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      >
        <EditTransferForm
          isLoading={isUpdateLoading}
          name={transfer.name}
          description={transfer.description}
          onSubmit={handleSubmitEdit}
        />
      </Dialog>
      <Dialog
        style={{
          width: "636px",
          minHeight: "380px",
          maxWidth: "100%",
        }}
        title="Partagé avec"
        onOpenChange={setIsUsersEditDialogOpen}
        open={isUsersEditDialogOpen}
      >
        <EditUsersForm
          transferId={transfer.id}
          isLoading={isUpdateLoading}
          updateUsersTransfer={handleUpdateTransferUsers}
        />
      </Dialog>
      <Dialog
        style={{
          width: "750px",
          minHeight: "200px",
          maxWidth: "100%",
        }}
        title="Fichiers partagés"
        onOpenChange={setIsFilesEditDialogOpen}
        open={isFilesEditDialogOpen}
      >
        <EditFilesForm
          transferId={transfer.id}
          isLoading={isUpdateLoading}
          updateFilesTransfer={handleUpdateTransferFiles}
        />
      </Dialog>
      <Dialog
        // style={{
        //   width: "750px",
        //   minHeight: "200px",
        //   maxWidth: "100%",
        // }}
        title="Fichiers partagés"
        onOpenChange={setIsShowFilesDialogOpen}
        open={isShowFilesDialogOpen}
      >
        <ShowTransferFiles transferId={transfer.id} />
      </Dialog>
    </>
  );
};
