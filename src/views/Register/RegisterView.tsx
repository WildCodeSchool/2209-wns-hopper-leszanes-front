import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import styles from "./RegisterView.module.scss";
import { createUser } from "../../graphql/createUser";
import type { UserWithToken } from "../../types/UserWithToken";
import { useAuth } from "../../contexts/authContext";

type RegisterFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  };
};

type RegisterResponse = {
  createUser: UserWithToken;
};

export const RegisterView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const icon = showPassword ? <EyeOff /> : <Eye />;
  const [doSignupMutation, { loading }] =
    useMutation<RegisterResponse>(createUser);

  useEffect(() => {
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  }, [location, navigate, user]);

  const doSignUp = async (name: string, email: string, password: string) => {
    try {
      const { data } = await doSignupMutation({
        variables: {
          data: {
            name,
            email,
            password,
          },
        },
      });

      if (!loading && data) {
        localStorage.setItem("token", data.createUser.token);
        setUser(data.createUser.user);
      }

      if (!loading && !data?.createUser) {
        setShowError(true);
      }
    } catch (err) {
      setShowError(true);
    }
  };
  const handleSubmit = async (e: RegisterFormEvent) => {
    e.preventDefault();
    setShowError(false);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    await doSignUp(name, email, password);
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div>
        <h1>S'enregistrer</h1>
        <form onSubmit={handleSubmit}>
          <InputGroup
            label="Nom"
            name="name"
            type="text"
            placeholder="Gérard"
            disabled={loading}
          />
          <InputGroup
            label="Email"
            name="email"
            type="text"
            placeholder="myemail@email.com"
            disabled={loading}
          />
          <InputGroup
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="My@Password123"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {icon}
              </button>
            }
            disabled={loading}
            labelProps={{ className: styles.passwordLabel }}
          />
          <button disabled={loading} type="submit">
            Sign up
          </button>
        </form>
        {showError && <p>Merci d'entrer des informations valides</p>}
        {loading && <p>Chargement...</p>}
        {!loading && showError && <p>Mauvais email ou mauvais mot de passe</p>}
      </div>
    </div>
  );
};
