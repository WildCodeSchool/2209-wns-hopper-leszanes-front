import { Folders, Upload, Home, Contact, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "./MobileNavbar.module.scss";

export const MobileNavbar = () => {
  return (
    <nav className={styles.mobileNavbar}>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/">
            <Home />
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transfers">
            <Folders />
            <span>Transferts</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" className={styles.uploadButton}>
            <Upload size={35} />
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacts">
            <Contact />
            <span>Contacts</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <User />
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
