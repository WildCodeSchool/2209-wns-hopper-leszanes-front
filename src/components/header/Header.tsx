import zanelogo from "../../assets/images/zanelogo.png";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <img src={zanelogo} alt="" className={styles.logo} />
      <h1>Ztransfert</h1>
    </header>
  );
};
