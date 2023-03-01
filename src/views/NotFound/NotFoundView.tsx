import { Link } from "react-router-dom";

export const NotFoundView = () => {
  return (
    <div>
      <h1>404 page not found</h1>
      <Link to="/">Retourner à la page d'accueil</Link>
    </div>
  );
};
