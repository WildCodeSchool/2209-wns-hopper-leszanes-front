import { useFiles } from "./useFiles";
import { File } from "../types/File";

export const useDownloadAllTransferFiles = () => {
  const { download } = useFiles();
  const downloadAllFiles = async (fileList: File[]) => {
    const files = fileList.map((f) => f.name);
    await download(files, fileList);
  };

  return { downloadAllFiles };
};
