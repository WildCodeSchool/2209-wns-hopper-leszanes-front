import { User } from "../../types/User";
import { Link } from "../Link/Link";
import styles from "./ContactItem.module.scss";

export type ContactItemProps = {
  contact: User;
};

export const ContactItem = ({ contact }: ContactItemProps) => {
  return (
    <Link to={String(contact.id)} className={styles.contactItem}>
      <span>{contact.name}</span>
      <span>{contact.email}</span>
    </Link>
  );
};
