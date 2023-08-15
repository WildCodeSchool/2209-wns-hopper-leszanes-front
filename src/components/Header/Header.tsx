import { Link, NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";
import styles from "./Header.module.scss";
import { Navbar } from "../Navbar/Navbar";
import { MobileNavbar } from "../MobileNavbar/MobileNavbar";
import { useAuth } from "../../contexts/authContext";
import { UserMenu } from "../UserMenu/UserMenu";
import { Logo } from "../Logo";

export const Header = () => {
  const { user } = useAuth();
  return (
    <div>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <Logo width={100} height={70} />
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
        <Link to="/" className={styles.logo}>
          <Logo width={100} height={70} />
        </Link>
        <MobileNavbar />
      </header>
    </div>
  );
};
