import styles from "./Navbar.module.scss";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <a href="#Accueil">Accueil</a>
        </li>
        <li>
          <a href="#Fichiers">Mes fichiers</a>
        </li>
        <li>
          <a href="#Contacts">Mes contacts</a>
        </li>
      </ul>
    </nav>
  );
};
