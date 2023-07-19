import { memo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Edit2, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import styles from "./UserMenu.module.scss";
import { useAuth } from "../../contexts/authContext";

const UserMenuComponent = () => {
  const { setUser } = useAuth();
  const apolloClient = useApolloClient();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.textIcon}>
        Mon profil
        <User className={styles.icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className={styles.dropdownMenuContainer}
        >
          <DropdownMenu.Arrow className={styles.dropdownArrow} />
          <DropdownMenu.Item className={styles.dropdownItem} asChild>
            <NavLink to="/profile" className={styles.textIcon}>
              Mon compte <Edit2 className={styles.icon} />
            </NavLink>
          </DropdownMenu.Item>
          <DropdownMenu.Item className={styles.dropdownItem} asChild>
            <button
              className={styles.textIcon}
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                apolloClient.clearStore();
              }}
            >
              Déconnexion <LogOut className={styles.icon} />
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const UserMenu = memo(UserMenuComponent);
