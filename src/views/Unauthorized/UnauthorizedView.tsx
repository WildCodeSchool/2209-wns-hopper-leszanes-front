import { Link } from "react-router-dom";

export const UnauthorizedView = () => {
  return (
    <div>
      <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
      <Link to="/">Retourner à l'accueil</Link>
      <Link to="/login">Se connecter</Link>
    </div>
  );
};
