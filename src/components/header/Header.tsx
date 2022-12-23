import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import zanelogo from "../../assets/images/zanelogo.png";
import styles from "./Header.module.scss";
import { Navbar } from "../navbar/Navbar";
import { MobileNavbar } from "../mobileNavbar/MobileNavbar";

export const Header = () => {
  return (
    <div>
      <header className={styles.header}>
        <img src={zanelogo} alt="" className={styles.logo} />
        {/* <h1>Ztransfert</h1> */}
        <Navbar />
        <NavLink to="/profile" className={styles.profileButton}>
          <User />
        </NavLink>
      </header>
      <header className={styles.responsiveHeader}>
        <img src={zanelogo} alt="Ztransfert_logo" className={styles.logo} />
        <MobileNavbar />
      </header>
    </div>
  );
};
