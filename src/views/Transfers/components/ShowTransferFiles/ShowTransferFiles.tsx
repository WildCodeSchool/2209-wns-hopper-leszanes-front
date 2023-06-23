import { Download } from "lucide-react";
import { LegacyRef, forwardRef, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { File } from "../../../../types/File";
import styles from "./ShowTransferFiles.module.scss";
import { Button } from "../../../../components/Button/Button";
import { humanFileSize } from "../../../../utils/file";
import { InputGroup } from "../../../../components/InputGroup/InputGroup";
import { useFiles } from "../../../../hooks/useFiles";
import { getCurrentUserTransferFiles } from "../../../../graphql/transfer/getCurrentUserTransferFiles";
import { Loader } from "../../../../components/Loader/Loader";

export type ShowTransferFilesProps = {
  transferId: number;
};

export const ShowTransferFiles = forwardRef(
  ({ transferId }: ShowTransferFilesProps, ref: LegacyRef<HTMLDivElement>) => {
    const {
      data: transferFilesData,
      loading: isLoadingFiles,
      error: errorFiles,
    } = useQuery<{
      getCurrentUserTransferFiles: File[];
    }>(getCurrentUserTransferFiles, {
      variables: {
        getCurrentUserTransferFilesId: transferId,
      },
    });
    const transferFiles = transferFilesData?.getCurrentUserTransferFiles ?? [];
    const { download } = useFiles();
    const initualLoadingRef = useRef(true);
    useMemo(() => {
      initualLoadingRef.current = true;
    }, []);
    const [selectedFiles, setSelectedFiles] = useState<
      { fileName: string; name: string }[]
    >([]);

    const handleSelectAll = () => {
      if (selectedFiles.length === transferFiles.length) {
        setSelectedFiles([]);
      } else {
        setSelectedFiles(
          transferFiles.map((file) => {
            return {
              fileName: file.fileName,
              name: file.name,
            };
          })
        );
      }
    };

    const handleOnSelectChange = (fileName: string) => {
      if (selectedFiles.find((fn) => fn.fileName === fileName)) {
        setSelectedFiles((prev) =>
          prev.filter((fn) => fn.fileName !== fileName)
        );
      } else {
        const file = transferFiles.find((fn) => fn.fileName === fileName);
        if (!file) return;
        setSelectedFiles((prev) => [
          ...prev,
          {
            fileName: file.fileName,
            name: file.name,
          },
        ]);
      }
    };

    if (isLoadingFiles && initualLoadingRef.current) {
      initualLoadingRef.current = false;
      return (
        <div className={styles.editFilesForm}>
          <div className={styles.editFilesForm__loader}>
            <Loader />
          </div>
        </div>
      );
    }

    if (errorFiles) {
      return (
        <div className={styles.editFilesForm}>
          <p className={styles.editFilesForm__error}>
            Une erreur est survenue lors du chargement des fichiers.
          </p>
        </div>
      );
    }
    return (
      <div ref={ref} className={styles.showTransferFiles}>
        {transferFiles.length > 0 && (
          <>
            <p className={styles.showTransferFiles__description}>
              Vous pouvez télécharger les fichiers de ce transfert.
            </p>
            <InputGroup
              width="max-content"
              type="checkbox"
              name="selectAllFiles"
              label="Tout sélectionner"
              onChange={handleSelectAll}
              checked={
                selectedFiles.length === transferFiles.length &&
                transferFiles.length > 0
              }
              placeholder=""
              inputMode="none"
            />
          </>
        )}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
        <div className={styles.showTransferFiles__files}>
          {transferFiles.length > 0 ? (
            transferFiles.map((file) => (
              <div key={file.id} className={styles.showTransferFiles__file}>
                <div className={styles.showTransferFiles__file__header}>
                  <InputGroup
                    width="max-content"
                    type="checkbox"
                    name={`transfer-file-${file.id}`}
                    label={file.name}
                    onChange={() => {
                      handleOnSelectChange(file.fileName);
                    }}
                    checked={
                      selectedFiles.find(
                        (fn) => fn.fileName === file.fileName
                      ) !== undefined
                    }
                    placeholder=""
                    inputMode="none"
                  />
                  <Button
                    variant="muted"
                    icon={<Download width={15} height={15} />}
                    onClick={() =>
                      download(
                        { fileName: file.fileName, name: file.name },
                        transferFiles
                      )
                    }
                  />
                </div>
                <p>
                  {new Date(file.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - {humanFileSize(file.size)}
                </p>
              </div>
            ))
          ) : (
            <p className={styles.showTransferFiles__notShared}>
              Ce transfert ne contient aucun fichier.
            </p>
          )}
        </div>
        {selectedFiles.length > 1 && (
          <Button
            icon={<Download width={35} height={35} />}
            variant="muted"
            className={styles.showTransferFiles__downloadAll}
            onClick={() => {
              download(selectedFiles, transferFiles);
              setSelectedFiles([]);
            }}
          />
        )}
      </div>
    );
  }
);
