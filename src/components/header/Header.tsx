import zanelogo from "../../assets/images/zanelogo.png";
import styles from "./Header.module.scss";
import { Navbar } from "../navbar/Navbar";

export const Header = () => {
  return (
    <header className={styles.header}>
      <img src={zanelogo} alt="" className={styles.logo} />
      <h1>Ztransfert</h1>
      <Navbar />
      <button className={styles.profileButton} type="button">
        Icon
      </button>
    </header>
  );
};
