import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { InputGroup } from "../InputGroup/InputGroup";
import { InputGroup2 } from "../Test/Test";
import styles from "./ImportFile.module.scss";
import { createFile } from "../../graphql/createFile";

type UploadFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    fileName: HTMLInputElement;
    description: HTMLInputElement;
    isPrivate: HTMLInputElement;
  };
};

type UploadResponse = {
  createFile: { name: string; description: string; is_private: boolean };
};

export const ImportFile = () => {
  const [fileList, setFileList] = useState<FileList>();
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const files = fileList ? [...fileList] : [];
  const [uploadDescription, setUploadDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [doCreateFileMutation, { loading }] =
    useMutation<UploadResponse>(createFile);

  useEffect(() => {
    if (fileList) {
      if (fileList.length <= 1) {
        const strTitle = fileList[0].name.split(".");
        setFileName(strTitle[0]);
        setFileType(strTitle[1]);
      } else {
        let filesNames = "Contient les fichiers suivants:";
        Array.from(fileList).forEach((file) => {
          filesNames += `\n-${file.name}`;
        });
        console.log(filesNames);
        setUploadDescription(filesNames);
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
    description: string,
    type: string,
    is_private: boolean
  ) => {
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
            description,
            type,
            is_private,
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
        if (fileName && uploadDescription && fileType) {
          doCreateFile(fileName, uploadDescription, fileType, isPrivate);
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
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
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
