import { Trash2Icon, Upload } from "lucide-react";
import { useRef } from "react";
import styles from "./ImportFiles.module.scss";
import { Button } from "../../../../components/Button/Button";
import { FilesList } from "../FilesList/FilesList";
import { humanFileSize } from "../../../../utils/file";

export type ImportFilesProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleRemoveFile: (currentFile: File) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const ImportFiles = ({
  files,
  setFiles,
  handleRemoveFile,
  handleFileChange,
  setStep,
}: ImportFilesProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.importFiles}>
      <label htmlFor="file" className={styles.importFilesLabel}>
        <Upload width={25} height={25} />
        {files.length > 0 ? (
          <h2 className={styles.filesInfos}>
            {files.length} {files.length > 1 ? "fichiers" : "fichier"} -{" "}
            {humanFileSize(files.reduce((acc, file) => acc + file.size, 0))}
          </h2>
        ) : (
          <h2 className={styles.importFilesTitle}>
            Glissez-déposez vos fichiers ici
          </h2>
        )}
        <input
          ref={ref}
          type="file"
          name="file"
          id="file"
          multiple
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <div className={styles.buttonsContainer}>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setFiles([]);
                if (ref.current) {
                  ref.current.value = "";
                }
              }}
            >
              <Trash2Icon width={25} height={25} />
            </Button>
            <Button
              type="button"
              onClick={() => setStep(2)}
              className={styles.button}
            >
              Valider
            </Button>
          </div>
        )}
      </label>
      <div className={styles.filesList}>
        {files.length > 0 ? (
          <FilesList files={files} handleRemoveFile={handleRemoveFile} />
        ) : (
          <div className={styles.empty}>
            <iframe
              style={{
                width: "100%",
                height: "30vh",
              }}
              title="lottie-file"
              src="https://lottie.host/?file=5b8d2861-0371-4e15-83f6-42873f002e25/cV2u8IspUp.json"
            />
            <h3>Rien ici pour le moment</h3>
          </div>
        )}
      </div>
    </div>
  );
};
