import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { getCurrentUserContact } from "../../graphql/user/getCurrentUserContact";
import { Loader } from "../Loader/Loader";
import { User } from "../../types/User";
import { Link } from "../Link/Link";
import styles from "./Contact.module.scss";

export type ContactProps = {};

export const Contact = ({}: ContactProps) => {
  const { id } = useParams();
  const { data, loading, error } = useQuery<{
    getCurrentUserContact: User;
  }>(getCurrentUserContact, {
    variables: {
      getCurrentUserContactId: id,
    },
  });

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
    </div>
  );
};
