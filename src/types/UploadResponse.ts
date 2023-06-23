export type UploadResponse = {
  createFile: {
    name: string;
    fileName: string;
    description: string;
    is_private: boolean;
  };
};
