import axios from "axios";
import { File } from "../types/File";
import { useToast } from "../contexts/hooks/ToastContext";

export const useFiles = () => {
  const { createToast } = useToast();

  const download = async (fileNames: string | string[], fileList: File[]) => {
    let fileType = "zip";
    let fileName = "files";

    if (Array.isArray(fileNames) && fileNames.length === 0) {
      // eslint-disable-next-line no-console
      createToast({
        id: "download-error",
        title: "Téléchargement",
        description: "Aucun fichier à télécharger",
        variant: "success",
      });
      return;
    }

    if (fileList.length === 0) {
      throw new Error("File list is empty");
    }

    if (!Array.isArray(fileNames)) {
      fileList.forEach((file) => {
        if (file.name === fileNames) {
          [, fileType] = file.type.split("/");
          fileName = file.name;
        }
      });
    }

    try {
      const response = await axios.get("http://localhost:4000/files/download", {
        responseType: "arraybuffer",
        params: {
          fileNames,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.${fileType}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      createToast({
        id: "upload-error",
        title: "Une erreur est survenue",
        description: "Erreur lors du téléchargement du/des fichier(s)",
        variant: "error",
      });
    }
  };
  // eslint-disable-next-line consistent-return
  return { download };
};
