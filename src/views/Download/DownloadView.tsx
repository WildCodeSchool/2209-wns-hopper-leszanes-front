import { useParams } from "react-router-dom";

export const DownloadView = () => {
  const { token } = useParams();
  const decodedToken = token?.replaceAll("-", ".");
  return <p>{decodedToken}</p>;
};
