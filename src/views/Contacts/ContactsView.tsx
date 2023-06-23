import { Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";
import styles from "./ContactsView.module.scss";
import { getCurrentUserContacts } from "../../graphql/user/getCurrentUserContacts";
import { User } from "../../types/User";
import { Loader } from "../../components/Loader/Loader";
import { Link } from "../../components/Link/Link";
import { ContactItem } from "../../components/ContactItem/ContactItem";

export const ContactsView = () => {
  const { data, loading, error } = useQuery<{
    getCurrentUserContacts: User[];
  }>(getCurrentUserContacts);
  console.log(data);

  if (loading) {
    return (
      <div className={styles.contactsView}>
        <Loader />
      </div>
    );
  }

  if (error) {
    <div className={styles.contactsView}>
      <p>{error.message}</p>
    </div>;
  }

  const contacts = data?.getCurrentUserContacts ?? [];

  return (
    <div className={styles.contactsView}>
      <aside className={styles.contactsView__aside}>
        {contacts.length > 0 ? (
          <>
            <Link to="new" className={styles.contactsView__addContact}>
              Ajouter un contact
            </Link>
            <ul className={styles.contactsView__contacts}>
              {contacts.map((contact) => (
                <li key={contact.id} className={styles.contactsView__contact}>
                  <ContactItem contact={contact} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles.contactsView__noContacts}>
            <p>Pas de contacts ?</p>
            <Link to="/contacts/new">Ajouter un contact</Link>
          </div>
        )}
      </aside>
      <main className={styles.contactsView__main}>
        <Outlet />
      </main>
    </div>
  );
};
