import { useFiles } from "./useFiles";
import { File } from "../types/File";

export const useDownloadAllTransferFiles = () => {
  const { download } = useFiles();
  const downloadAllFiles = async (fileList: File[]) => {
    const files = fileList.map((f) => {
      return { fileName: f.fileName, name: f.name, signature: f.signature };
    });

    await download(files, fileList);
  };

  return { downloadAllFiles };
};
