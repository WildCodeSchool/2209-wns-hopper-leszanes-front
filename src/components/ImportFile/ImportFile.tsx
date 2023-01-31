import { ChangeEvent, useState } from "react";
import { InputGroup } from "../InputGroup/InputGroup";
import styles from "./ImportFile.module.scss";

export const ImportFile = () => {
  const [isLink, setIsLink] = useState(false);
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    console.log(file);

    // // 👇 Uploading the file using the fetch API to the server
    // fetch("https://httpbin.org/post", {
    //   method: "POST",
    //   body: file,
    //   // 👇 Set headers manually for single file upload
    //   headers: {
    //     "content-type": file.type,
    //     "content-length": `${file.size}`, // 👈 Headers need to be a string
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error(err));
  };

  return (
    <div className={styles.sendFileContainer}>
      <div>
        <h1>Importer un fichier</h1>
        <input type="file" onChange={handleFileChange} />
        <form>
          <InputGroup
            label="Fichier"
            name="file"
            type="text"
            placeholder="Mon fichier"
            // disabled={loading}
          />
          <InputGroup
            label="Titre"
            name="depot"
            type="text"
            placeholder="Mon super dépôt"
            // disabled={loading}
          />
          <InputGroup
            label="Mail expéditeur"
            name="mailfrom"
            type="text"
            placeholder="myemail@email.com"
            // disabled={loading}
          />
          <InputGroup
            label="Mail destinataire"
            name="mailto"
            type="text"
            placeholder="myemail@email.com"
            // disabled={loading}
          />
          <button
            // disabled={loading}
            type="button"
            onClick={() => {
              setIsLink(!isLink);
            }}
          >
            {isLink ? "Obtenir le lien" : "Envoyer par email"}
          </button>
          <button
            // disabled={loading}
            type="submit"
          >
            {isLink ? "Envoyer" : "Obtenir le lien"}
          </button>
          <button type="button" onClick={handleUploadClick}>
            Upload
          </button>
        </form>
        {/* {loading && <p>Chargement...</p>}
        {!loading && wrongCredentials && (
          <p>Mauvais email ou mauvais mot de passe</p>
        )} */}
      </div>
    </div>
  );
};
