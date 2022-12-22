import styles from "./MobileNavbar.module.scss";

export const MobileNavbar = () => {
  return (
    <nav className={styles.mobileNavbar}>
      <ul className={styles.navLinks}>
        <li>
          <a href="#Fichiers">
            <span>icon</span>
            <span>Text</span>
          </a>
        </li>
        <li>
          <a href="#Fichiers">
            <span>icon</span>
            <span>Text</span>
          </a>
        </li>
        <li>
          <a href="#Fichiers" className={styles.uploadButton}>
            <span>icon</span>
            <span>Text</span>
          </a>
        </li>
        <li>
          <a href="#Fichiers">
            <span>icon</span>
            <span>Text</span>
          </a>
        </li>
        <li>
          <a href="#Fichiers">
            <span>icon</span>
            <span>Text</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
