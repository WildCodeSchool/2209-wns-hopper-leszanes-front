/* eslint-disable jsx-a11y/media-has-caption */
import {
  FileArchiveIcon,
  FileAudio2,
  FileQuestionIcon,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import { generateKey } from "../../../../utils/generateKey";
import { humanFileSize } from "../../../../utils/file";
import styles from "./FilesList.module.scss";
import { SvgIcon } from "./SvgIcon";
import { Button } from "../../../../components/Button/Button";
import { ToolTip } from "../../../../components/ToolTip/ToolTip";

export type FilesListProps = {
  files: File[];
  handleRemoveFile: (currentFile: File) => void;
};

export const FilesList = ({ files, handleRemoveFile }: FilesListProps) => {
  const displayFileType = useCallback((type: string) => {
    if (type.includes("image")) {
      return "img";
    }
    if (type.includes("application/pdf")) {
      return "pdf";
    }
    if (type.includes("application")) {
      return "app";
    }
    return type.split("/")[0].split("+")[0];
  }, []);

  const preview = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      if (file.type.includes("image")) {
        return <img className={styles.image} src={url} alt={file.name} />;
      }
      if (file.type.includes("video")) {
        return <video className={styles.video} src={url} />;
      }
      // audio files
      if (file.type.includes("audio")) {
        return <FileAudio2 width={50} height={50} strokeWidth={1} />;
      }
      if (file.type.includes("application/pdf")) {
        return <SvgIcon className={styles.pdf} />;
      }

      if (file.type.includes("zip")) {
        return (
          <FileArchiveIcon
            style={{ color: "#f5b207" }}
            width={50}
            height={50}
            strokeWidth={1}
            className={styles.image}
          />
        );
      }
      return (
        <p>
          {file.type === "" ? (
            <FileQuestionIcon width={50} height={50} strokeWidth={1} />
          ) : (
            <span className={styles.fileType}>
              {displayFileType(file.type)}
            </span>
          )}
        </p>
      );
    },
    [displayFileType]
  );

  const truncate = useCallback((str: string, n = 15) => {
    return str.length > n ? `${str.substr(0, n - 1)}...` : str;
  }, []);

  return (
    <div className={styles.filesContainer}>
      <ul className={styles.filesList}>
        {files.map((file) => (
          <li key={generateKey(file.name)}>
            {preview(file)}
            <ToolTip content={file.name}>
              <p>{truncate(file.name)}</p>
            </ToolTip>
            <p className={styles.fileSize}>{humanFileSize(file.size)}</p>
            <Button
              variant="destructive"
              className={styles.removeFile}
              onClick={() => {
                const fileToRemove = files.find((f) => f.name === file.name);
                if (fileToRemove) {
                  handleRemoveFile(fileToRemove);
                }
              }}
            >
              <Trash2 width={20} height={15} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
