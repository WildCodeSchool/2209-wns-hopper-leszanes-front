import { Folders, Home, Contact, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" data-testid="home">
            <Home size="30" />
            <span data-test-id="Accueil">Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transfers" data-testid="transfers">
            <Folders size="30" />
            <span data-test-id="Transfers">Transferts</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" data-testid="upload">
            <Upload size="30" />
            <span data-test-id="Upload">Upload</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacts" data-testid="contacts">
            <Contact size="30" />
            <span>Contacts</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
