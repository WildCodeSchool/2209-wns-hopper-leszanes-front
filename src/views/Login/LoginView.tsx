import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import styles from "./LoginView.module.scss";

export const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const icon = showPassword ? <EyeOff /> : <Eye />;
  return (
    <div className={styles.loginContainer}>
      <div>
        <h1>Se connecter</h1>
        <form>
          <InputGroup
            label="Email"
            name="email"
            type="text"
            placeholder="myemail@email.com"
          />
          <InputGroup
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="MyPassword123"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {icon}
              </button>
            }
            labelProps={{ className: styles.passwordLabel }}
          />
        </form>
      </div>
    </div>
  );
};
