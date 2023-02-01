import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { InputGroup } from "../InputGroup/InputGroup";
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
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [uploadDescription, setUploadDescription] = useState<string>(
    "A great description"
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [doCreateFileMutation, { loading }] =
    useMutation<UploadResponse>(createFile);

  useEffect(() => {
    console.log("Use Effect");
    const strTitle = file?.name.split(".");
    if (strTitle) {
      setFileName(strTitle[0]);
      setFileType(strTitle[1]);
    }
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
    if (!file) {
      return;
    }
    if (e.target.fileName.value) {
      console.log(fileName);
    }
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:4000/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
        <label htmlFor="inputTag">
          Upload file
          <input
            id="inputTag"
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </label>

        {/* <ul>
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul> */}
        <form onSubmit={handleUploadSubmit}>
          <InputGroup
            label="Nom du fichier"
            name="fileName"
            type="text"
            placeholder="Mon fichier"
            disabled={loading}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <InputGroup
            label="Description"
            name="description"
            type="text"
            placeholder="Description"
            disabled={loading}
            value={uploadDescription}
            onChange={(e) => setUploadDescription(e.target.value)}
          />
          <InputGroup
            label="Mail destinataire"
            name="mailto"
            type="text"
            placeholder="myemail@email.com"
            disabled={loading}
          />
          <button
            disabled={loading}
            type="button"
            onClick={() => {
              setIsPrivate(!isPrivate);
            }}
          >
            {isPrivate ? "Obtenir le lien" : "Envoyer par email"}
          </button>
          <button disabled={loading} type="submit">
            {isPrivate ? "Envoyer" : "Obtenir le lien"}
          </button>
        </form>
        {loading && <p>Chargement...</p>}
      </div>
    </div>
  );
};
