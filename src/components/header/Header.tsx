import { NavLink } from "react-router-dom";
import zanelogo from "../../assets/images/zanelogo.png";
import styles from "./Header.module.scss";
import { Navbar } from "../navbar/Navbar";
import { MobileNavbar } from "../mobileNavbar/MobileNavbar";
import { useAuth } from "../../contexts/authContext";
import { UserMenu } from "../UserMenu/UserMenu";

export const Header = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className={styles.header}>
        <img src={zanelogo} alt="" className={styles.logo} />
        <Navbar />
        {user ? (
          <NavLink to="/profile" className={styles.profileButton}>
            <UserMenu />
          </NavLink>
        ) : (
          <NavLink to="/login">Se connecter</NavLink>
        )}
      </header>
      <header className={styles.responsiveHeader}>
        <img src={zanelogo} alt="Ztransfert_logo" className={styles.logo} />
        <MobileNavbar />
      </header>
    </div>
  );
};
