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
  const [transferId, setTransferId] = useState<number>();
  const [fileList, setFileList] = useState<FileList>();
  const [completed, setCompleted] = useState<number>(0);
  const files = fileList ? [...fileList] : [];
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [doCreateFileMutation, { loading: fileLoading }] =
    useMutation<UploadResponse>(createFile);
  const { createToast } = useToast();
  const [doCreateTransferMutation] =
    useMutation<CreateTransferResponse>(createTransfer);

  // useEffect(() => {
  //   if (fileList) {
  //     if (fileList.length <= 1) {
  //       const strTitle = fileList[0].name.split(".");
  //     } else {
  //       let descriptionFilesNames = "Contient les fichiers suivants:";
  //       Array.from(fileList).forEach((file) => {
  //         descriptionFilesNames += `\n-${file.name}`;
  //       });
  //       setTransferDescription(descriptionFilesNames);
  //     }
  //   }
  // }, [fileList]);

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

  const doCreateTransfer = async (name: string, description: string) => {
    try {
      await doCreateTransferMutation({
        variables: {
          data: {
            name,
            description,
            isPrivate,
          },
        },
      })
        .then((res) => {
          if (res.data) {
            setTransferId(Number(res.data.createTransfer.id));
          }
        })
        .catch((err) => {
          throw new Error(JSON.stringify(err));
        });
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  };

  const doCreateFile = async (name: string, type: string, size: number) => {
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
            type,
            size,
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

  const handleUploadSubmit = (e: UploadFormEvent) => {
    e.preventDefault();
    if (!fileList) {
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file, file.name);
    });
    doCreateTransfer(transferName, transferDescription);
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
            label="Envoyer par email"
            name="isPrivate"
          />
          {isPrivate && (
            <InputGroup
              label="Mail destinataire"
              name="mailto"
              type="text"
              inputMode="email"
              placeholder="myemail@email.com"
              disabled={fileLoading}
            />
          )}

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
