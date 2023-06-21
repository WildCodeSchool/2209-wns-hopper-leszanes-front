import { Link, NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";
import zanelogo from "../../assets/images/zanelogo.png";
import styles from "./Header.module.scss";
import { Navbar } from "../Navbar/Navbar";
import { MobileNavbar } from "../MobileNavbar/MobileNavbar";
import { useAuth } from "../../contexts/authContext";
import { UserMenu } from "../UserMenu/UserMenu";

export const Header = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className={styles.header}>
        <Link to="/">
          {" "}
          <img src={zanelogo} alt="" className={styles.logo} />
        </Link>

        <Navbar />
        {user ? (
          <NavLink to="/profile" className={styles.profileButton}>
            <UserMenu />
          </NavLink>
        ) : (
          <NavLink
            className={styles.profileButton}
            to="/login"
            style={{ gap: "5px" }}
          >
            Se connecter
            <LogIn />
          </NavLink>
        )}
      </header>
      <header className={styles.responsiveHeader}>
        <img src={zanelogo} alt="Ztransfert_logo" className={styles.logo} />
        <MobileNavbar />
      </header>
    </div>
  );
};
