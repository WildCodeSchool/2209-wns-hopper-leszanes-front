import { ChangeEvent, useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { useMutation } from "@apollo/client";
import confetti from "canvas-confetti";
import { Upload, X } from "lucide-react";
import { InputGroup } from "../InputGroup/InputGroup";
import styles from "./ImportFile.module.scss";
import { useToast } from "../../contexts/hooks/ToastContext";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { UploadFilesResponse } from "../../types/UploadFilesResponse";
import { UploadResponse } from "../../types/UploadResponse";
import { UploadFormEvent } from "../../types/UploadFormEvent";
import { CreateTransferResponse } from "../../types/CreateTransferResponse";
import { createTransfer } from "../../graphql/createTransfer";
import { createFile } from "../../graphql/file/createFile";

export const ImportFile = () => {
  const [transferName, setTransferName] = useState<string>("");
  const [completed, setCompleted] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [doCreateFileMutation, { loading: fileLoading }] =
    useMutation<UploadResponse>(createFile);
  const { createToast } = useToast();
  const [doCreateTransferMutation] =
    useMutation<CreateTransferResponse>(createTransfer);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (currentFile: File) => {
    setFiles(files.filter((file) => file !== currentFile));
  };

  const doCreateTransfer = async (name: string, description: string) => {
    try {
      const res = await doCreateTransferMutation({
        variables: {
          data: {
            name,
            description,
            isPrivate,
          },
        },
      });
      return Number(res.data?.createTransfer.id);
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  };

  const doCreateFile = async (
    name: string,
    fileName: string,
    type: string,
    size: number,
    signature: string,
    transferId: number
  ) => {
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
            fileName,
            type,
            size,
            signature,
            transferId,
          },
        },
      });
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

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const { loaded, total } = progressEvent;
    if (total !== undefined) {
      const percent = Math.floor((loaded * 100) / total);
      setCompleted(percent);
    }
  };

  const handleUploadSubmit = async (e: UploadFormEvent) => {
    e.preventDefault();
    if (files.length <= 0) {
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file, file.name);
    });
    const transferId = await doCreateTransfer(
      transferName,
      transferDescription
    );
    axios
      .post<{ filesWithHash: UploadFilesResponse[] }>(
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
        console.log(res.data.filesWithHash);

        if (res.data.filesWithHash.length > 0) {
          res.data.filesWithHash.forEach((file) => {
            doCreateFile(
              file.originalname,
              file.filename,
              file.mimetype,
              file.size,
              file.signature,
              transferId
            );
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
      })
      .then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      })
      .catch(() =>
        createToast({
          id: "create-file-error-data",
          title: "Une erreur est survenue",
          description: "Erreur lors de la création du fichier",
          variant: "error",
        })
      );
  };
  const generateKey = (pre: string) => {
    return `${pre}_${new Date().getTime()}`;
  };
  return (
    <div className={styles.sendFileContainer}>
      <div>
        <h1>Importer un fichier</h1>
        <div className={styles.inputFileContainer}>
          {files.map((file) => (
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
                  onClick={() => handleRemoveFile(file)}
                />
              </div>
              <p>
                {file.size} · {file.type.split("/").pop()}
              </p>
            </div>
          ))}

          <label htmlFor="file" className={styles.labelImportFile}>
            <Upload size="25" className={styles.uploadSvg} />
            Chargez vos fichiers
            <input
              type="file"
              name="file"
              id="file"
              className={styles.inputfile}
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>

        <form onSubmit={handleUploadSubmit}>
          <InputGroup
            inputMode="text"
            label="Titre du transfer"
            name="transferName"
            type="text"
            placeholder="Dossier photos"
            disabled={fileLoading}
            value={transferName}
            onChange={(e) => setTransferName(e.target.value)}
          />
          <InputGroup
            as="textarea"
            label="Description"
            name="description"
            type="textarea"
            placeholder="Description"
            inputMode="text"
            disabled={fileLoading}
            value={transferDescription}
            onChange={(e) =>
              setTransferDescription(
                (e as ChangeEvent<HTMLTextAreaElement>).target.value
              )
            }
          />
          <InputGroup
            as="input"
            type="checkbox"
            placeholder=""
            inputMode="none"
            checked={isPrivate}
            onChange={() => setIsPrivate((prev) => !prev)}
            label="Privé"
            name="isPrivate"
          />

          <button disabled={fileLoading} type="submit">
            {isPrivate ? "Envoyer" : "Obtenir le lien"}
          </button>
          <ProgressBar
            bgcolor="#b2e4eb"
            completed={completed}
            textColor="#333"
            fullText="Terminé"
          />
        </form>
        {fileLoading && <p>Chargement...</p>}
      </div>
    </div>
  );
};
