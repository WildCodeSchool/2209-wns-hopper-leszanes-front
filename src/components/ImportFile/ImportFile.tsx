import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { InputGroup } from "../InputGroup/InputGroup";
import { InputGroup2 } from "../Test/Test";
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
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const { user } = useAuth();
  const files = fileList ? [...fileList] : [];
  const [uploadDescription, setUploadDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [doCreateFileMutation, { loading }] =
    useMutation<UploadResponse>(createFile);

  useEffect(() => {
    if (fileList) {
      if (fileList.length <= 1) {
        const strTitle = fileList[0].name.split(".");
        setUserFileName(strTitle[0]);
        setFileType(strTitle[1]);
        setFileSize(fileList[0].size);
      } else {
        let descriptionFilesNames = "Contient les fichiers suivants:";
        Array.from(fileList).forEach((file) => {
          descriptionFilesNames += `\n-${file.name}`;
        });
        setUploadDescription(descriptionFilesNames);
      }
    }
  }, [fileList]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileList(e.target.files);
    }
  };
  const doCreateFile = async (
    name: string,
    fileName: string,
    description: string,
    type: string,
    is_private: boolean,
    size: number,
    created_by: number
  ) => {
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
            fileName,
            description,
            type,
            is_private,
            size,
            created_by,
          },
        },
      });
    } catch (err) {
      console.log(err);
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
    console.log(formData);
    axios
      .post("http://localhost:4000/files/upload", formData)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          const name = "test";
          if (user && userFileName && uploadDescription && fileType) {
            doCreateFile(
              name,
              userFileName,
              uploadDescription,
              fileType,
              isPrivate,
              fileSize,
              Number(user.id)
            );
          }
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.sendFileContainer}>
      <div>
        <h1>Importer un fichier</h1>

        <InputGroup
          label="Upload file"
          name="inputTag"
          onChange={handleFileChange}
          type="file"
          disabled={loading}
          multiple
        />

        <form onSubmit={handleUploadSubmit}>
          <InputGroup
            label="Nom du fichier"
            name="fileName"
            type="text"
            placeholder="Mon fichier"
            inputMode="text"
            disabled={loading}
            value={userFileName}
            onChange={(e) => setUserFileName(e.target.value)}
          />
          <InputGroup
            as="textarea"
            label="Description"
            name="description"
            type="textarea"
            placeholder="Description"
            inputMode="text"
            disabled={loading}
            value={uploadDescription}
            onChange={(e) => setUploadDescription(e.target.value)}
          />
          <InputGroup2
            as="input"
            type="checkbox"
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
              disabled={loading}
            />
          )}

          <button disabled={loading} type="submit">
            {isPrivate ? "Envoyer" : "Obtenir le lien"}
          </button>
        </form>
        {loading && <p>Chargement...</p>}
      </div>
    </div>
  );
};
