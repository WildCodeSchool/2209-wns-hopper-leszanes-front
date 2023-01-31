import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@apollo/client";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import styles from "./LoginView.module.scss";
import { signIn } from "../../graphql/singIn";
import { UserWithToken } from "../../types/UserWithToken";
import { useAuth } from "../../contexts/authContext";

type SignInFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    email: HTMLInputElement;
    password: HTMLInputElement;
  };
};

type LoginResponse = {
  signIn: UserWithToken;
};

export const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [wrongCredentials, setWrongCredential] = useState(false);
  const icon = showPassword ? <EyeOff /> : <Eye />;
  const [doSigninMutation, { loading }] = useMutation<LoginResponse>(signIn);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      navigate((location.state?.from as string) || "/", {
        replace: true,
      });
    }
  }, [location, navigate, user]);

  const doSignIn = async (email: string, password: string) => {
    try {
      const { data } = await doSigninMutation({
        variables: {
          email,
          password,
        },
      });
      if (!loading && data) {
        localStorage.setItem("token", data.signIn.token);
        setUser(data.signIn.user);
        setWrongCredential(false);
      }

      if (!loading && !data) {
        setWrongCredential(true);
      }
    } catch (err) {
      setWrongCredential(true);
    }
  };
  const handleSubmit = async (e: SignInFormEvent) => {
    e.preventDefault();
    setWrongCredential(false);
    const email = e.target.email.value;
    const password = e.target.password.value;
    await doSignIn(email, password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      navigate((location.state?.from as string) || "/", {
        replace: true,
      });
    }
  };
  return (
    <div className={styles.loginContainer}>
      <div>
        <h1>Se connecter</h1>
        <form onSubmit={handleSubmit}>
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
            placeholder="MyPassword123"
            disabled={loading}
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
          <button disabled={loading} type="submit">
            Se connecter
          </button>
          <NavLink to="/register">S'enregistrer</NavLink>
        </form>
        {loading && <p>Chargement...</p>}
        {!loading && wrongCredentials && (
          <p>Mauvais email ou mauvais mot de passe</p>
        )}
      </div>
    </div>
  );
};
