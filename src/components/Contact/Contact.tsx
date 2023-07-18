import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUserContact } from "../../graphql/user/getCurrentUserContact";
import { Loader } from "../Loader/Loader";
import { User } from "../../types/User";
import { Link } from "../Link/Link";
import styles from "./Contact.module.scss";
import { Button } from "../Button/Button";
import { detachContact } from "../../graphql/user/detachContact";
import { useAuth } from "../../contexts/authContext";
import { useToast } from "../../contexts/hooks/ToastContext";

export const Contact = () => {
  const navigate = useNavigate();
  const apololClient = useApolloClient();
  const { createToast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();
  const { data, loading, error } = useQuery<{
    getCurrentUserContact: User;
  }>(getCurrentUserContact, {
    variables: {
      getCurrentUserContactId: id,
    },
  });

  const [doDeleteUserMutation, { loading: deleteContactIsLoading }] =
    useMutation<{ detachContact: boolean }>(detachContact);

  const deleteContact = async () => {
    try {
      const response = await doDeleteUserMutation({
        variables: {
          userId: Number(user?.id),
          contactId: id,
        },
      });
      if (response.data?.detachContact === true) {
        createToast({
          id: "contact-detached",
          description: "Le contact a été supprimé",
          title: "Contact supprimé",
          variant: "success",
        });
        apololClient.resetStore();
        navigate("/contacts");
        return;
      }
      throw new Error("Le contact n'a pas été supprimé");
    } catch (err) {
      createToast({
        id: "contact-detached",
        description: "Le contact n'a pas été supprimé",
        title: "Erreur",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.contact}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contact}>
        <p>{error.message}</p>
      </div>
    );
  }

  const contact = data?.getCurrentUserContact ?? null;

  if (!contact) {
    return (
      <div className={styles.contact}>
        <p>Le contact n'existe pas</p>
      </div>
    );
  }

  return (
    <div className={styles.contact}>
      <h1>{contact.name}</h1>
      <p>
        <Link
          to={`mailto:${contact.email}`}
          target="_blank"
          rel="noopener noreferer"
        >
          {contact.email}
        </Link>
      </p>
      <Button
        onClick={() => deleteContact()}
        variant="destructive"
        isLoading={deleteContactIsLoading}
      >
        Supprimer
      </Button>
    </div>
  );
};
