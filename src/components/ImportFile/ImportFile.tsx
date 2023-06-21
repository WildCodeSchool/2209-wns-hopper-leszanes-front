<<<<<<< Updated upstream
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { InputGroup } from "../InputGroup/InputGroup";
import styles from "./ImportFile.module.scss";
import { createFile } from "../../graphql/createFile";
import { useAuth } from "../../contexts/authContext";

type UploadFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    fileName: HTMLInputElement;
    description: HTMLInputElement;
    isPrivate: HTMLInputElement;
  };
};

type UploadResponse = {
  createFile: {
    name: string;
    fileName: string;
    description: string;
    is_private: boolean;
  };
};

export const ImportFile = () => {
  const [fileList, setFileList] = useState<FileList>();
  const [userFileName, setUserFileName] = useState<string>("");
  const [sendEmail, setSendEmail] = useState<string>("");
  const { user } = useAuth();
=======
import { ChangeEvent, useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { useMutation } from "@apollo/client";
import confetti from "canvas-confetti";
import { CloudOff, Upload, X } from "lucide-react";
import { InputGroup } from "../InputGroup/InputGroup";
import styles from "./ImportFile.module.scss";
import { createFile } from "../../graphql/createFile";
import { createTransfer } from "../../graphql/createTransfer";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { UploadFilesResponse } from "../../types/UploadFilesResponse";
import { CreateTransferResponse } from "../../types/CreateTransferResponse";
import { UploadResponse } from "../../types/UploadResponse";
import { UploadFormEvent } from "../../types/UploadFormEvent";

export const ImportFile = () => {
  const [transferName, setTransferName] = useState<string>("");
  const [transferId, setTransferId] = useState<number>();
  const [fileList, setFileList] = useState<FileList>();
  const [completed, setCompleted] = useState<number>(0);
>>>>>>> Stashed changes
  const files = fileList ? [...fileList] : [];
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [doCreateFileMutation, { loading: fileLoading }] =
    useMutation<UploadResponse>(createFile);
  const [doCreateTransferMutation] =
    useMutation<CreateTransferResponse>(createTransfer);

<<<<<<< Updated upstream
  useEffect(() => {
    if (fileList) {
      if (fileList.length <= 1) {
        const strTitle = fileList[0].name.split(".");
        setUserFileName(strTitle[0]);
      } else {
        let descriptionFilesNames = "Contient les fichiers suivants:";
        Array.from(fileList).forEach((file) => {
          descriptionFilesNames += `\n-${file.name}`;
        });
        setUploadDescription(descriptionFilesNames);
      }
    }
  }, [fileList]);
=======
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
>>>>>>> Stashed changes

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileList(e.target.files);
    } else {
      setFileList(undefined);
    }
  };
<<<<<<< Updated upstream
  const doCreateFile = async (
    name: string,
    fileName: string,
    description: string,
    type: string,
    is_private: boolean,
    size: number,
    created_by: number
  ) => {
=======

  const handleRemoveFile = () => {
    console.log("delete file");
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
>>>>>>> Stashed changes
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
<<<<<<< Updated upstream
            fileName,
            description,
=======
>>>>>>> Stashed changes
            type,
            size,
            transferId,
          },
        },
      });
    } catch (err) {
      console.error(err);
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
<<<<<<< Updated upstream
    console.log(formData.values());
    axios
      .post("http://localhost:4000/files/upload", formData)
      .then((res) => {
        if (res.data) {
          if (user && userFileName && uploadDescription) {
            doCreateFile(
              userFileName,
              res.data.data.fileName,
              uploadDescription,
              res.data.data.fileType,
              isPrivate,
              res.data.data.size,
              Number(user.id)
            );
          }
=======
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
>>>>>>> Stashed changes
        }
      )
      .then((res) => {
        if (res.data.filesUpload.length > 0) {
          res.data.filesUpload.forEach((file) => {
            doCreateFile(file.filename, file.mimetype, file.size);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .catch((err) => console.error(err));
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
<<<<<<< Updated upstream
            label="Nom du fichier"
            name="fileName"
            type="text"
            placeholder="Mon fichier"
            inputMode="text"
            disabled={loading}
            value={userFileName}
            onChange={(e) => {
              setUserFileName(
                (e as ChangeEvent<HTMLInputElement>).target.value
              );
            }}
=======
            inputMode="text"
            label="Titre du transfer"
            name="transferName"
            type="text"
            placeholder="Dossier photos"
            disabled={fileLoading}
            value={transferName}
            onChange={(e) => setTransferName(e.target.value)}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              disabled={loading}
              onChange={(e) =>
                setSendEmail(
                  (e as ChangeEvent<HTMLTextAreaElement>).target.value
                )
              }
=======
              disabled={fileLoading}
>>>>>>> Stashed changes
            />
          )}

          <button disabled={fileLoading} type="submit">
            {isPrivate ? "Envoyer" : "Obtenir le lien"}
          </button>
        </form>
        {fileLoading && <p>Chargement...</p>}
      </div>
    </div>
  );
};
