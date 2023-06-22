import { useMutation, useQuery } from "@apollo/client";
import { Trash2, Upload, X } from "lucide-react";
import {
  ChangeEvent,
  LegacyRef,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import axios, { AxiosProgressEvent } from "axios";
import { Button } from "../../../../components/Button/Button";
import styles from "./EditFilesForm.module.scss";
import { Loader } from "../../../../components/Loader/Loader";
import { File } from "../../../../types/File";
import { getCurrentUserTransferFiles } from "../../../../graphql/transfer/getCurrentUserTransferFiles";
import { ProgressBar } from "../../../../components/ProgressBar/ProgressBar";
import { useToast } from "../../../../contexts/hooks/ToastContext";
import { UploadFormEvent } from "../../../../types/UploadFormEvent";
import { UploadFilesResponse } from "../../../../types/UploadFilesResponse";
import { UploadResponse } from "../../../../types/UploadResponse";
import { createFile } from "../../../../graphql/file/createFile";

export type EditFilesFormProps = {
  isLoading?: boolean;
  transferId: number;
  updateFilesTransfer: (files: File[]) => Promise<void>;
};

export const EditFilesForm = forwardRef(
  (
    { transferId, isLoading, updateFilesTransfer }: EditFilesFormProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const {
      data: dataTransferFiles,
      loading: isLoadingTransferFiles,
      error: transferFilesError,
      refetch: refetchTransferFiles,
    } = useQuery<{
      getCurrentUserTransferFiles: File[];
    }>(getCurrentUserTransferFiles, {
      variables: { getCurrentUserTransferFilesId: transferId },
    });
    const [fileList, setFileList] = useState<FileList>();
    const files = fileList ? [...fileList] : [];
    const [completed, setCompleted] = useState<number>(0);
    const { createToast } = useToast();
    const [doCreateFileMutation, { loading: fileLoading }] =
      useMutation<UploadResponse>(createFile);
    const transferFiles = dataTransferFiles?.getCurrentUserTransferFiles ?? [];

    const initualLoadingRef = useRef(true);
    useMemo(() => {
      initualLoadingRef.current = true;
    }, []);

    if ((isLoadingTransferFiles || isLoading) && initualLoadingRef.current) {
      initualLoadingRef.current = false;
      return (
        <div className={styles.editFilesForm}>
          <div className={styles.editFilesForm__loader}>
            <Loader />
          </div>
        </div>
      );
    }

    if (transferFilesError) {
      return (
        <div className={styles.editFilesForm}>
          <p className={styles.editFilesForm__error}>
            Une erreur est survenue.
          </p>
        </div>
      );
    }

    const deleteTransferFile = async (fileId: number) => {
      const newTransferFiles = transferFiles.filter(
        (transferFile) => transferFile.id !== fileId
      );
      await updateFilesTransfer(newTransferFiles);
      refetchTransferFiles();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFileList(e.target.files);
      } else {
        setFileList(undefined);
      }
    };

    const handleRemoveFile = () => {
      // TODO : remove file from list
    };

    const generateKey = (pre: string) => {
      return `${pre}_${new Date().getTime()}`;
    };

    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
      const { loaded, total } = progressEvent;
      if (total !== undefined) {
        const percent = Math.floor((loaded * 100) / total);
        setCompleted(percent);
      }
    };

    const doCreateFile = async (name: string, type: string, size: number) => {
      const transferIdNumber = Number(transferId);
      try {
        await doCreateFileMutation({
          variables: {
            data: {
              name,
              type,
              size,
              transferId: transferIdNumber,
            },
          },
        });
        refetchTransferFiles();
        setFileList(undefined);
        setCompleted(0);
      } catch (err) {
        createToast({
          id: "create-file-error",
          title: "Une erreur est survenue",
          description: "Erreur lors de la création du fichier",
          variant: "error",
        });
        throw new Error(JSON.stringify(err));
      }
    };

    const handleUploadSubmit = (e: UploadFormEvent) => {
      e.preventDefault();
      if (!fileList) {
        return;
      }
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`files`, file, file.name);
      });
      axios
        .post<{ filesUpload: UploadFilesResponse[] }>(
          "http://localhost:4000/files/upload",
          formData,
          {
            onUploadProgress,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.filesUpload.length > 0) {
            res.data.filesUpload.forEach((file) => {
              doCreateFile(file.filename, file.mimetype, file.size);
            });
          }
        })
        .catch(() => {
          createToast({
            id: "upload-error",
            title: "Une erreur est survenue",
            description: "Erreur lors de l'upload du fichier",
            variant: "error",
          });
        });
    };

    return (
      <div ref={ref} className={styles.editFilesForm}>
        <p className={styles.editFilesForm__description}>
          Vous pouvez modifier les fichiers qui sont associés à ce transfert.
        </p>
        {!fileList && (
          <div className={styles.editFilesForm__files}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
            {transferFiles.length > 0 ? (
              transferFiles.map((file) => (
                <div key={file.id} className={styles.editFilesForm__file}>
                  <p>{file.name}</p>
                  <Button
                    variant="destructive"
                    icon={<Trash2 width={15} height={15} />}
                    onClick={() => deleteTransferFile(file.id)}
                  />
                </div>
              ))
            ) : (
              <p className={styles.editFilesForm__notShared}>
                Ce transfert ne contient aucun fichier.
              </p>
            )}
          </div>
        )}
        <form onSubmit={handleUploadSubmit}>
          <div className={styles.editFilesForm__upload}>
            <label htmlFor="file" className={styles.labelImportFile}>
              <Upload size="25" className={styles.uploadSvg} />
              Mettre en ligne vos fichiers
              <input
                type="file"
                name="file"
                id="file"
                className={styles.inputfile}
                multiple
                onChange={handleFileChange}
              />
            </label>
            <Button
              isLoading={(isLoadingTransferFiles || isLoading) ?? fileLoading}
              type="submit"
            >
              Envoyer
            </Button>
          </div>
          <ProgressBar
            bgcolor="#b2e4eb"
            completed={completed}
            textColor="#333"
            fullText="Terminé"
          />
        </form>
        <div className={styles.filesList}>
          {fileList &&
            files.map((file, index) => (
              <div
                key={generateKey(file.name)}
                className={styles.hoverForRemoveCross}
              >
                <div className={styles.titleRemoveContainer}>
                  <p>{file.name}</p>
                  <X
                    size="20"
                    color="#df2525"
                    className={styles.removeFileSvg}
                    onClick={handleRemoveFile}
                    id={index}
                  />
                </div>
                <p>
                  {file.size} · {file.type.split("/").pop()}
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  }
);
