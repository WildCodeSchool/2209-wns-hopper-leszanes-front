/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useRouteError } from "react-router-dom";

export const ErrorView = () => {
  const error: any = useRouteError();

  const generateLayout = () => {
    if (error) {
      return (
        <div>
          <h1>Erreur</h1>
          <p>Une erreur est survenue lors du chargement de la page</p>
          <Link to="/">Retourner à l'accueil</Link>
          <p>{error.message}</p>
          <div>
            <pre>{error.stack}</pre>
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>Erreur</h1>
        <p>Une erreur est survenue lors du chargement de la page</p>
        <Link to="/">Retourner à l'accueil</Link>
      </div>
    );
  };
  return <div>{generateLayout()}</div>;
};
