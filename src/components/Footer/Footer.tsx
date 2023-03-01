import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Ztransfer - Transférer mes fichiers plus facilement - Powered by Les
        zânes {new Date().getFullYear()}
      </p>
    </footer>
  );
};
